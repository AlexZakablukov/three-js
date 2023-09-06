import { Entities, IPoint } from "@/canvas/types/entities";

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
  public readonly type = Entities.Point;

  public path: Path2D = new Path2D();

  constructor({ x, y, radius }: IPointProps) {
    this.x = x;
    this.y = y;
    this.radius = radius;
  }

  public render = (ctx: CanvasRenderingContext2D) => {
    ctx.beginPath();
    this.path.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
    ctx.fillStyle = this.isHovered ? "red" : "black";
    ctx.fill(this.path);
    ctx.closePath();
  };
}

export default Point;
