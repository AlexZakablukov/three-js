import { IPointTool, Tools } from "@/canvas/types/tools";
import { IPathPlanner } from "@/canvas/types/models";
import { getCoords } from "@/canvas/helpers";
import Point from "@/canvas/entities/Point";
import { v4 as uuid } from "uuid";
import { event } from "next/dist/build/output/log";

interface ILineToolProps {
  pathPlanner: IPathPlanner;
}

class PointTool implements IPointTool {
  public type: Tools = Tools.Point;

  private pathPlanner: IPathPlanner;

  constructor({ pathPlanner }: ILineToolProps) {
    this.pathPlanner = pathPlanner;
    this.pathPlanner.eventManager.isCheckHoveredPoint = false;
    this.pathPlanner.eventManager.isCheckHoveredLine = true;
  }

  public onPointerDown = (event: PointerEvent) => {
    const { x, y } = getCoords(event);
    this.draw(x, y);
  };

  private draw(x, y) {
    const point = new Point({
      id: uuid(),
      x,
      y,
    });

    this.pathPlanner.storageManager.addPoint(point);
    this.pathPlanner.render();
  }
}

export default PointTool;
