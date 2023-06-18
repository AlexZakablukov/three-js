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
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry";
import { Font } from "three/examples/jsm/loaders/FontLoader";

export class FloorPlanHall extends Group {
  public data?: IFloorPlanItemData;
  private hallShape: Mesh<ShapeGeometry, MeshBasicMaterial>;
  private hallStroke: LineSegments;
  private hallLabel: Mesh<TextGeometry, MeshBasicMaterial>;
  private initialShapeOpacity: number = 1;

  constructor(items: IFloorPlanItem, font: Font) {
    super();
    const { coords, params, data } = items;
    coords && params && this.createShape(coords, params);
    this.hallShape && params && this.createStroke(params);
    this.hallShape && coords && this.createLabel(data.title, font);
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

  private createLabel(text: string, font: Font) {
    this.hallShape.geometry.computeBoundingBox();

    const boundingBox = this.hallShape.geometry.boundingBox;

    const maxX = boundingBox?.max.x ?? 0;
    const minX = boundingBox?.min.x ?? 0;
    const maxY = boundingBox?.max.y ?? 0;
    const minY = boundingBox?.min.y ?? 0;

    const centerX = (maxX + minX) / 2;
    const centerY = (maxY + minY) / 2;
    const width = maxX - minX;
    const height = maxY - minY;

    console.log("Bounding Box:", {
      centerX,
      centerY,
      width,
      height,
    });

    const fontFace = "helvetiker";
    const fontSize = 10;

    const textMaterial = new MeshBasicMaterial({ color: 0x000000 });

    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    context.font = `${fontSize}px ${fontFace}`;

    const textWidth = context.measureText(text).width;
    const textHeight = fontSize;

    const scale = Math.min(width / textWidth, height / textHeight, 1);

    console.log("scale", scale);

    console.log("scale");

    const textGeometry = new TextGeometry(text, {
      font: font,
      size: fontSize * scale,
      height: 0,
      curveSegments: 12,
      bevelEnabled: false,
    });

    const textMesh = new Mesh(textGeometry, textMaterial);

    textMesh.position.x = centerX - textWidth;
    textMesh.position.y = centerY - textHeight;
    textMesh.position.z = 2;

    this.add(textMesh);
  }

  public onClick() {
    this.hallShape.material.color.setHex(Math.random() * 0xffffff);
  }

  public onMouseEnter() {
    this.hallShape.material.opacity = Math.max(
      this.initialShapeOpacity - 0.2,
      0.1
    );
  }

  public onMouseLeave() {
    this.hallShape.material.opacity = this.initialShapeOpacity;
  }
}
