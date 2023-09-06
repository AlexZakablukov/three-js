import {
  IEventManager,
  IResizeManager,
  IPathPlanner,
  IStorageManager,
} from "@/canvas/types/models";
import { Tools, ITool } from "@/canvas/types/tools";

import SelectTool from "@/canvas/tools/SelectTool";
import LineTool from "@/canvas/tools/LineTool";
import PointTool from "@/canvas/tools/PointTool";

import EventManager from "@/canvas/models/EventManager";
import ResizeManager from "@/canvas/models/ResizeManager";
import StorageManager from "@/canvas/models/StorageManager";
import Point from "@/canvas/entities/Point";
import Line from "@/canvas/entities/Line";

interface IPathPlannerProps {
  canvasId: string;
}

class PathPlanner implements IPathPlanner {
  public canvas: HTMLCanvasElement;
  public ctx: CanvasRenderingContext2D;
  public tool: ITool | null = null;

  public storageManager: IStorageManager;
  public eventManager: IEventManager;

  private resizeManager: IResizeManager;

  constructor({ canvasId }: IPathPlannerProps) {
    this.init(canvasId);
  }

  private init = (canvasId: string) => {
    const canvas = document.getElementById(
      canvasId
    ) as HTMLCanvasElement | null;

    if (!canvas) {
      console.error(`Canvas element with id ${canvasId} not found.`);
      return;
    }

    const ctx = canvas.getContext("2d");

    if (!ctx) {
      console.error("2D context not supported.");
      return;
    }

    this.canvas = canvas;
    this.ctx = ctx;
    this.resizeManager = new ResizeManager({ pathPlanner: this });
    this.eventManager = new EventManager({ pathPlanner: this });
    this.storageManager = new StorageManager({
      pathPlanner: this,
      entities: [
        new Point({
          x: 10,
          y: 10,
          radius: 10,
        }),
        new Point({
          x: 100,
          y: 20,
          radius: 10,
        }),
        new Line({
          startPoint: new Point({
            x: 100,
            y: 100,
            radius: 10,
          }),
          endPoint: new Point({
            x: 200,
            y: 200,
            radius: 10,
          }),
          lineWidth: 5,
        }),
      ],
    });
    this.tool = new LineTool({ pathPlanner: this });
  };

  public render = () => {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    const entities = this.storageManager.getEntities();
    entities.forEach((entity) => entity.render(this.ctx));
  };

  public destroy = () => {
    this.resizeManager.destroy();
    this.eventManager.destroy();
  };

  public setTool = (tool: Tools) => {
    switch (tool) {
      case Tools.Point:
        this.tool = new PointTool({ pathPlanner: this });
        break;
      case Tools.Line:
        this.tool = new LineTool({ pathPlanner: this });
        break;
      case Tools.Select:
        this.tool = new SelectTool({ pathPlanner: this });
        break;
      default:
        this.tool = null;
    }
  };
}

export default PathPlanner;
