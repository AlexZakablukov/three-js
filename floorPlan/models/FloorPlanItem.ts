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
import { getBoundingBox } from "@/floorPlan/helpers/getBoundingBox";
import { Text } from "troika-three-text";
import {
  IFloorPlanItemEvents,
  IFloorPlanItemOptions,
} from "@/floorPlan/types/floorPlan";

export class FloorPlanItem extends Group {
  public data: IFloorPlanItemData;
  private hallShape: Mesh<ShapeGeometry, MeshBasicMaterial>;
  private hallStroke: LineSegments;
  private hallLabel: Text;
  private initialShapeOpacity: number = 1;
  private events?: IFloorPlanItemEvents;

  constructor(items: IFloorPlanItem, options: IFloorPlanItemOptions) {
    super();
    const { coords, params, data } = items;
    coords && params && this.createShape(coords, params);
    this.hallShape && params && this.createStroke(params);
    this.data = data;
    this.events = options.events;
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

    const { bgColor } = params;
    const color = new Color(
      `rgb(${bgColor?.r ?? 0}, ${bgColor?.g ?? 0}, ${bgColor?.b})`
    );

    const opacity = bgColor?.a ?? 1;

    this.initialShapeOpacity = opacity;

    const material = new MeshBasicMaterial({
      color: color,
      transparent: true,
      opacity: opacity,
    });

    this.hallShape = new Mesh(geometry, material);
    this.hallShape.position.z = 1;
    this.add(this.hallShape);
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
    this.hallStroke.position.z = 1;
  }

  private createLabel(text: string, onSync?: () => void) {
    const shapeBoundingBox = getBoundingBox(this.hallShape.geometry);

    const label = new Text();
    label.text = text;
    label.color = "black";
    label.fontSize = 10;
    label.textAlign = "center";
    label.anchorX = "center";
    label.anchorY = "middle";
    label.position.x = shapeBoundingBox.centerX;
    label.position.y = shapeBoundingBox.centerY;
    label.position.z = 3;
    label.maxWidth = shapeBoundingBox.width - 30;

    onSync && label.sync(onSync);

    this.hallLabel = label;
  }

  public onClick() {
    this.hallShape.material.color.setHex(Math.random() * 0xffffff);
    this.events?.onItemClick && this.events.onItemClick(this.data);
  }

  public onMouseEnter() {
    this.hallShape.material.opacity = Math.max(
      this.initialShapeOpacity - 0.2,
      0.1
    );
    this.events?.onItemEnter && this.events.onItemEnter(this.data);
  }

  public onMouseLeave() {
    this.hallShape.material.opacity = this.initialShapeOpacity;
    this.events?.onItemLeave && this.events.onItemLeave(this.data);
  }
}
