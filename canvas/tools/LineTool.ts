import { v4 as uuid } from "uuid";
import { ILineTool, Tools } from "@/canvas/types/tools";
import {
  IEventManager,
  IPathPlanner,
  IStorageManager,
} from "@/canvas/types/models";
import { getCoords } from "@/canvas/helpers";
import { ILine, IPoint } from "@/canvas/types/entities";
import Line from "@/canvas/entities/Line";
import Point from "@/canvas/entities/Point";
import Connection from "@/canvas/entities/Connection";

interface ILineToolProps {
  pathPlanner: IPathPlanner;
}

/**
 * @class
 * Represents a Line Tool used for creating lines and connections on an HTML canvas.
 */
class LineTool implements ILineTool {
  public type: Tools = Tools.Line;

  private pathPlanner: IPathPlanner;
  private storageManager: IStorageManager;
  private eventManager: IEventManager;

  private isPointerDown: boolean = false;

  // The current line being drawn or edited.
  private line: ILine | null;

  // flag indicating whether the start point of the line is temporary.
  private isTempStartPoint: boolean = false;
  // flag indicating whether the end point of the line is temporary.
  private isTempEndPoint: boolean = false;
  private startPoint: IPoint | null = null;
  private endPoint: IPoint | null = null;

  /**
   * Creates a new instance of the LineTool class.
   * @param {ILineToolProps} props - The properties for initializing the LineTool instance.
   */
  constructor({ pathPlanner }: ILineToolProps) {
    this.pathPlanner = pathPlanner;
    this.storageManager = pathPlanner.storageManager;
    this.eventManager = pathPlanner.eventManager;
    this.eventManager.isCheckHoveredPoint = true;
    this.eventManager.isCheckHoveredLine = false;
  }

  /**
   * @description
   * Handles the 'pointerdown' event.
   * @param {PointerEvent} event - The 'pointerdown' event object.
   */
  public onPointerDown = (event: PointerEvent) => {
    // Set the flag to indicate that the pointer is currently pressed.
    this.isPointerDown = true;
    // Check if there's a hovered point under the pointer's position.
    const hoveredPoint = this.eventManager.hoveredPoint;
    // Save the current canvas state to the history stack to support undo/redo functionality.
    this.storageManager.saveToHistory();

    // If no point is hovered, create a new point at the pointer's position and add it to the storage.
    if (!hoveredPoint) {
      this.isTempStartPoint = true;
      const { x, y } = getCoords(event);
      this.startPoint = new Point({ id: uuid(), x, y });
      this.storageManager.addPoint(this.startPoint);
    } else {
      this.isTempStartPoint = false;
      // If a point is hovered, set it as the starting point for the line.
      this.startPoint = hoveredPoint as IPoint;
    }
  };

  /**
   * @description
   * Handles the 'pointerup' event.
   * @param {PointerEvent} event - The 'pointerup' event object.
   */
  public onPointerUp = (event: PointerEvent) => {
    // Reset the flag to indicate that the pointer is no longer pressed.
    this.isPointerDown = false;

    // Check if the required points (start and end) are available.
    if (!this.startPoint || !this.endPoint) {
      return;
    }

    // Get the currently hovered point under the pointer's position.
    const hoveredPoint = this.eventManager.hoveredPoint;

    // Check if the pointer was released over the same point where the line started.
    if (hoveredPoint && hoveredPoint.id === this.startPoint.id) {
      // If the line started and ended at the same point and is temporary,
      // remove the start point and line.
      this.isTempStartPoint &&
        this.storageManager.removePoint(this.startPoint.id);
      this.line && this.storageManager.removeLine(this.line.id);
      // Remove the end point as well since it's no longer needed.
      this.storageManager.removePoint(this.endPoint.id);
    } else {
      // If the line ended at a different point, add the end point and create a connection.
      this.storageManager.addPoint(this.endPoint);
      this.storageManager.addConnection(
        new Connection({
          id: uuid(),
          pointIds: [this.startPoint.id, this.endPoint.id],
        })
      );
      // Render the end point on the canvas.
      this.pathPlanner.render();
    }

    // Reset variables and clean up the line object.
    this.startPoint = null;
    this.isTempStartPoint = false;
    this.isTempEndPoint = false;
    this.endPoint = null;
    this.line = null;
  };

  /**
   * @description
   * Handles the 'pointermove' event.
   * @param {PointerEvent} event - The 'pointermove' event object.
   */
  public onPointerMove = (event: PointerEvent) => {
    // Check if the pointer is down and a start point is available.
    if (this.isPointerDown && this.startPoint) {
      // Get the current pointer coordinates (x, y).
      const { x, y } = getCoords(event);
      // Get the currently hovered point under the pointer's position.
      const hoveredPoint = this.eventManager.hoveredPoint;

      // Check if the Shift key is pressed.
      const isShiftPressed = event.shiftKey;

      // Check if an endpoint exists and it's temporary.
      if (this.isTempEndPoint && this.endPoint) {
        if (isShiftPressed) {
          const deltaX = Math.abs(x - this.startPoint.x);
          const deltaY = Math.abs(y - this.startPoint.y);
          // If Shift is pressed, draw a horizontal line if deltaX is greater than deltaY,
          // otherwise draw a vertical line.
          if (deltaX > deltaY) {
            this.endPoint.x = x;
            this.endPoint.y = this.startPoint.y;
          } else {
            this.endPoint.x = this.startPoint.x;
            this.endPoint.y = y;
          }
        } else {
          // Update the endpoint's coordinates to match the pointer's position.
          this.endPoint.x = x;
          this.endPoint.y = y;
        }
      } else {
        // If no endpoint or it's not temporary, create a new endpoint at the pointer's position.
        this.isTempEndPoint = true;
        this.endPoint = new Point({ id: uuid(), x, y });
      }

      // Check if the pointer is hovering over a different point than the start point.
      if (hoveredPoint && hoveredPoint.id !== this.startPoint.id) {
        // If yes, reset the temporary endpoint and set it to the hovered point.
        this.isTempEndPoint = false;
        this.endPoint = hoveredPoint as IPoint;
      }
      // Draw the line or update it based on the current start and endpoint.
      this.draw();
    }
  };

  /**
   * @description
   * Draws or updates a line based on the current start and endpoint coordinates.
   * If no line exists, it creates a new line and adds it to the storage manager.
   * This method is used in response to pointer movement during line drawing.
   */
  private draw() {
    // Check if both the start and endpoint exist.
    if (!this.startPoint || !this.endPoint) {
      return;
    }
    // Check if a line already exists.
    if (this.line) {
      // Update the existing line's endpoint to match the current endpoint.
      this.line.endPoint = this.endPoint;
    } else {
      // If no line exists, create a new line with a unique identifier,
      // using the start and endpoint coordinates, and add it to the storage manager.
      this.line = new Line({
        id: uuid(),
        startPoint: this.startPoint,
        endPoint: this.endPoint,
      });
      this.storageManager.addLine(this.line);
    }
    // Trigger a rendering of the canvas to display the updated line.
    this.pathPlanner.render();
  }
}

export default LineTool;
