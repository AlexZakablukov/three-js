import { ITool, Tools } from "@/canvas/types/tools";
import { IPathPlanner } from "@/canvas/types/models";
import { getCoords } from "@/canvas/helpers";
import { Entities, IEntity, IPoint } from "@/canvas/types/entities";

interface IMoveToolProps {
  pathPlanner: IPathPlanner;
}

class MoveTool implements ITool {
  public type: Tools = Tools.Move;

  private hoveredPoint: IPoint | null = null;
  private pathPlanner: IPathPlanner;
  private isPointerDown: boolean;

  constructor({ pathPlanner }: IMoveToolProps) {
    this.pathPlanner = pathPlanner;
  }

  public onPointerDown = (event: PointerEvent) => {
    const hoveredEntity = this.pathPlanner.eventManager.hoveredEntity;
    if (hoveredEntity && hoveredEntity.type === Entities.Point) {
      this.hoveredPoint = hoveredEntity as IPoint;
    }
    if (this.hoveredPoint) {
      this.isPointerDown = true;
    }
  };

  public onPointerUp = (event: PointerEvent) => {
    this.isPointerDown = false;
    this.hoveredPoint = null;
  };

  public onPointerMove = (event: PointerEvent) => {
    if (this.isPointerDown && this.hoveredPoint) {
      const { x, y } = getCoords(event);
      this.hoveredPoint.x = x;
      this.hoveredPoint.y = y;
      this.pathPlanner.render();
    }
  };
}

export default MoveTool;
