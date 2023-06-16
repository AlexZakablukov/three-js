import {
  Color,
  MOUSE,
  OrthographicCamera,
  Scene,
  WebGLRenderer,
  Raycaster,
  Vector2,
  Intersection,
  TextureLoader,
  PlaneGeometry,
  MeshBasicMaterial,
  Mesh,
  Vector3,
} from "three";
import Stats from "three/examples/jsm/libs/stats.module";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

import { IFloorPlanOptions, IContainerSizes } from "../types/floorPlan";
import { IFloorPlanItem } from "../types/prepared";
import { FloorPlanHall } from "../models/FloorPlanHall";

export class FloorPlan {
  private container: HTMLElement;

  private renderer: WebGLRenderer;
  private scene: Scene;
  private camera: OrthographicCamera;

  private stats: Stats;
  private controls: OrbitControls;
  private raycaster: Raycaster;
  private mouse: Vector2;
  //ts-ignore
  private intersects: Intersection[];
  private textureLoader: TextureLoader;

  constructor({ containerId, backgroundImage, items }: IFloorPlanOptions) {
    this.initRenderer(containerId);
    this.initScene();
    this.initTextureLoader(backgroundImage);
    this.initCamera();
    this.initStats();
    this.initControls();
    this.centerCamera();
    this.initRayCaster();
    this.renderItems(items);
    this.animate();
  }

  private initRenderer(containerId: string) {
    const container = document.getElementById(containerId);
    if (!container) {
      return;
    }
    this.container = container;
    const { width, height } = this.getContainerSizes();
    this.renderer = new WebGLRenderer({ antialias: true });
    this.renderer.setSize(width, height);
    this.container.appendChild(this.renderer.domElement);

    window.addEventListener("resize", () => this.onWindowResize(), false);
  }

  private initScene() {
    this.scene = new Scene();
    this.scene.background = new Color("white");
  }

  private initTextureLoader(backgroundImage: string) {
    this.textureLoader = new TextureLoader();
    this.textureLoader.load(backgroundImage, (bgTexture) => {
      const width = bgTexture.source.data.naturalWidth;
      const height = bgTexture.source.data.naturalHeight;

      const bgGeometry = new PlaneGeometry(width, height);
      const bgMaterial = new MeshBasicMaterial({ map: bgTexture });

      const bgMesh = new Mesh(bgGeometry, bgMaterial);
      // move image to x and -y coordinates
      bgMesh.position.set(width / 2, -height / 2, 0);

      this.centerCamera(width, height);

      this.scene.add(bgMesh);
    });
  }

  private initCamera() {
    const { width, height } = this.getContainerSizes();
    this.camera = new OrthographicCamera(
      width / -2,
      width / 2,
      height / 2,
      height / -2,
      -100,
      100
    );
  }

  public centerCamera(bgWidth, bgHeight) {
    // center camera to the center of bgImage
    const center = new Vector3(bgWidth / 2, -bgHeight / 2, 0);
    this.camera.position.copy(center);
    this.camera.lookAt(center.x, center.y, center.z);
    const { width, height } = this.getContainerSizes();

    // zoom to fit bgImage to 0.9 of the screen
    this.camera.zoom = Math.min(width / bgWidth, height / bgHeight) * 0.9;

    this.controls.target.copy(center);

    this.controls.update();

    this.camera.updateProjectionMatrix();
    this.camera.updateMatrix();
  }

  private initStats() {
    this.stats = new Stats();
    //@ts-ignore
    this.stats.domElement.style.cssText = "position:absolute;top:0px;left:0px;";
    this.container.appendChild(this.stats.dom);
  }

  private initControls() {
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableRotate = false;
    this.controls.enablePan = true;
    this.controls.mouseButtons.LEFT = MOUSE.PAN;
    this.controls.mouseButtons.RIGHT = MOUSE.DOLLY;
  }

  private initRayCaster() {
    this.raycaster = new Raycaster();
    this.mouse = new Vector2();

    this.container.addEventListener(
      "pointermove",
      this.onPointerMove.bind(this)
    );
  }

  public animate() {
    window.requestAnimationFrame(this.animate.bind(this));
    this.render();
  }

  public render() {
    this.renderer.render(this.scene, this.camera);
    this.stats && this.stats.update();
    this.controls && this.controls.update();
    this.raycaster && this.raycaster.setFromCamera(this.mouse, this.camera);
  }

  public destroy() {
    // TODO: remove all event listeners
    console.log("destroyed");
  }

  private renderItem(item: IFloorPlanItem) {
    const floorPlanMesh = new FloorPlanHall(item);
    floorPlanMesh.position.setZ(1);
    this.scene.add(floorPlanMesh);
  }

  private renderItems(items: IFloorPlanItem[]) {
    items.forEach((item) => this.renderItem(item));
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
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  }

  private onPointerMove(event: PointerEvent) {
    const { width, height, offsetTop, offsetLeft } = this.getContainerSizes();

    this.mouse.x = ((event.clientX - offsetLeft) / width) * 2 - 1;
    this.mouse.y = -((event.clientY - offsetTop) / height) * 2 + 1;

    this.intersects = this.raycaster.intersectObjects(this.scene.children);
  }
}
