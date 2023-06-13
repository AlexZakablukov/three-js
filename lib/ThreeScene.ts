import {
  Scene,
  PerspectiveCamera,
  WebGLRenderer,
  AmbientLight,
  DirectionalLight,
} from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import Stats from "three/examples/jsm/libs/stats.module";

export class ThreeScene {
  private wrapperId: string;
  private wrapper: HTMLElement;

  public scene: Scene;
  public camera: PerspectiveCamera;
  private renderer: WebGLRenderer;

  private ambientLight: AmbientLight;
  private directionalLight: DirectionalLight;

  private controls: OrbitControls;
  private stats: Stats;

  constructor(wrapperId: string) {
    this.wrapperId = wrapperId;
  }

  public init() {
    this.wrapper = document.getElementById(this.wrapperId);
    const { width, height, ratio } = this.getWrapperSizes();

    this.scene = new Scene();
    this.camera = new PerspectiveCamera(75, ratio, 0.1, 1000);

    this.renderer = new WebGLRenderer();
    this.renderer.setSize(width, height);
    this.wrapper.appendChild(this.renderer.domElement);

    this.ambientLight = new AmbientLight(0xffffff, 0.5);
    this.ambientLight.castShadow = true;
    this.scene.add(this.ambientLight);

    this.directionalLight = new DirectionalLight(0xffffff, 0.5);
    this.directionalLight.position.set(0, 2, 4);
    this.scene.add(this.directionalLight);

    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.stats = new Stats();
    this.stats.domElement.style.cssText = "position:absolute;top:0px;left:0px;";
    this.wrapper.appendChild(this.stats.dom);

    window.addEventListener("resize", () => this.onWindowResize(), false);
  }

  public animate() {
    window.requestAnimationFrame(this.animate.bind(this));
    this.render();
    this.stats.update();
  }

  public render() {
    this.renderer.render(this.scene, this.camera);
  }

  private getWrapperSizes() {
    return {
      width: this.wrapper.clientWidth,
      height: this.wrapper.clientHeight,
      ratio: this.wrapper.clientWidth / this.wrapper.clientHeight,
    };
  }

  private onWindowResize() {
    const { width, height, ratio } = this.getWrapperSizes();
    this.camera.aspect = ratio;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  }
}
