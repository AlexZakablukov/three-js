import { Entities, IPoint } from "@/canvas/types/entities";

const RADIUS = 10;
const FILL_COLOR = "black";
const FILL_HOVER_COLOR = "red";

interface IPointProps {
  id: string;
  x: number;
  y: number;
}

class Point implements IPoint {
  public id: string;
  public x: number;
  public y: number;

  public isHovered: boolean = false;
  public readonly type = Entities.Point;
  public path: Path2D;

  constructor({ id, x, y }: IPointProps) {
    this.id = id;
    this.x = x;
    this.y = y;
  }

  public render = (ctx: CanvasRenderingContext2D) => {
    this.path = new Path2D();
    this.path.arc(this.x, this.y, RADIUS, 0, 2 * Math.PI);
    ctx.fillStyle = this.isHovered ? FILL_HOVER_COLOR : FILL_COLOR;
    ctx.fill(this.path);
    this.path.closePath();
  };
}

export default Point;
