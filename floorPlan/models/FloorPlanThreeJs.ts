import * as THREE from "three";
import Stats from "three/examples/jsm/libs/stats.module";
import CameraControls from "camera-controls";

import {
  IFloorPlanOptions,
  IContainerSizes,
  IFloorPlanItemOptions,
} from "../types/floorPlan";
import { IFloorPlanItem } from "../types/prepared";
import { FloorPlanItem } from "./FloorPlanItem";
import { CSS2DRenderer } from "three/examples/jsm/renderers/CSS2DRenderer";

CameraControls.install({ THREE });

export class FloorPlanThreeJs {
  private container: HTMLElement;

  private renderer: THREE.WebGLRenderer;
  private labelRenderer: CSS2DRenderer;
  private scene: THREE.Scene;
  private camera: THREE.OrthographicCamera;

  private clock: THREE.Clock;
  private controls: CameraControls;
  private raycaster: THREE.Raycaster;
  private hoveredItem: FloorPlanItem | null = null;

  private mouse: THREE.Vector2;
  private center: THREE.Vector3;

  private bgMesh: THREE.Mesh;
  private bgWidth: number;
  private bgHeight: number;

  private stats: Stats;

  private windowResizeHandler: () => void;

  constructor({
    containerId,
    bgTexture,
    bgColor,
    font,
    items,
    events,
  }: IFloorPlanOptions) {
    const container = document.getElementById(containerId);
    if (!container) {
      return;
    }
    this.container = container;
    this.windowResizeHandler = this.onWindowResize.bind(this);
    this.initRenderer();
    this.init2DRenderer();
    this.initScene(bgColor);
    this.initCamera();
    this.initBackground(bgTexture);
    this.initControls();
    this.initRayCaster();
    this.centerCamera();
    this.initStats();
    this.renderItems(items, {
      events: events?.item,
      font: font,
      onTextSync: this.render.bind(this),
    });
    this.render();
    this.animate();
  }

  private init2DRenderer() {
    const { width, height } = this.getContainerSizes();
    this.labelRenderer = new CSS2DRenderer();
    this.labelRenderer.setSize(width, height);
    this.labelRenderer.domElement.style.position = "absolute";
    this.labelRenderer.domElement.style.top = "0px";
    this.labelRenderer.domElement.style.pointerEvents = "none";
    this.container.appendChild(this.labelRenderer.domElement);
  }

  private initRenderer() {
    const { width, height } = this.getContainerSizes();
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setSize(width, height);
    this.container.appendChild(this.renderer.domElement);

    window.addEventListener("resize", this.windowResizeHandler, false);
  }

  private initScene(bgColor: string = "white") {
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(bgColor);
  }

  private initBackground(bgTexture: THREE.Texture) {
    this.bgWidth = bgTexture.source.data.naturalWidth;
    this.bgHeight = bgTexture.source.data.naturalHeight;

    this.center = new THREE.Vector3(this.bgWidth / 2, -this.bgHeight / 2, 0);

    const bgGeometry = new THREE.PlaneGeometry(this.bgWidth, this.bgHeight);
    const bgMaterial = new THREE.MeshBasicMaterial({ map: bgTexture });

    this.bgMesh = new THREE.Mesh(bgGeometry, bgMaterial);
    // move image to x and -y coordinates
    this.bgMesh.position.set(this.bgWidth / 2, -this.bgHeight / 2, 0);

    this.scene.add(this.bgMesh);
  }

  private initCamera() {
    const { width, height } = this.getContainerSizes();
    this.camera = new THREE.OrthographicCamera(
      width / -2,
      width / 2,
      height / 2,
      height / -2,
      0,
      10
    );
    this.camera.position.set(0, 0, 5);
  }

  public centerCamera(enableTransition: boolean = false) {
    this.controls.fitToBox(this.bgMesh, enableTransition, {
      paddingTop: 50,
      paddingBottom: 50,
      paddingLeft: 50,
      paddingRight: 50,
    });
  }

  private initStats() {
    this.stats = new Stats();
    //@ts-ignore
    this.stats.domElement.style.cssText = "position:absolute;top:0px;left:0px;";
    this.container.appendChild(this.stats.dom);
  }

  private initControls() {
    this.clock = new THREE.Clock();
    this.controls = new CameraControls(this.camera, this.renderer.domElement);
    this.controls.truckSpeed = 3;
    this.controls.dollyToCursor = true;
    this.controls.dollySpeed = 0.5;
    this.controls.mouseButtons.left = CameraControls.ACTION.TRUCK;
    this.controls.mouseButtons.right = CameraControls.ACTION.ZOOM;

    // const { width, height } = this.getContainerSizes();
    // calculate minZoom to contain bgImage and also increase a bit by * 0.7
    // this.controls.minZoom =
    //   Math.min(width / this.bgWidth, height / this.bgHeight) * 0.9;
    // this.controls.maxZoom = 5;

    this.controls.addEventListener(
      "controlstart",
      this.onControlStart.bind(this)
    );
    this.controls.addEventListener("controlend", this.onControlEnd.bind(this));
  }

  private initRayCaster() {
    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();

    this.container.addEventListener(
      "pointermove",
      this.onPointerMove.bind(this)
    );

    this.container.addEventListener(
      "pointerleave",
      this.onPointerLeave.bind(this)
    );

    this.container.addEventListener("click", this.onClick.bind(this));
  }

  public animate() {
    const delta = this.clock.getDelta();
    const hasControlsUpdated = this.controls.update(delta);
    this.stats && this.stats.update();
    this.raycaster && this.raycaster.setFromCamera(this.mouse, this.camera);

    window.requestAnimationFrame(this.animate.bind(this));

    if (hasControlsUpdated) {
      this.render();
    }
  }

  public render() {
    this.renderer.render(this.scene, this.camera);
    this.labelRenderer.render(this.scene, this.camera);
  }

  public destroy() {
    console.log("destroyed");
    this.renderer.dispose();
    this.cleanScene();
    this.controls.disconnect();
    window.removeEventListener("resize", this.windowResizeHandler, false);
  }

  private cleanMaterial(material: THREE.Material) {
    material.dispose();

    // dispose textures
    if ("map" in material) {
      const texture = material["map"];
      if (texture && texture instanceof THREE.Texture) {
        texture.dispose();
      }
    }
  }

  private cleanScene() {
    this.scene.traverse((object: THREE.Object3D) => {
      if (!(object instanceof THREE.Mesh)) {
        return;
      }
      // Dispose of the mesh's geometry and material
      object.geometry.dispose();

      if (object.material instanceof THREE.Material) {
        this.cleanMaterial(object.material);
      } else {
        // an array of materials
        for (const material of object.material) this.cleanMaterial(material);
      }
    });
  }

  private renderItems(items: IFloorPlanItem[], options: IFloorPlanItemOptions) {
    items.forEach((item) => {
      const floorPlanMesh = new FloorPlanItem(item, options);
      this.scene.add(floorPlanMesh);
    });
  }

  private getContainerSizes(): IContainerSizes {
    return {
      width: this.container.clientWidth,
      height: this.container.clientHeight,
      ratio: this.container.clientWidth / this.container.clientHeight,
      offsetLeft: this.container.offsetLeft,
      offsetTop: this.container.offsetTop,
    };
  }

  private onWindowResize() {
    const { width, height } = this.getContainerSizes();

    this.camera.left = width / -2;
    this.camera.right = width / 2;
    this.camera.top = height / 2;
    this.camera.bottom = height / -2;

    this.centerCamera();

    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
    this.labelRenderer.setSize(width, height);
  }

  private onPointerMove(event: PointerEvent) {
    const { width, height, offsetTop, offsetLeft } = this.getContainerSizes();

    this.mouse.x = ((event.clientX - offsetLeft) / width) * 2 - 1;
    this.mouse.y = -((event.clientY - offsetTop) / height) * 2 + 1;

    const intersects = this.raycaster.intersectObjects(this.scene.children);
    this.intersectObjects(intersects);
  }

  private onPointerLeave() {
    if (this.hoveredItem) {
      this.hoveredItem.onMouseLeave();
      this.hoveredItem = null;
      this.render();
      return;
    }
    this.render();
  }

  private onClick() {
    if (this.hoveredItem) {
      this.hoveredItem.onClick();
      this.render();
    }
  }

  private intersectObjects(intersects: THREE.Intersection[]) {
    if (!intersects.length && this.hoveredItem) {
      this.hoveredItem.onMouseLeave();
      this.hoveredItem = null;
      this.render();
      return;
    }

    if (!intersects.length) {
      return;
    }

    const hoveredGroup = intersects.find(
      (obj) => obj.object.parent instanceof FloorPlanItem
    );

    if (!hoveredGroup && this.hoveredItem) {
      this.hoveredItem.onMouseLeave();
      this.hoveredItem = null;
      this.render();
      return;
    }

    if (hoveredGroup && !this.hoveredItem) {
      this.hoveredItem = hoveredGroup.object.parent as FloorPlanItem;
      this.hoveredItem.onMouseEnter();
      this.render();
      return;
    }

    if (
      hoveredGroup &&
      this.hoveredItem &&
      this.hoveredItem.uuid !== hoveredGroup.object.parent?.uuid
    ) {
      this.hoveredItem.onMouseLeave();
      this.hoveredItem = hoveredGroup.object.parent as FloorPlanItem;
      this.hoveredItem.onMouseEnter();
      this.render();
      return;
    }
  }

  private onControlStart() {
    if (this.hoveredItem) {
      return;
    }
    switch (this.controls.currentAction) {
      case CameraControls.ACTION.TRUCK:
      case CameraControls.ACTION.TOUCH_TRUCK: {
        this.renderer.domElement.style.setProperty("cursor", "grabbing");
        break;
      }

      default: {
        break;
      }
    }
  }

  private onControlEnd() {
    this.renderer.domElement.style.setProperty("cursor", "initial");
  }
}
