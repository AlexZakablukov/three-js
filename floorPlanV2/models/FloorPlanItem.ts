import * as THREE from "three";

import { TCoords, IParams } from "../types/helpers";
import { IFloorPlanItem, IFloorPlanItemData } from "../types/floorPlanItem";
import { getColorAndOpacityFromRgba } from "../helpers";

/**
 * Represents a floor plan item as a mesh in the scene.
 */
export class FloorPlanItem extends THREE.Mesh {
  /**
   * User data associated with the floor plan item.
   */
  public userData: IFloorPlanItemData;

  public geometry: THREE.ShapeGeometry;

  public material: THREE.MeshBasicMaterial;

  private initialShapeOpacity: number = 1;

  constructor(item: IFloorPlanItem) {
    super();
    const { coords, params, data } = item;
    if (!coords || !params) {
      return;
    }
    this.userData = data;
    this.createShape(coords, params);
    this.createStroke(params);
    this.position.z = 1;
  }

  /**
   * Creates the shape of the floor plan item.
   * @param {TCoords[]} coords - The coordinates of the shape.
   * @param {IParams} params - The parameters of the shape.
   */
  private createShape(coords: TCoords[], params: IParams) {
    const shape = new THREE.Shape();
    /**
     * @description
     * use -y to reflect along the y-axis, because coords relative to image
     * draw blocks in the fourth quarter of the coordinate axis
     */
    //
    shape.moveTo(coords[0][0], -coords[0][1]);
    for (let i = 1; i < coords.length; i++) {
      shape.lineTo(coords[i][0], -coords[i][1]);
    }
    shape.closePath();

    this.geometry = new THREE.ShapeGeometry(shape);

    const { bgColor } = params;

    const { color, opacity } = getColorAndOpacityFromRgba(bgColor);

    this.initialShapeOpacity = opacity;

    this.material = new THREE.MeshBasicMaterial({
      color,
      transparent: true,
      opacity,
    });
  }

  /**
   * Creates the stroke as outline of the floor plan item.
   * @param {IParams} params - The parameters of the shape.
   */
  private createStroke(params: IParams) {
    const { strokeWidth, strokeColor } = params;
    const edges = new THREE.EdgesGeometry(this.geometry);
    const { color } = getColorAndOpacityFromRgba(strokeColor);
    const edgesMaterial = new THREE.LineBasicMaterial({
      color,
      linewidth: strokeWidth,
    });
    const stroke = new THREE.LineSegments(edges, edgesMaterial);
    this.add(stroke);
  }
}
