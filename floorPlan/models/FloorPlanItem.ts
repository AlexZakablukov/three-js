import {
  Color,
  EdgesGeometry,
  LineBasicMaterial,
  LineSegments,
  Mesh,
  MeshBasicMaterial,
  Shape,
  ShapeGeometry,
} from "three";
import { IFloorPlanItem, IFloorPlanItemData } from "../types/prepared";
import { IBounds, IParams, TCoords } from "@/floorPlan/types/helpers";
import {
  IFloorPlanItemEvents,
  IFloorPlanItemOptions,
} from "@/floorPlan/types/floorPlan";
import { getBoundingBox } from "@/floorPlan/helpers/getBoundingBox";

export class FloorPlanItem extends Mesh {
  public userData: IFloorPlanItemData;
  public geometry: ShapeGeometry;
  public material: MeshBasicMaterial;
  public label: HTMLDivElement;
  public bounds: IBounds;

  private initialShapeOpacity: number = 1;
  private events?: IFloorPlanItemEvents;

  constructor(items: IFloorPlanItem, options: IFloorPlanItemOptions) {
    super();
    const { coords, params, data } = items;
    this.userData = data;
    this.events = options.events;
    coords && params && this.createShape(coords, params);
    this.geometry && params && this.createStroke(params);
    this.bounds = getBoundingBox(this.geometry);
    this.geometry && this.createLabel(data.title);
  }

  private createShape(coords: TCoords[], params: IParams) {
    const shape = new Shape();
    // use -y to reflect along the y-axis, because coords relative to image
    shape.moveTo(coords[0][0], -coords[0][1]);
    for (let i = 1; i < coords.length; i++) {
      shape.lineTo(coords[i][0], -coords[i][1]);
    }
    shape.closePath();

    this.geometry = new ShapeGeometry(shape);

    const { bgColor } = params;
    const color = new Color(
      `rgb(${bgColor?.r ?? 0}, ${bgColor?.g ?? 0}, ${bgColor?.b})`
    );

    const opacity = bgColor?.a ?? 1;

    this.initialShapeOpacity = opacity;

    this.material = new MeshBasicMaterial({
      color: color,
      transparent: true,
      opacity: opacity,
    });
  }

  private createStroke(params: IParams) {
    const { strokeWidth, strokeColor } = params;
    const edges = new EdgesGeometry(this.geometry);
    const edgesMaterial = new LineBasicMaterial({
      color: new Color(
        `rgb(${strokeColor?.r ?? 0}, ${strokeColor?.g ?? 0}, ${strokeColor?.b})`
      ),
      linewidth: strokeWidth,
    });
    const stroke = new LineSegments(edges, edgesMaterial);
    this.add(stroke);
  }

  private createLabel(text: string) {
    const div = document.createElement("div");
    div.classList.add("label");
    div.style.width = `${this.bounds.width}px`;
    div.style.height = `${this.bounds.height}px`;

    const innerDiv = document.createElement("div");
    innerDiv.textContent = text;
    innerDiv.classList.add("label-text");
    div.appendChild(innerDiv);

    this.label = div;
  }

  public onClick() {
    this.material.color.setHex(Math.random() * 0xffffff);
    this.events?.onItemClick && this.events.onItemClick(this.userData);
  }

  public onMouseEnter() {
    this.material.opacity = Math.max(this.initialShapeOpacity - 0.2, 0.1);
    this.events?.onItemEnter && this.events.onItemEnter(this.userData);
  }

  public onMouseLeave() {
    this.material.opacity = this.initialShapeOpacity;
    this.events?.onItemLeave && this.events.onItemLeave(this.userData);
  }
}
