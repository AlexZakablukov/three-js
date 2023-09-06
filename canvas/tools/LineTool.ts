import { ILineTool, Tools } from "@/canvas/types/tools";
import { IPathPlanner } from "@/canvas/types/models";
import { getCoords } from "@/canvas/helpers";

interface ILineToolProps {
  pathPlanner: IPathPlanner;
}

class LineTool implements ILineTool {
  public type: Tools = Tools.Line;

  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private isPointerDown: boolean = false;
  private startX: number;
  private startY: number;
  private endX: number;
  private endY: number;
  private saved;

  constructor({ pathPlanner }: ILineToolProps) {
    this.canvas = pathPlanner.canvas;
    this.ctx = pathPlanner.ctx;
  }

  public onPointerDown = (event: PointerEvent) => {
    this.isPointerDown = true;
    if (!event.target) {
      return;
    }
    const { x, y } = getCoords(event);

    this.startX = x;
    this.startY = y;

    this.ctx.beginPath();
    this.ctx.moveTo(this.startX, this.startY);
    this.saved = this.canvas.toDataURL();
  };

  public onPointerUp = (event: PointerEvent) => {
    this.isPointerDown = false;
  };

  public onPointerMove = (event: PointerEvent) => {
    if (this.isPointerDown) {
      const { x, y } = getCoords(event);
      this.endX = x;
      this.endY = y;
      this.draw();
    }
  };

  private draw() {
    const img = new Image();
    img.src = this.saved;
    img.onload = () => {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.ctx.drawImage(img, 0, 0, this.canvas.width, this.canvas.height);
      this.ctx.beginPath();
      this.ctx.moveTo(this.startX, this.startY);
      this.ctx.lineTo(this.endX, this.endY);
      this.ctx.stroke();
    };
  }
}

export default LineTool;
