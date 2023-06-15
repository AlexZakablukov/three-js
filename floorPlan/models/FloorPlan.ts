import {
  Color,
  MOUSE,
  OrthographicCamera,
  Scene,
  WebGLRenderer,
  Raycaster,
  Vector2,
  Intersection,
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

  constructor({ containerId, items }: IFloorPlanOptions) {
    this.initRenderer(containerId);
    this.initScene();
    this.initCamera();
    this.initStats();
    this.initControls();
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

  private initCamera() {
    const { width, height } = this.getContainerSizes();
    this.camera = new OrthographicCamera(
      width / -2,
      width / 2,
      height / 2,
      height / -2,
      100,
      -100
    );
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
