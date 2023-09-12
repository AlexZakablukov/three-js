import { IEventManager, IPathPlanner } from "@/canvas/types/models";
import { IPoint, ILine } from "@/canvas/types/entities";
import { getCoords } from "@/canvas/helpers";

/**
 * @interface IEventManagerProps
 * @description Properties for initializing the EventManager class.
 * @property {IPathPlanner} pathPlanner - The path planner instance.
 */
interface IEventManagerProps {
  pathPlanner: IPathPlanner;
}

/**
 * @class
 * @implements {IEventManager}
 * @description Manages events, such as pointer interactions, and handles hover states for points and lines.
 */
class EventManager implements IEventManager {
  public hoveredPoint: IPoint | null = null;
  public hoveredLine: ILine | null = null;
  public isCheckHoveredPoint: boolean = false;
  public isCheckHoveredLines: boolean = false;

  public hoveredLines: ILine[] = [];

  private pathPlanner: IPathPlanner;

  /**
   * @constructor
   * @param {IEventManagerProps} param - The properties for initializing the EventManager.
   */
  constructor({ pathPlanner }: IEventManagerProps) {
    this.pathPlanner = pathPlanner;
    this.addEventListeners();
  }

  /**
   * @private
   * @description Adds event listeners to the canvas for pointer events.
   */
  private addEventListeners() {
    const canvas = this.pathPlanner.canvas;

    if (!canvas) {
      console.error("Canvas element not found.");
      return;
    }

    canvas.addEventListener("pointerdown", this.onPointerDown);
    canvas.addEventListener("pointerup", this.onPointerUp);
    canvas.addEventListener("pointermove", this.onPointerMove);
  }

  /**
   * @private
   * @param {PointerEvent} event - The pointer down event.
   * @description Handles the pointer down event and delegates to the active tool if available.
   */
  private onPointerDown = (event: PointerEvent) => {
    const activeTool = this.pathPlanner.tool;

    if (activeTool && activeTool.onPointerDown) {
      activeTool.onPointerDown(event);
    }
  };

  /**
   * @private
   * @param {PointerEvent} event - The pointer up event.
   * @description Handles the pointer up event and delegates to the active tool if available.
   */
  private onPointerUp = (event: PointerEvent) => {
    const activeTool = this.pathPlanner.tool;

    if (activeTool && activeTool.onPointerUp) {
      activeTool.onPointerUp(event);
    }
  };

  /**
   * @private
   * @param {PointerEvent} event - The pointer move event.
   * @description Handles the pointer move event, checks for hovered points and lines, and delegates to the active tool if available.
   */
  private onPointerMove = (event: PointerEvent) => {
    if (this.isCheckHoveredPoint) {
      this.checkHoveredPoint(event);
    }

    if (this.isCheckHoveredLines) {
      this.checkHoveredLines(event);
    }

    const activeTool = this.pathPlanner.tool;

    if (activeTool && activeTool.onPointerMove) {
      activeTool.onPointerMove(event);
    }
  };

  /**
   * @private
   * @param {PointerEvent} event - The pointer event to check.
   * @description Checks for hovered points based on the pointer event's coordinates.
   */
  private checkHoveredPoint(event: PointerEvent) {
    // Extract the pointer's coordinates from the event.
    const { x, y } = getCoords(event);

    // Get the list of points from the storage manager.
    const points = this.pathPlanner.storageManager.points;

    // Find the point that the pointer is currently hovering over, if any
    const hoveredPoint = points.find((point) => {
      if (point.interactiveZone) {
        // Check if the pointer's coordinates are inside the path of the point.
        return this.pathPlanner.ctx.isPointInPath(point.interactiveZone, x, y);
      }
    });

    // Check if the pointer is hovering over the same point as before,
    // and do nothing if it is.
    if (
      hoveredPoint &&
      this.hoveredPoint &&
      hoveredPoint.id === this.hoveredPoint.id
    ) {
      return;
    }

    // If the pointer is not hovering over any point
    // but a point was previously hovered, clear the hover state.
    if (!hoveredPoint && this.hoveredPoint) {
      this.hoveredPoint.isHovered = false;
      this.hoveredPoint = null;
      this.pathPlanner.render();
    }

    // If the pointer is hovering over a different point,
    // update the hover state for both points.
    if (
      hoveredPoint &&
      this.hoveredPoint &&
      hoveredPoint.id !== this.hoveredPoint.id
    ) {
      this.hoveredPoint.isHovered = false;
      hoveredPoint.isHovered = true;
      this.hoveredPoint = hoveredPoint;
      this.pathPlanner.render();
      return;
    }

    // If the pointer is hovering over a point for the first time,
    // set its hover state.
    if (hoveredPoint && !this.hoveredPoint) {
      hoveredPoint.isHovered = true;
      this.hoveredPoint = hoveredPoint;
      this.pathPlanner.render();
      return;
    }
  }

  private checkHoveredLines = (event: PointerEvent) => {
    const { x, y } = getCoords(event);
    const lines = this.pathPlanner.storageManager.lines;

    this.hoveredLines.forEach((line) => {
      line.isHovered = false;
    });

    const hoveredLines = lines.filter((line) => {
      if (!line.interactiveZone) {
        return false;
      }
      return this.pathPlanner.ctx.isPointInStroke(line.interactiveZone, x, y);
    });

    hoveredLines.forEach((line) => {
      line.isHovered = true;
    });

    this.hoveredLines = hoveredLines;
    this.pathPlanner.render();
  };

  /**
   * @public
   * @description Disconnects event listeners from the canvas.
   */
  public destroy() {
    const canvas = this.pathPlanner.canvas;

    if (!canvas) {
      return;
    }

    canvas.removeEventListener("pointerdown", this.onPointerDown);
    canvas.removeEventListener("pointerup", this.onPointerUp);
    canvas.removeEventListener("pointermove", this.onPointerMove);
  }
}

export default EventManager;
