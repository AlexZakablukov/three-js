import { Entities, IPoint } from "@/canvas/types/entities";
import { v4 as uuid } from "uuid";

interface IPointProps {
  x: number;
  y: number;
  radius: number;
}

class Point implements IPoint {
  public x: number;
  public y: number;
  public radius: number;
  public isHovered: boolean = false;

  public readonly id = uuid();
  public readonly type = Entities.Point;

  public path: Path2D = new Path2D();

  constructor({ x, y, radius }: IPointProps) {
    this.x = x;
    this.y = y;
    this.radius = radius;
  }

  public render = (ctx: CanvasRenderingContext2D) => {
    this.path = new Path2D();
    this.path.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
    ctx.fillStyle = this.isHovered ? "red" : "black";
    ctx.fill(this.path);
    this.path.closePath();
  };
}

export default Point;
