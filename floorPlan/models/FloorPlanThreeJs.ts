import * as THREE from "three";
import Stats from "three/examples/jsm/libs/stats.module";
import { GUI } from "three/examples/jsm/libs/lil-gui.module.min.js";
import CameraControls from "camera-controls";

import {
  IFloorPlanOptions,
  IContainerSizes,
  IFloorPlanItemOptions,
} from "../types/floorPlan";
import { IFloorPlanItem } from "../types/prepared";
import { FloorPlanItem } from "./FloorPlanItem";

CameraControls.install({ THREE });

export class FloorPlanThreeJs {
  private canvasContainer: HTMLElement;
  private labelsContainer: HTMLElement;

  private labels: {
    position: THREE.Vector3;
    elem: HTMLDivElement;
    area: number;
  }[] = [];

  private renderer: THREE.WebGLRenderer;
  private scene: THREE.Scene;
  private camera: THREE.OrthographicCamera;

  private clock: THREE.Clock;
  private controls: CameraControls;
  private raycaster: THREE.Raycaster;
  private hoveredItem: FloorPlanItem | null = null;

  private mouse: THREE.Vector2;
  private center: THREE.Vector3;

  private tempV: THREE.Vector3 = new THREE.Vector3();
  private cameraPosition: THREE.Vector3 = new THREE.Vector3();

  private bgMesh: THREE.Mesh;
  private bgWidth: number;
  private bgHeight: number;

  private stats: Stats;
  private gui: GUI;
  private settings: {
    minArea: number;
    areaPerZoom: number;
    maxZoom: number;
  } = {
    minArea: 0,
    areaPerZoom: 300,
    maxZoom: 50,
  };

  private windowResizeHandler: () => void;

  constructor({
    canvasContainerId,
    labelContainerId,
    bgTexture,
    bgColor,
    items,
    events,
  }: IFloorPlanOptions) {
    const canvasContainer = document.getElementById(canvasContainerId);
    const labelsContainer = document.getElementById(labelContainerId);
    if (!canvasContainer || !labelsContainer) {
      return;
    }
    this.canvasContainer = canvasContainer;
    this.labelsContainer = labelsContainer;
    this.windowResizeHandler = this.onWindowResize.bind(this);
    this.initRenderer();
    this.initScene(bgColor);
    this.initCamera();
    this.initBackground(bgTexture);
    this.initControls();
    this.initRayCaster();
    this.centerCamera();
    this.initStats();
    this.initGui();
    this.renderItems(items, {
      events: events?.item,
    });
    this.render();
    this.animate();
  }

  private initRenderer() {
    const { width, height } = this.getContainerSizes();
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setSize(width, height);
    this.canvasContainer.appendChild(this.renderer.domElement);

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

    const div = document.createElement("div");
    div.style.width = `${this.bgWidth}px`;
    div.style.height = `${this.bgHeight}px`;

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
    this.canvasContainer.appendChild(this.stats.dom);
  }

  private initGui() {
    this.gui = new GUI();
    this.gui
      .add(this.settings, "minArea", 0, 1000, 50)
      .onChange(this.render.bind(this));
    this.gui
      .add(this.settings, "areaPerZoom", 1, 10000, 50)
      .onChange(this.render.bind(this));
    this.gui
      .add(this.settings, "maxZoom", 1, 100, 1)
      .onChange((zoom: number) => {
        this.controls.maxZoom = zoom;
      });
  }

  private initControls() {
    this.clock = new THREE.Clock();
    this.controls = new CameraControls(this.camera, this.renderer.domElement);
    this.controls.truckSpeed = 3;
    this.controls.dollyToCursor = true;
    this.controls.dollySpeed = 0.5;
    this.controls.smoothTime = 0;
    this.controls.draggingSmoothTime = 0;
    this.controls.mouseButtons.left = CameraControls.ACTION.TRUCK;
    this.controls.mouseButtons.right = CameraControls.ACTION.ZOOM;
    this.controls.touches.one = CameraControls.ACTION.TOUCH_TRUCK;
    this.controls.touches.two = CameraControls.ACTION.TOUCH_ZOOM;
    this.controls.touches.three = CameraControls.ACTION.TOUCH_DOLLY;

    // const { width, height } = this.getContainerSizes();
    // calculate minZoom to contain bgImage and also increase a bit by * 0.7
    // this.controls.minZoom =
    //   Math.min(width / this.bgWidth, height / this.bgHeight) * 0.9;
    this.controls.maxZoom = this.settings.maxZoom;

    this.controls.addEventListener(
      "controlstart",
      this.onControlStart.bind(this)
    );
    this.controls.addEventListener("controlend", this.onControlEnd.bind(this));
  }

  private initRayCaster() {
    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();

    this.renderer.domElement.addEventListener(
      "pointermove",
      this.onPointerMove.bind(this)
    );

    this.renderer.domElement.addEventListener(
      "pointerleave",
      this.onPointerLeave.bind(this)
    );

    this.renderer.domElement.addEventListener("click", this.onClick.bind(this));
  }

  public animate() {
    const delta = this.clock.getDelta();
    const hasControlsUpdated = this.controls.update(delta);
    this.stats && this.stats.update();
    this.raycaster && this.raycaster.setFromCamera(this.mouse, this.camera);

    window.requestAnimationFrame(this.animate.bind(this));

    if (hasControlsUpdated) {
      this.render();
      this.updateLabels();
    }
  }

  public render() {
    this.renderer.render(this.scene, this.camera);
  }

  public destroy() {
    console.log("destroyed");
    this.renderer.dispose();
    this.cleanScene();
    this.gui.destroy();
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
    // const geometries = [];
    // items.forEach((item) => {
    //   const { coords, params, data } = item;
    //   if (coords && params) {
    //     const shape = new THREE.Shape();
    //     shape.moveTo(coords[0][0], -coords[0][1]);
    //     for (let i = 1; i < coords.length; i++) {
    //       shape.lineTo(coords[i][0], -coords[i][1]);
    //     }
    //     shape.closePath();
    //
    //     const geometry = new THREE.ShapeGeometry(shape);
    //
    //     const rgb = [
    //       params.bgColor?.r ?? 0,
    //       params.bgColor?.g ?? 0,
    //       params.bgColor?.b ?? 0,
    //     ];
    //
    //     // make an array to store colors for each vertex
    //     const numVerts = geometry.getAttribute("position").count;
    //     console.log({ numVerts });
    //     const itemSize = 3; // r, g, b
    //     const colors = new Uint8Array(itemSize * numVerts);
    //
    //     // copy the color into the colors array for each vertex
    //     colors.forEach((v, ndx) => {
    //       colors[ndx] = rgb[ndx % 3];
    //     });
    //
    //     const normalized = true;
    //     const colorAttrib = new THREE.BufferAttribute(
    //       colors,
    //       itemSize,
    //       normalized
    //     );
    //     geometry.setAttribute("color", colorAttrib);
    //
    //     geometries.push(geometry);
    //   }
    // });
    // const mergedGeometry = BufferGeometryUtils.mergeGeometries(
    //   geometries,
    //   false
    // );
    // const material = new THREE.MeshBasicMaterial({
    //   vertexColors: true,
    // });
    // const mesh = new THREE.Mesh(mergedGeometry, material);
    // this.scene.add(mesh);

    items.forEach((item) => {
      if (!item.coords || !item.params) {
        return;
      }
      const floorPlanMesh = new FloorPlanItem(item, options);
      this.labels.push({
        position: new THREE.Vector3(
          floorPlanMesh.bounds.centerX,
          floorPlanMesh.bounds.centerY,
          1
        ),
        area: floorPlanMesh.bounds.area,
        elem: floorPlanMesh.label,
      });
      this.labelsContainer.appendChild(floorPlanMesh.label);
      this.scene.add(floorPlanMesh);
    });
  }

  private updateLabels() {
    if (!this.labels.length) {
      return;
    }

    // get the camera's position
    this.camera.getWorldPosition(this.cameraPosition);

    for (let label of this.labels) {
      if (label.area < this.settings.minArea) {
        label.elem.style.display = "none";
        continue;
      }

      // hide label if it is area less that provided visible area by 1 zoom point
      if (label.area * this.camera.zoom < this.settings.areaPerZoom) {
        label.elem.style.display = "none";
        continue;
      }

      this.tempV.copy(label.position);
      this.tempV.project(this.camera);

      // hide label if it is not in camera viewport x : (-1, 1), y : (-1 , 1)
      if (
        this.tempV.x > 1 ||
        this.tempV.x < -1 ||
        this.tempV.y > 1 ||
        this.tempV.y < -1
      ) {
        label.elem.style.display = "none";
        continue;
      }

      label.elem.style.display = "";

      // convert the normalized position to CSS coordinates
      const x = (this.tempV.x * 0.5 + 0.5) * this.canvasContainer.clientWidth;
      const y = (this.tempV.y * -0.5 + 0.5) * this.canvasContainer.clientHeight;

      label.elem.style.transform = `translate(-50%, -50%) translate(${x}px,${y}px) scale(${this.camera.zoom}, ${this.camera.zoom})`;
      //@ts-ignore
      label.elem.firstChild.style.transform = `scale(${1 / this.camera.zoom}, ${
        1 / this.camera.zoom
      })`;
    }
  }

  private getContainerSizes(): IContainerSizes {
    return {
      width: this.canvasContainer.clientWidth,
      height: this.canvasContainer.clientHeight,
      ratio:
        this.canvasContainer.clientWidth / this.canvasContainer.clientHeight,
      offsetLeft: this.canvasContainer.offsetLeft,
      offsetTop: this.canvasContainer.offsetTop,
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
      (obj) => obj.object instanceof FloorPlanItem
    );

    if (!hoveredGroup && this.hoveredItem) {
      this.hoveredItem.onMouseLeave();
      this.hoveredItem = null;
      this.render();
      return;
    }

    if (hoveredGroup && !this.hoveredItem) {
      this.hoveredItem = hoveredGroup.object as FloorPlanItem;
      this.hoveredItem.onMouseEnter();
      this.render();
      return;
    }

    if (
      hoveredGroup &&
      this.hoveredItem &&
      this.hoveredItem.uuid !== hoveredGroup.object.uuid
    ) {
      this.hoveredItem.onMouseLeave();
      this.hoveredItem = hoveredGroup.object as FloorPlanItem;
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
