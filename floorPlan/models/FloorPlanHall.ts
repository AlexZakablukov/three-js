import { Mesh, MeshBasicMaterial, Color, Shape, ShapeGeometry } from "three";
import { IFloorPlanItemData, IFloorPlanItem } from "../types/prepared";
import { IParams, TCoords } from "@/floorPlan/types/helpers";

export class FloorPlanHall extends Mesh {
  public geometry: ShapeGeometry;
  public material: MeshBasicMaterial;
  public data?: IFloorPlanItemData;

  constructor(props: IFloorPlanItem) {
    super();
    const { coords, params, data } = props;
    coords && this.createGeometry(coords);
    params && this.createMaterial(params);
    this.data = data;
  }

  private createGeometry(coords: TCoords[]) {
    const shape = new Shape();
    // use -y to reflect along the y-axis, because coords relative to image
    shape.moveTo(coords[0][0], -coords[0][1]);
    for (let i = 1; i < coords.length; i++) {
      shape.lineTo(coords[i][0], -coords[i][1]);
    }
    shape.closePath();
    this.geometry = new ShapeGeometry(shape);
  }

  private createMaterial(params: IParams) {
    const { shapeColor, strokeWidth, strokeColor } = params;
    const color = new Color(
      `rgb(${shapeColor?.r ?? 0}, ${shapeColor?.g ?? 0}, ${shapeColor?.b})`
    );
    this.material = new MeshBasicMaterial({ color: color });
  }

  public onClick(e: MouseEvent) {
    this.material.color.setHex(Math.random() * 0xffffff);
  }
}
