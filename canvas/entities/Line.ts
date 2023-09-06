import { Entities, ILine, IPoint } from "@/canvas/types/entities";
import { v4 as uuid } from "uuid";

interface ILineProps {
  startPoint: IPoint;
  endPoint: IPoint;
  lineWidth: number;
}

class Line implements ILine {
  public startPoint: IPoint;
  public endPoint: IPoint;
  public lineWidth: number;
  public isHovered: boolean = false;

  public readonly id = uuid();
  public readonly type = Entities.Line;

  public path: Path2D = new Path2D();

  constructor({ startPoint, endPoint, lineWidth }: ILineProps) {
    this.startPoint = startPoint;
    this.endPoint = endPoint;
    this.lineWidth = lineWidth;
  }

  public render = (ctx: CanvasRenderingContext2D) => {
    this.path = new Path2D();
    this.path.moveTo(this.startPoint.x, this.startPoint.y);
    this.path.lineTo(this.endPoint.x, this.endPoint.y);
    ctx.strokeStyle = this.isHovered ? "red" : "black";
    ctx.lineWidth = this.lineWidth;
    ctx.stroke(this.path);
    this.path.closePath();
  };
}

export default Line;
