import { v4 as uuid } from "uuid";
import { ILineTool, Tools } from "@/canvas/types/tools";
import {
  IEventManager,
  IPathPlanner,
  IStorageManager,
} from "@/canvas/types/models";
import { getCoords } from "@/canvas/helpers";
import { Entities, ILine, IPoint } from "@/canvas/types/entities";
import Line from "@/canvas/entities/Line";
import Point from "@/canvas/entities/Point";
import Connection from "@/canvas/entities/Connection";

interface ILineToolProps {
  pathPlanner: IPathPlanner;
}

class LineTool implements ILineTool {
  public type: Tools = Tools.Line;

  private pathPlanner: IPathPlanner;
  private storageManager: IStorageManager;
  private eventManager: IEventManager;

  private isPointerDown: boolean = false;

  private line: ILine | null;
  private isTempEndPoint: boolean = false;
  private startPoint: IPoint | null = null;
  private endPoint: IPoint | null = null;

  constructor({ pathPlanner }: ILineToolProps) {
    this.pathPlanner = pathPlanner;
    this.storageManager = pathPlanner.storageManager;
    this.eventManager = pathPlanner.eventManager;
    this.eventManager.isCheckHoveredPoint = true;
    this.eventManager.isCheckHoveredLine = false;
  }

  public onPointerDown = (event: PointerEvent) => {
    this.isPointerDown = true;
    const hoveredPoint = this.eventManager.hoveredPoint;
    this.storageManager.saveToHistory();
    if (!hoveredPoint) {
      const { x, y } = getCoords(event);
      this.startPoint = new Point({ id: uuid(), x, y });
      this.storageManager.addPoint(this.startPoint);
    } else {
      this.startPoint = hoveredPoint as IPoint;
    }
  };

  public onPointerUp = (event: PointerEvent) => {
    this.isPointerDown = false;
    const hoveredPoint = this.eventManager.hoveredPoint;

    if (hoveredPoint && hoveredPoint.id === this.startPoint?.id) {
      this.line && this.storageManager.removeLine(this.line.id);
      this.endPoint && this.storageManager.removePoint(this.endPoint.id);

      this.startPoint &&
        this.endPoint &&
        this.storageManager.addConnection(
          new Connection({
            id: uuid(),
            pointIds: [this.startPoint.id, hoveredPoint.id],
          })
        );
    } else if (this.startPoint && this.endPoint) {
      this.storageManager.addPoint(this.endPoint);
      this.storageManager.addConnection(
        new Connection({
          id: uuid(),
          pointIds: [this.startPoint.id, this.endPoint.id],
        })
      );
      this.endPoint.render(this.pathPlanner.ctx);
    }

    this.startPoint = null;
    this.isTempEndPoint = false;
    this.endPoint = null;
    this.line = null;
  };

  public onPointerMove = (event: PointerEvent) => {
    if (this.isPointerDown && this.startPoint) {
      const { x, y } = getCoords(event);
      const hoveredPoint = this.eventManager.hoveredPoint;

      if (this.isTempEndPoint && this.endPoint) {
        this.endPoint.x = x;
        this.endPoint.y = y;
      } else {
        this.isTempEndPoint = true;
        this.endPoint = new Point({ id: uuid(), x, y });
      }

      if (hoveredPoint && hoveredPoint.id !== this.startPoint.id) {
        this.isTempEndPoint = false;
        this.endPoint = hoveredPoint as IPoint;
      }
      this.draw();
    }
  };

  private draw() {
    if (!this.startPoint || !this.endPoint) {
      return;
    }
    this.pathPlanner.ctx.beginPath();
    this.pathPlanner.ctx.moveTo(this.startPoint.x, this.startPoint.y);
    if (this.line) {
      this.line.endPoint = this.endPoint;
    } else {
      this.line = new Line({
        id: uuid(),
        startPoint: this.startPoint,
        endPoint: this.endPoint,
      });
      this.storageManager.addLine(this.line);
    }
    this.pathPlanner.render();
  }
}

export default LineTool;
