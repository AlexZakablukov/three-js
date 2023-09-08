import { Entities, IPoint } from "@/canvas/types/entities";

const RADIUS = 3;
const INTERACTIVE_ZONE_RADIUS = 10;
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
  public path?: Path2D;
  public interactiveZone?: Path2D;

  constructor({ id, x, y }: IPointProps) {
    this.id = id;
    this.x = x;
    this.y = y;
  }

  private renderPath = (ctx: CanvasRenderingContext2D) => {
    this.path = new Path2D();
    this.path.arc(this.x, this.y, RADIUS, 0, 2 * Math.PI);
    ctx.fillStyle = this.isHovered ? FILL_HOVER_COLOR : FILL_COLOR;
    ctx.fill(this.path);
    this.path.closePath();
  };

  private renderInteractiveZone = (ctx: CanvasRenderingContext2D) => {
    this.interactiveZone = new Path2D();
    this.interactiveZone.arc(
      this.x,
      this.y,
      INTERACTIVE_ZONE_RADIUS,
      0,
      2 * Math.PI
    );
    this.interactiveZone.closePath();
  };

  public render = (ctx: CanvasRenderingContext2D) => {
    this.renderPath(ctx);
    this.renderInteractiveZone(ctx);
  };
}

export default Point;
