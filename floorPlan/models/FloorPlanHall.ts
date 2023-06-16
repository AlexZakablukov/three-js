import {
  Mesh,
  MeshBasicMaterial,
  Color,
  Shape,
  ShapeGeometry,
  Group,
  EdgesGeometry,
  LineSegments,
  LineBasicMaterial,
} from "three";
import { IFloorPlanItemData, IFloorPlanItem } from "../types/prepared";
import { IParams, TCoords } from "@/floorPlan/types/helpers";

export class FloorPlanHall extends Group {
  public data?: IFloorPlanItemData;

  constructor(props: IFloorPlanItem) {
    super();
    const { coords, params, data } = props;
    coords && params && this.createMesh(coords, params);
    this.data = data;
  }

  private createMesh(coords: TCoords[], params: IParams) {
    const shape = new Shape();
    // use -y to reflect along the y-axis, because coords relative to image
    shape.moveTo(coords[0][0], -coords[0][1]);
    for (let i = 1; i < coords.length; i++) {
      shape.lineTo(coords[i][0], -coords[i][1]);
    }
    shape.closePath();

    const geometry = new ShapeGeometry(shape);

    const { shapeColor, strokeWidth, strokeColor } = params;
    const color = new Color(
      `rgb(${shapeColor?.r ?? 0}, ${shapeColor?.g ?? 0}, ${shapeColor?.b})`
    );

    const material = new MeshBasicMaterial({
      color: color,
      transparent: true,
      opacity: shapeColor?.a ?? 1,
    });

    const mesh = new Mesh(geometry, material);

    const edges = new EdgesGeometry(geometry);
    const edgesMaterial = new LineBasicMaterial({
      color: new Color(
        `rgb(${strokeColor?.r ?? 0}, ${strokeColor?.g ?? 0}, ${strokeColor?.b})`
      ),
      linewidth: strokeWidth,
    });
    const line = new LineSegments(edges, edgesMaterial);

    this.add(mesh);
    this.add(line);
  }

  public onClick(e: MouseEvent) {
    console.log("FloorPlanHall onClick");
    // this.material.color.setHex(Math.random() * 0xffffff);
  }
}
