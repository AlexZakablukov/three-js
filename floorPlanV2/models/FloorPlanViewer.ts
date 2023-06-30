import * as THREE from "three";
import Stats from "three/examples/jsm/libs/stats.module";
import CameraControls from "camera-controls";
import {
  IFloorPlanViewerOptions,
  IFloorPlanViewerSettings,
} from "../types/floorPlanViewer";
import { getHtmlElementSize } from "../helpers/getHtmlElementSize";
import { ThreeJsUtils } from "./ThreeJsUtils";
import { isObject } from "../helpers/extra";
import { IFloorPlanItem } from "../types/floorPlanItem";
import { FloorPlanItem } from "./FloorPlanItem";
import { FloorPlanLabel } from "./FloorPlanLabel";

CameraControls.install({ THREE });

const DEFAULT_SETTINGS: IFloorPlanViewerSettings = {
  backgroundColor: "white",
  truckSpeed: 3,
  dollyToCursor: true,
  dollySpeed: 0.5,
  smoothTime: 0,
  draggingSmoothTime: 0,
  maxZoom: 100,
  areaPerZoom: 300,
  onControlStart: (currentAction) => {
    switch (currentAction) {
      case CameraControls.ACTION.TRUCK:
      case CameraControls.ACTION.TOUCH_TRUCK: {
        document.body.style.setProperty("cursor", "grabbing");
        break;
      }

      default: {
        break;
      }
    }
  },
  onControlEnd: () => {
    document.body.style.setProperty("cursor", "initial");
  },
};

const LABELS_CONTAINER_STYLES = `
    position: absolute;
    z-index: 1;
    left: 0;
    top: 0;
    color: black;
    width: 100%;
    height: 100%;
    pointer-events: none;
`;

export class FloorPlanViewer {
  private canvasContainer: HTMLElement;

  private renderer: THREE.WebGLRenderer;

  private scene: THREE.Scene;

  private camera: THREE.OrthographicCamera;

  private clock: THREE.Clock;

  private controls: CameraControls;

  private stats: Stats;

  private settings: IFloorPlanViewerSettings;

  private requestAnimationId: number;

  private labelsContainer: HTMLElement;

  private labels: FloorPlanLabel[] = [];

  private tempVector: THREE.Vector3 = new THREE.Vector3();

  /**
   * @description
   * bounds of all halls/stands and background on the scene
   */
  private boundingBox: THREE.Box3 = new THREE.Box3();

  /**
   * @description
   * Creates an instance of FloorPlanViewer.
   *
   * @param {IFloorPlanViewerOptions} options - The options for configuring the FloorPlanViewer.
   */
  constructor({
    canvasContainerId,
    backgroundImage,
    items,
    settings,
  }: IFloorPlanViewerOptions) {
    const canvasContainer = document.getElementById(canvasContainerId);
    if (!canvasContainer) {
      return;
    }
    this.canvasContainer = canvasContainer;
    /**
     * @description
     * Sets the settings for the FloorPlanViewer instance based on the provided settings object.
     */
    this.settings = isObject(settings)
      ? Object.assign(DEFAULT_SETTINGS, settings)
      : DEFAULT_SETTINGS;
    this.onWindowResize = this.onWindowResize.bind(this);
    this.initRenderer();
    this.initLabelsContainer();
    this.initScene();
    this.initCamera();
    this.initBackground(backgroundImage);
    this.initControls();
    this.initStats();
    this.renderItems(items);
    this.fitCamera();
    this.render();
    this.animate();
  }

  /**
   * @description
   * Initializes the renderer for rendering the scene.
   * Append canvas element to canvasContainer
   * Start listening on window resize
   */
  private initRenderer() {
    const { width, height } = getHtmlElementSize(this.canvasContainer);
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setSize(width, height);
    this.canvasContainer.appendChild(this.renderer.domElement);

    window.addEventListener("resize", this.onWindowResize, false);
  }

  /**
   * Initializes the labels container by creating a new HTML div element,
   * applying the necessary CSS styles, and appending it to the canvas container.
   * The labels container will be used to hold the labels associated with the scene objects.
   */
  private initLabelsContainer() {
    const labelsContainer = document.createElement("div");
    labelsContainer.style.cssText = LABELS_CONTAINER_STYLES;
    this.canvasContainer.appendChild(labelsContainer);
    this.labelsContainer = labelsContainer;
  }

  /**
   * @description
   * Initializes the scene.
   * Set up background color of scene
   */
  private initScene() {
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(this.settings.backgroundColor);
  }

  /**
   * @description
   * Initializes the OrthographicCamera depend on container size.
   * Set up default camera position z = 5.
   */
  private initCamera() {
    const { width, height } = getHtmlElementSize(this.canvasContainer);
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

  /**
   * Initializes the background of the floor plan viewer with the provided background image.
   *
   * @param {string} [backgroundImage] - The URL of the background image.
   */
  private initBackground(backgroundImage?: string) {
    if (!backgroundImage) {
      return;
    }
    ThreeJsUtils.loadTexture(backgroundImage).then((texture) => {
      const width = texture.source.data.naturalWidth;
      const height = texture.source.data.naturalHeight;

      const x = width / 2;
      const y = height / -2;
      const z = 0;

      const geometry = new THREE.PlaneGeometry(width, height);
      const material = new THREE.MeshBasicMaterial({ map: texture });

      const mesh = new THREE.Mesh(geometry, material);

      mesh.position.set(x, y, z);
      this.boundingBox.expandByObject(mesh);

      this.scene.add(mesh);

      this.fitCamera();
      this.render();
    });
  }

  /**
   * Fits the camera to the background mesh, adjusting its position and zoom level.
   *
   * @param {boolean} [enableTransition=false] - enable smooth camera transition.
   */
  public fitCamera(enableTransition: boolean = false) {
    this.controls.fitToBox(this.boundingBox, enableTransition, {
      paddingTop: 50,
      paddingBottom: 50,
      paddingLeft: 50,
      paddingRight: 50,
    });
  }

  /**
   * @description
   * Initializes the camera controls.
   * Create clock instance to less render count
   * Set up controls settings depend on settings object
   * Start listening on control start/end events
   */
  private initControls() {
    this.clock = new THREE.Clock();
    this.controls = new CameraControls(this.camera, this.renderer.domElement);
    this.controls.truckSpeed = this.settings.truckSpeed;
    this.controls.dollyToCursor = this.settings.dollyToCursor;
    this.controls.dollySpeed = this.settings.dollySpeed;
    this.controls.smoothTime = this.settings.smoothTime;
    this.controls.draggingSmoothTime = this.settings.draggingSmoothTime;
    this.controls.maxZoom = this.settings.maxZoom;

    this.controls.mouseButtons.left = CameraControls.ACTION.TRUCK;
    this.controls.mouseButtons.right = CameraControls.ACTION.ZOOM;
    this.controls.touches.one = CameraControls.ACTION.TOUCH_TRUCK;
    this.controls.touches.two = CameraControls.ACTION.TOUCH_ZOOM;
    this.controls.touches.three = CameraControls.ACTION.TOUCH_DOLLY;

    this.controls.addEventListener(
      "controlstart",
      this.onControlStart.bind(this)
    );
    this.controls.addEventListener("controlend", this.onControlEnd.bind(this));
  }

  private initStats() {
    this.stats = new Stats();
    //@ts-ignore
    this.stats.domElement.style.cssText = "position:absolute;top:0px;left:0px;";
    this.canvasContainer.appendChild(this.stats.dom);
  }

  /**
   * Renders the floor plan items by creating meshes for each item and adding them to the scene.
   * @param {IFloorPlanItem[]} items - An array of floor plan items.
   */
  private renderItems(items: IFloorPlanItem[]) {
    items.forEach((item) => {
      if (!item.params || !item.coords) {
        return;
      }
      const floorPlanItemMesh = new FloorPlanItem(item);
      this.boundingBox.expandByObject(floorPlanItemMesh);
      this.scene.add(floorPlanItemMesh);

      const floorPlanItemLabel = new FloorPlanLabel(
        floorPlanItemMesh,
        floorPlanItemMesh.userData.title
      );
      this.labels.push(floorPlanItemLabel);
      this.labelsContainer.appendChild(floorPlanItemLabel.elem);
    });
  }

  /**
   * @description
   * Animates the scene.
   * Render fires on controls change
   */
  public animate() {
    const delta = this.clock.getDelta();
    const hasControlsUpdated = this.controls.update(delta);
    this.stats && this.stats.update();

    this.requestAnimationId = window.requestAnimationFrame(
      this.animate.bind(this)
    );

    if (hasControlsUpdated) {
      this.render();
      this.updateLabels();
    }
  }

  /**
   * @description
   * Renders the scene.
   */
  public render() {
    this.renderer.render(this.scene, this.camera);
  }

  /**
   * @description
   * Updates the visibility and positions of the labels based on the current camera view.
   * If a label's area is less than the provided visible area by 1 zoom point, it is hidden.
   * If a label is outside the camera's viewport, it is hidden.
   * Otherwise, the label is shown and its position is updated based on the camera's zoom level.
   */
  private updateLabels() {
    if (!this.labels.length) {
      return;
    }

    // get the camera's position
    this.camera.getWorldPosition(this.camera.position);

    for (const label of this.labels) {
      // hide label if it is area less that provided visible area by 1 zoom point
      if (label.area * this.camera.zoom < this.settings.areaPerZoom) {
        label.hide();
        continue;
      }

      this.tempVector.copy(label.position);
      this.tempVector.project(this.camera);

      // hide label if it is not in camera viewport x : (-1, 1), y : (-1 , 1)
      if (
        this.tempVector.x > 1 ||
        this.tempVector.x < -1 ||
        this.tempVector.y > 1 ||
        this.tempVector.y < -1
      ) {
        label.hide();
        continue;
      }

      label.show();

      // convert the normalized position to CSS coordinates
      const x =
        (this.tempVector.x * 0.5 + 0.5) * this.canvasContainer.clientWidth;
      const y =
        (this.tempVector.y * -0.5 + 0.5) * this.canvasContainer.clientHeight;

      label.updatePosition(x, y, this.camera.zoom);
    }
  }

  /**
   * @description
   * Destroys the FloorPlanViewer instance.
   */
  public destroy() {
    this.cleanScene();
    this.renderer.dispose();
    this.controls.disconnect();
    cancelAnimationFrame(this.requestAnimationId);
    this.canvasContainer.removeChild(this.renderer.domElement);
    this.canvasContainer.removeChild(this.labelsContainer);
    window.removeEventListener("resize", this.onWindowResize, false);
  }

  /**
   * @description
   * Cleans up the scene by disposing objects.
   */
  private cleanScene() {
    this.scene.traverse(ThreeJsUtils.cleanObject);
  }

  /**
   * @description
   * Handles the window resize event.
   * Change camera and renderer size and ratio
   */
  private onWindowResize() {
    const { width, height } = getHtmlElementSize(this.canvasContainer);

    this.camera.left = width / -2;
    this.camera.right = width / 2;
    this.camera.top = height / 2;
    this.camera.bottom = height / -2;

    this.fitCamera();

    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
    this.render();
  }

  /**
   * @description
   * Handles the control start event.
   */
  private onControlStart() {
    if (!this.settings.onControlStart) {
      return;
    }
    this.settings.onControlStart(this.controls.currentAction);
  }

  /**
   * @description
   * Handles the control end event.
   */
  private onControlEnd() {
    if (!this.settings.onControlEnd) {
      return;
    }
    this.settings.onControlEnd();
  }
}
