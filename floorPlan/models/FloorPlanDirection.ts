import * as THREE from "three";
import { TCoords } from "@/floorPlan/types/helpers";

import { MeshLineGeometry, MeshLineMaterial } from "meshline";

export class FloorPlanDirection extends THREE.Mesh {
  public geometry: MeshLineGeometry;
  public material: MeshLineMaterial;
  private animationId: number;
  private animatedMaterial: MeshLineMaterial;
  private render: () => void;

  constructor(
    path: TCoords[],
    resolution: THREE.Vector2,
    renderFn: () => void
  ) {
    super();
    this.render = renderFn;
    this.createPath(path, resolution);
    this.animate();
  }

  private createPath(path: TCoords[], resolution: THREE.Vector2) {
    const points = [];
    for (let coords of path) {
      points.push(coords[0], -coords[1], 1);
    }

    this.geometry = new MeshLineGeometry();
    this.geometry.setPoints(points);

    this.material = new MeshLineMaterial({
      lineWidth: 0.01,
      color: 0x0000ff,
      resolution,
      sizeAttenuation: 1,
    });

    // animated path

    this.animatedMaterial = new MeshLineMaterial({
      lineWidth: 0.005,
      color: 0x0000ff,
      resolution,
      sizeAttenuation: 1,
      dashArray: 2,
      dashOffset: 0,
      dashRatio: 0.5,
    });

    const animatedPath = new THREE.Mesh(this.geometry, this.animatedMaterial);

    this.add(animatedPath);
  }

  public animate() {
    setTimeout(() => {
      this.animationId = window.requestAnimationFrame(this.animate.bind(this));
      this.update();
      this.render();
    }, 1000 / 60);
  }

  public stopAnimate() {
    window.cancelAnimationFrame(this.animationId);
  }

  public update() {
    // Check if the dash is out to stop animate it.
    if (this.animatedMaterial.uniforms.dashOffset.value < -1) {
      this.animatedMaterial.uniforms.dashOffset.value = 0;
      return;
    }

    // Decrement the dashOffset value to animate the path with the dash.
    this.animatedMaterial.uniforms.dashOffset.value -= 0.01;
  }
}
