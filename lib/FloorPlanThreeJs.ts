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
import { FloorPlanItem, IFloorPlanItem } from "@/lib/FloorPlanItem";

export enum FloorPlanEvents {
  OnItemClick = "onItemClick",
}

export interface IFloorPlanThreeJsItem extends IFloorPlanItem {
  x: number;
  y: number;
}

interface IOptions {
  containerId: string;
  enableControls?: boolean;
  enableStats?: boolean;
  items: IFloorPlanThreeJsItem[];
  events?: Record<FloorPlanEvents, Function>;
}

interface IContainerSizes {
  width: number;
  height: number;
  ratio: number;
  offsetLeft: number;
  offsetTop: number;
}

export class FloorPlanThreeJs {
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

  constructor({
    containerId,
    enableStats = false,
    enableControls = false,
    items,
    events,
  }: IOptions) {
    this.initRenderer(containerId);
    this.initScene();
    this.initCamera();
    enableStats && this.initStats();
    enableControls && this.initControls();
    // TODO: add option to show/hide controls buttons
    enableControls && this.initControlsButtons();
    this.initRayCaster();
    this.renderItems(items);
    this.addEventListeners(events);
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

  private initControlsButtons() {
    // TODO: make it universal and clearer
    const zoomInButton = document.createElement("button");
    zoomInButton.textContent = "+";
    zoomInButton.addEventListener("click", () => {
      this.camera.zoom += 0.1;
      this.camera.updateProjectionMatrix();
    });
    zoomInButton.style.cssText =
      "position:absolute;bottom:20px;right:0px;color:white;background:black;padding:4px;border-radius:4px;width:20px;height:20px;line-height:20px";

    const zoomOutButton = document.createElement("button");
    zoomOutButton.textContent = "-";
    zoomOutButton.addEventListener("click", () => {
      this.camera.zoom -= 0.1;
      this.camera.updateProjectionMatrix();
    });
    zoomOutButton.style.cssText =
      "position:absolute;bottom:0px;right:0px;color:white;background:black;padding:4px;border-radius:4px;width:20px;height:20px;line-height:20px";

    this.container.appendChild(zoomInButton);
    this.container.appendChild(zoomOutButton);
  }

  public animate() {
    window.requestAnimationFrame(this.animate.bind(this));
    this.render();
    this.stats && this.stats.update();
    this.controls && this.controls.update();
    this.raycaster && this.raycaster.setFromCamera(this.mouse, this.camera);
  }

  public render() {
    this.renderer.render(this.scene, this.camera);
  }

  public destroy() {
    // TODO: remove all event listeners
    console.log("destroyed");
  }

  private renderItem(item: IFloorPlanThreeJsItem) {
    const { width, height, color, x, y, data } = item;
    const floorPlanItem = new FloorPlanItem({ width, height, color, data });
    floorPlanItem.position.x = x;
    floorPlanItem.position.y = y;
    this.scene.add(floorPlanItem);
  }

  private renderItems(items: IFloorPlanThreeJsItem[]) {
    items.forEach((item) => this.renderItem(item));
  }

  private addEventListeners(events: IOptions["events"]) {
    if (!events || !Object.keys(events).length) {
      return;
    }
    for (const eventName in events) {
      const handler = events?.[eventName as FloorPlanEvents];
      switch (eventName) {
        case FloorPlanEvents.OnItemClick:
          this.container.addEventListener("click", () => {
            if (!this.intersects.length) {
              return;
            }
            console.log(this.intersects[0].object);
            const object = this.intersects[0].object;
            //@ts-ignore
            object.onClick();
            //@ts-ignore
            handler(object.data);
          });
          return;
        default:
          return;
      }
    }
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
