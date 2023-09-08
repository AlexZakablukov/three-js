import { ITool, Tools } from "@/canvas/types/tools";
import { IPathPlanner } from "@/canvas/types/models";
import { getCoords } from "@/canvas/helpers";
import { IPoint } from "@/canvas/types/entities";

interface IMoveToolProps {
  pathPlanner: IPathPlanner;
}

class MoveTool implements ITool {
  public type: Tools = Tools.Move;

  private hoveredPoint: IPoint | null;
  private pathPlanner: IPathPlanner;
  private isPointerDown: boolean;

  constructor({ pathPlanner }: IMoveToolProps) {
    this.pathPlanner = pathPlanner;
    this.pathPlanner.eventManager.isCheckHoveredPoint = true;
    this.pathPlanner.eventManager.isCheckHoveredLine = false;
  }

  public onPointerDown = (event: PointerEvent) => {
    const hoveredPoint = this.pathPlanner.eventManager.hoveredPoint;
    if (hoveredPoint) {
      this.pathPlanner.storageManager.saveToHistory();
      /**
       * @description
       * We should use next line if storage history push instead of splice
       */
      // this.hoveredPoint = this.pathPlanner.storageManager.getPointById(
      //   hoveredPoint.id
      // );
      this.hoveredPoint = hoveredPoint;
      this.isPointerDown = true;
      this.pathPlanner.eventManager.isCheckHoveredPoint = false;
    }
  };

  public onPointerUp = (event: PointerEvent) => {
    this.isPointerDown = false;
    this.pathPlanner.eventManager.isCheckHoveredPoint = true;
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
