import { ITool, Tools } from "@/canvas/types/tools";
import { IPathPlanner } from "@/canvas/types/models";

interface IMoveToolProps {
  pathPlanner: IPathPlanner;
}

class RemoveTool implements ITool {
  public type: Tools = Tools.Remove;

  private pathPlanner: IPathPlanner;

  constructor({ pathPlanner }: IMoveToolProps) {
    this.pathPlanner = pathPlanner;
    this.pathPlanner.eventManager.isCheckHoveredPoint = true;
    this.pathPlanner.eventManager.isCheckHoveredLine = true;
  }

  public onPointerDown = (event: PointerEvent) => {
    const hoveredPoint = this.pathPlanner.eventManager.hoveredPoint;
    const hoveredLine = this.pathPlanner.eventManager.hoveredLine;
    if (hoveredPoint) {
      this.pathPlanner.storageManager.removePoint(hoveredPoint.id);
      this.pathPlanner.render();
    }
    if (hoveredLine) {
      this.pathPlanner.storageManager.removeConnection(hoveredLine.id);
      this.pathPlanner.render();
    }
  };
}

export default RemoveTool;
