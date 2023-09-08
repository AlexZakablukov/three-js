import { IPointTool, Tools } from "@/canvas/types/tools";
import { IPathPlanner } from "@/canvas/types/models";
import { getCoords } from "@/canvas/helpers";
import Point from "@/canvas/entities/Point";
import { v4 as uuid } from "uuid";

interface ILineToolProps {
  pathPlanner: IPathPlanner;
}

/**
 * @class
 * The PointTool class represents a tool for adding points to the canvas.
 * It allows users to click on the canvas to create new points.
 */
class PointTool implements IPointTool {
  public type: Tools = Tools.Point;

  private pathPlanner: IPathPlanner;

  /**
   * @constructor
   * Constructs a new PointTool instance.
   * @param {ILineToolProps} props - The properties required for initializing the tool.
   */
  constructor({ pathPlanner }: ILineToolProps) {
    this.pathPlanner = pathPlanner;
    // Disable point hover checking and enable line hover checking for the event manager.
    this.pathPlanner.eventManager.isCheckHoveredPoint = false;
    this.pathPlanner.eventManager.isCheckHoveredLine = true;
  }

  /**
   * @description
   * Handles the pointer down event when the user clicks on the canvas to add a new point.
   * @param {PointerEvent} event - The pointer event generated when the user clicks.
   */
  public onPointerDown = (event: PointerEvent) => {
    const { x, y } = getCoords(event);
    this.draw(x, y);
  };

  /**
   * @description
   * Draws a new point on the canvas at the specified coordinates.
   * @param {number} x - The x-coordinate of the point.
   * @param {number} y - The y-coordinate of the point.
   */
  private draw(x, y) {
    const point = new Point({
      id: uuid(),
      x,
      y,
    });
    this.pathPlanner.storageManager.saveToHistory();
    this.pathPlanner.storageManager.addPoint(point);
    this.pathPlanner.render();
  }
}

export default PointTool;
