import { ITool, Tools } from "@/canvas/types/tools";
import { IPathPlanner } from "@/canvas/types/models";
import { getCoords } from "@/canvas/helpers";
import { IPoint } from "@/canvas/types/entities";

interface IMoveToolProps {
  pathPlanner: IPathPlanner;
}

/**
 * @class
 * The MoveTool class represents a tool for moving points on the canvas.
 * It allows users to click and drag points to new positions.
 */
class MoveTool implements ITool {
  public type: Tools = Tools.Move;

  private hoveredPoint: IPoint | null;
  private pathPlanner: IPathPlanner;
  private isPointerDown: boolean;

  /**
   * Constructs a new MoveTool instance.
   *
   * @constructor
   * @param {IMoveToolProps} props - The properties required for initializing the tool.
   */
  constructor({ pathPlanner }: IMoveToolProps) {
    this.pathPlanner = pathPlanner;
    // Enable point hover checking and disable line hover checking for the event manager.
    this.pathPlanner.eventManager.isCheckHoveredPoint = true;
    this.pathPlanner.eventManager.isCheckHoveredLine = false;
  }

  /**
   * @description
   * Handles the pointer down event when the user clicks on a point to start moving it.
   * @param {PointerEvent} event - The pointer event generated when the user clicks.
   */
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

  /**
   * @description
   * Handles the pointer up event when the user releases the mouse button after moving a point.
   * @param {PointerEvent} event - The pointer event generated when the user releases the mouse button.
   */
  public onPointerUp = (event: PointerEvent) => {
    this.isPointerDown = false;
    this.pathPlanner.eventManager.isCheckHoveredPoint = true;
    this.hoveredPoint = null;
  };

  /**
   * @description
   * Handles the pointer move event while the user is dragging a point to update its position.
   * @param {PointerEvent} event - The pointer event generated as the user drags the point.
   */
  public onPointerMove = (event: PointerEvent) => {
    if (this.isPointerDown && this.hoveredPoint) {
      const { x, y } = getCoords(event);
      this.hoveredPoint.x = x;
      this.hoveredPoint.y = y;
      // Trigger a canvas re-render to display the updated point position.
      this.pathPlanner.render();
    }
  };
}

export default MoveTool;
