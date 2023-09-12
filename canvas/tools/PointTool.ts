import { IPointTool, Tools } from "@/canvas/types/tools";
import { IPathPlanner } from "@/canvas/types/models";
import { getCoords, getNearestCoordsToLine } from "@/canvas/helpers";
import Point from "@/canvas/entities/Point";
import { v4 as uuid } from "uuid";
import { IPoint } from "@/canvas/types/entities";
import Connection from "@/canvas/entities/Connection";

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
  private tempPoint: IPoint | null;

  /**
   * @constructor
   * Constructs a new PointTool instance.
   * @param {ILineToolProps} props - The properties required for initializing the tool.
   */
  constructor({ pathPlanner }: ILineToolProps) {
    this.pathPlanner = pathPlanner;
    // Disable point hover checking and enable line hover checking for the event manager.
    this.pathPlanner.eventManager.isCheckHoveredPoint = false;
    this.pathPlanner.eventManager.isCheckHoveredLines = true;
  }

  /**
   * @description
   * Handles the pointer down event when the user clicks on the canvas to add a new point.
   * @param {PointerEvent} event - The pointer event generated when the user clicks.
   */
  public onPointerDown = (event: PointerEvent) => {
    const hoveredLines = this.pathPlanner.eventManager.hoveredLines;

    if (this.tempPoint && hoveredLines.length) {
      this.pathPlanner.storageManager.removePoint(this.tempPoint.id);
      this.pathPlanner.storageManager.saveToHistory();
      const point = new Point({
        id: uuid(),
        x: this.tempPoint.x,
        y: this.tempPoint.y,
      });
      this.pathPlanner.storageManager.addPoint(point);
      this.tempPoint = null;

      hoveredLines.forEach((line) => {
        this.pathPlanner.storageManager.addConnection(
          new Connection({
            id: uuid(),
            pointIds: [line.startPoint.id, point.id],
          })
        );
        this.pathPlanner.storageManager.addConnection(
          new Connection({
            id: uuid(),
            pointIds: [point.id, line.endPoint.id],
          })
        );
        this.pathPlanner.storageManager.removeConnection(line.id);
      });
      this.pathPlanner.storageManager.generateLines();
      return;
    } else {
      const { x, y } = getCoords(event);
      this.draw(x, y);
    }
  };

  // если навелись на линии то видим временную точку, по нажатию создадим ее
  public onPointerMove = (event: PointerEvent) => {
    const { x, y } = getCoords(event);
    const hoveredLines = this.pathPlanner.eventManager.hoveredLines;
    if (!hoveredLines.length && this.tempPoint) {
      this.pathPlanner.storageManager.removePoint(this.tempPoint.id);
      this.tempPoint = null;
      this.pathPlanner.render();
      return;
    }
    if (hoveredLines.length) {
      const nearest = getNearestCoordsToLine({
        source: { x, y },
        line: hoveredLines[0],
      });

      if (this.tempPoint) {
        this.tempPoint.x = nearest.x;
        this.tempPoint.y = nearest.y;
      } else {
        this.tempPoint = new Point({
          id: uuid(),
          x: nearest.x,
          y: nearest.y,
        });
        this.pathPlanner.storageManager.addPoint(this.tempPoint);
      }
      this.pathPlanner.render();
    }
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
