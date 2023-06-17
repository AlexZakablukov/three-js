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
  private hallShape: Mesh;
  private hallStroke: LineSegments;
  private initialShapeOpacity: number = 1;

  constructor(props: IFloorPlanItem) {
    super();
    const { coords, params, data } = props;
    coords && params && this.createShape(coords, params);
    this.hallShape && params && this.createStroke(params);
    this.data = data;
    this.hallShape && this.add(this.hallShape);
    this.hallStroke && this.add(this.hallStroke);
  }

  private createShape(coords: TCoords[], params: IParams) {
    const shape = new Shape();
    // use -y to reflect along the y-axis, because coords relative to image
    shape.moveTo(coords[0][0], -coords[0][1]);
    for (let i = 1; i < coords.length; i++) {
      shape.lineTo(coords[i][0], -coords[i][1]);
    }
    shape.closePath();

    const geometry = new ShapeGeometry(shape);

    const { shapeColor } = params;
    const color = new Color(
      `rgb(${shapeColor?.r ?? 0}, ${shapeColor?.g ?? 0}, ${shapeColor?.b})`
    );

    const opacity = shapeColor?.a ?? 1;

    this.initialShapeOpacity = opacity;

    const material = new MeshBasicMaterial({
      color: color,
      transparent: true,
      opacity: opacity,
    });

    this.hallShape = new Mesh(geometry, material);
  }

  private createStroke(params: IParams) {
    const { strokeWidth, strokeColor } = params;
    const edges = new EdgesGeometry(this.hallShape.geometry);
    const edgesMaterial = new LineBasicMaterial({
      color: new Color(
        `rgb(${strokeColor?.r ?? 0}, ${strokeColor?.g ?? 0}, ${strokeColor?.b})`
      ),
      linewidth: strokeWidth,
    });
    this.hallStroke = new LineSegments(edges, edgesMaterial);
  }

  public onClick() {
    // @ts-ignore
    this.hallShape.material.color.setHex(Math.random() * 0xffffff);
  }

  public onMouseEnter() {
    // @ts-ignore
    this.hallShape.material.opacity = Math.max(
      this.initialShapeOpacity - 0.2,
      0.1
    );
  }

  public onMouseLeave() {
    // @ts-ignore
    this.hallShape.material.opacity = this.initialShapeOpacity;
  }
}
