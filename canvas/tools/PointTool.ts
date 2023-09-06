import { IPointTool, Tools } from "@/canvas/types/tools";
import { IPathPlanner, IStorageManager } from "@/canvas/types/models";
import { getCoords } from "@/canvas/helpers";
import Point from "@/canvas/entities/Point";

interface ILineToolProps {
  pathPlanner: IPathPlanner;
}

class PointTool implements IPointTool {
  public type: Tools = Tools.Point;

  private ctx: CanvasRenderingContext2D;
  private storage: IStorageManager;

  constructor({ pathPlanner }: ILineToolProps) {
    this.ctx = pathPlanner.ctx;
    this.storage = pathPlanner.storageManager;
  }

  public onPointerDown = (event: PointerEvent) => {
    if (!event.target) {
      return;
    }
    const { x, y } = getCoords(event);

    this.draw(x, y, 10);
  };

  public onPointerUp = () => {};

  public onPointerMove = () => {};

  private draw(x, y, radius) {
    const point = new Point({
      x,
      y,
      radius,
    });

    this.storage.addEntity(point);

    point.render(this.ctx);
  }
}

export default PointTool;
