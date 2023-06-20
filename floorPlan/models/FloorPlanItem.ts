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
  Texture,
  PlaneGeometry,
  DoubleSide,
  SpriteMaterial,
  Sprite,
} from "three";
import { IFloorPlanItemData, IFloorPlanItem } from "../types/prepared";
import { IParams, TCoords } from "@/floorPlan/types/helpers";
import { getBoundingBox } from "@/floorPlan/helpers/getBoundingBox";
import { IFloorPlanItemOptions } from "@/floorPlan/types/floorPlan";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry";

export class FloorPlanItem extends Group {
  public data: IFloorPlanItemData;
  private hallShape: Mesh<ShapeGeometry, MeshBasicMaterial>;
  private hallStroke: LineSegments;
  private hallLabel: Mesh<TextGeometry, MeshBasicMaterial>;
  private initialShapeOpacity: number = 1;
  private options?: IFloorPlanItemOptions;

  constructor(items: IFloorPlanItem, options: IFloorPlanItemOptions) {
    super();
    const { coords, params, data } = items;
    this.data = data;
    this.options = options;
    coords && params && this.createShape(coords, params);
    this.hallShape && params && this.createStroke(params);
    this.hallShape && this.createLabel(data.title);
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

  private createLabel(text: string) {
    if (!this.options?.font) {
      return;
    }

    // const shapeBoundingBox = getBoundingBox(this.hallShape.geometry);
    //
    // const canvas = document.createElement("canvas");
    // const context = canvas.getContext("2d");
    // canvas.width = shapeBoundingBox.width;
    // canvas.height = shapeBoundingBox.height;
    // // console.log(context.measureText(text), text);
    // context.font = "20pt Arial";
    // context.textAlign = "center";
    // context.fillStyle = "rgba(0,0,0,0.95)";
    // context.fillText(text, canvas.width / 2, canvas.height / 2);
    //
    // // console.log("context", context);
    //
    // const texture = new Texture(canvas);
    // texture.needsUpdate = true;
    //
    // const spriteMat = new SpriteMaterial({
    //   map: texture,
    // });
    // const sprite = new Sprite(spriteMat);
    // sprite.position.set(shapeBoundingBox.centerX, shapeBoundingBox.centerY, 2);
    // sprite.scale.set(shapeBoundingBox.width, shapeBoundingBox.height, 1);

    // console.log("sprite", sprite);

    // mesh.position.set(shapeBoundingBox.centerX, shapeBoundingBox.centerY, 2);

    // this.hallShape.add(sprite);

    // const shapeBoundingBox = getBoundingBox(this.hallShape.geometry);
    //
    // const textMaterial = new MeshBasicMaterial({ color: 0x000000 });
    //
    // const textGeometry = new TextGeometry(text, {
    //   font: this.options.font,
    //   size: 12,
    //   height: 0,
    // });
    //
    // const textBoundingBox = getBoundingBox(textGeometry);
    //
    // const textMesh = new Mesh(textGeometry, textMaterial);
    //
    // textMesh.position.x = shapeBoundingBox.centerX - textBoundingBox.width / 2;
    // textMesh.position.y = shapeBoundingBox.centerY - textBoundingBox.height / 2;
    // textMesh.position.z = 2;

    // this.add(textMesh);

    // const label = new Text();
    // label.text = text;
    // label.color = "black";
    // label.fontSize = 10;
    // label.textAlign = "center";
    // label.anchorX = "center";
    // label.anchorY = "middle";
    // label.position.x = shapeBoundingBox.centerX;
    // label.position.y = shapeBoundingBox.centerY;
    // label.position.z = 3;
    // label.maxWidth = shapeBoundingBox.width - 30;
    //
    // onSync && label.sync(onSync);

    // this.hallLabel = textMesh;
  }

  public onClick() {
    this.hallShape.material.color.setHex(Math.random() * 0xffffff);
    this.options?.events?.onItemClick &&
      this.options?.events.onItemClick(this.data);
  }

  public onMouseEnter() {
    this.hallShape.material.opacity = Math.max(
      this.initialShapeOpacity - 0.2,
      0.1
    );
    this.options?.events?.onItemEnter &&
      this.options?.events.onItemEnter(this.data);
  }

  public onMouseLeave() {
    this.hallShape.material.opacity = this.initialShapeOpacity;
    this.options?.events?.onItemLeave &&
      this.options?.events.onItemLeave(this.data);
  }
}
