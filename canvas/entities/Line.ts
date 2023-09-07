import { Entities, ILine, IPoint } from "@/canvas/types/entities";

const LINE_WIDTH = 5;
const STROKE_COLOR = "black";
const STROKE_HOVER_COLOR = "red";

interface ILineProps {
  id: string;
  startPoint: IPoint;
  endPoint: IPoint;
}

class Line implements ILine {
  public startPoint: IPoint;
  public endPoint: IPoint;
  public isHovered: boolean = false;

  public id: string;
  public readonly type = Entities.Line;

  public path: Path2D;

  constructor({ id, startPoint, endPoint }: ILineProps) {
    this.id = id;
    this.startPoint = startPoint;
    this.endPoint = endPoint;
  }

  public render = (ctx: CanvasRenderingContext2D) => {
    this.path = new Path2D();
    this.path.moveTo(this.startPoint.x, this.startPoint.y);
    this.path.lineTo(this.endPoint.x, this.endPoint.y);
    ctx.strokeStyle = this.isHovered ? STROKE_HOVER_COLOR : STROKE_COLOR;
    ctx.lineWidth = LINE_WIDTH;
    ctx.stroke(this.path);
    this.path.closePath();
  };
}

export default Line;
