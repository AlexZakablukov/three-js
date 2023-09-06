import { ILineTool, Tools } from "@/canvas/types/tools";
import { IPathPlanner } from "@/canvas/types/models";
import { getCoords } from "@/canvas/helpers";
import { Entities, IEntity, IPoint } from "@/canvas/types/entities";
import Line from "@/canvas/entities/Line";

interface ILineToolProps {
  pathPlanner: IPathPlanner;
}

class LineTool implements ILineTool {
  public type: Tools = Tools.Line;

  private pathPlanner: IPathPlanner;

  private isPointerDown: boolean = false;

  private startPoint: IPoint;
  private endPoint: IPoint;

  constructor({ pathPlanner }: ILineToolProps) {
    this.pathPlanner = pathPlanner;
  }

  public onPointerDown = (event: PointerEvent) => {
    const hoveredEntity = this.pathPlanner.eventManager.hoveredEntity;
    if (
      !hoveredEntity ||
      hoveredEntity.type !== Entities.Point ||
      !event.target
    ) {
      return;
    }
    this.isPointerDown = true;
    this.startPoint = hoveredEntity as IPoint;
  };

  public onPointerUp = (event: PointerEvent) => {
    this.isPointerDown = false;
    const hoveredEntity = this.pathPlanner.eventManager.hoveredEntity;
    if (
      !hoveredEntity ||
      hoveredEntity.type !== Entities.Point ||
      hoveredEntity === this.startPoint ||
      !event.target
    ) {
      return;
    }
    this.endPoint = hoveredEntity as IPoint;
    const line = new Line({
      startPoint: this.startPoint,
      endPoint: this.endPoint,
      lineWidth: 5,
    });
    this.pathPlanner.storageManager.addEntity(line);
    line.render(this.pathPlanner.ctx);
  };

  public onPointerMove = (event: PointerEvent) => {
    if (this.isPointerDown) {
      const { x, y } = getCoords(event);
      console.log("drag");
      this.draw(x, y);
    }
  };

  private draw(x, y) {}
}

export default LineTool;
