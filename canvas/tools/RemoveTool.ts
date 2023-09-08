import { ITool, Tools } from "@/canvas/types/tools";
import { IPathPlanner } from "@/canvas/types/models";

interface IMoveToolProps {
  pathPlanner: IPathPlanner;
}

/**
 * @class
 * The RemoveTool class represents a tool for removing points and connections from the canvas.
 * It allows users to click on a point or connection to remove it from the canvas.
 */
class RemoveTool implements ITool {
  public type: Tools = Tools.Remove;

  private pathPlanner: IPathPlanner;

  /**
   * @constructor
   * Constructs a new RemoveTool instance.
   * @param {IMoveToolProps} props - The properties required for initializing the tool.
   */
  constructor({ pathPlanner }: IMoveToolProps) {
    this.pathPlanner = pathPlanner;
    this.pathPlanner.eventManager.isCheckHoveredPoint = true;
    this.pathPlanner.eventManager.isCheckHoveredLine = true;
  }

  /**
   * @description
   * Handles the pointer down event when the user clicks on a point or connection to remove it.
   * @param {PointerEvent} event - The pointer event generated when the user clicks.
   */
  public onPointerDown = (event: PointerEvent) => {
    const hoveredPoint = this.pathPlanner.eventManager.hoveredPoint;
    const hoveredLine = this.pathPlanner.eventManager.hoveredLine;
    // Check if a point is hovered and remove it from the canvas.
    if (hoveredPoint) {
      this.pathPlanner.storageManager.saveToHistory();
      this.pathPlanner.storageManager.removePoint(hoveredPoint.id);
      this.pathPlanner.render();
    }
    // Check if a connection (line) is hovered and remove it from the canvas.
    if (hoveredLine) {
      this.pathPlanner.storageManager.saveToHistory();
      this.pathPlanner.storageManager.removeConnection(hoveredLine.id);
      this.pathPlanner.render();
    }
  };
}

export default RemoveTool;
