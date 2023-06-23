import * as THREE from "three";
import { TCoords } from "@/floorPlan/types/helpers";

import { MeshLineGeometry, MeshLineMaterial } from "meshline";

export class FloorPlanDirection extends THREE.Mesh {
  public geometry: MeshLineGeometry;
  public material: MeshLineMaterial;

  constructor(path: TCoords[], resolution: THREE.Vector2) {
    super();
    this.createPath(path, resolution);
  }

  private createPath(path: TCoords[], resolution: THREE.Vector2) {
    const points = [];
    for (let coords of path) {
      points.push(coords[0], -coords[1], 1);
    }
    this.geometry = new MeshLineGeometry();
    this.geometry.setPoints(points);

    this.material = new MeshLineMaterial({
      lineWidth: 0.005,
      color: 0xff0000,
      resolution,
      sizeAttenuation: 1,
    });
  }
}
