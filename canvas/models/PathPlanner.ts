import {
  IEventManager,
  IResizeManager,
  IPathPlanner,
  IStorageManager,
} from "@/canvas/types/models";
import { Tools, ITool } from "@/canvas/types/tools";

import MoveTool from "@/canvas/tools/MoveTool";
import LineTool from "@/canvas/tools/LineTool";
import PointTool from "@/canvas/tools/PointTool";

import EventManager from "@/canvas/models/EventManager";
import ResizeManager from "@/canvas/models/ResizeManager";
import StorageManager from "@/canvas/models/StorageManager";

import { points, connections } from "@/canvas/mocks";
import RemoveTool from "@/canvas/tools/RemoveTool";

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
      points,
      connections,
    });
    this.tool = new LineTool({ pathPlanner: this });
  };

  public render = () => {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.renderLines();
    this.renderPoints();
  };

  private renderPoints = () => {
    const points = this.storageManager.points;
    points.forEach((point) => point.render(this.ctx));
  };

  private renderLines = () => {
    const lines = this.storageManager.lines;
    lines.forEach((line) => line.render(this.ctx));
  };

  public undo = () => {
    this.storageManager.undo();
    this.render();
  };

  public redo = () => {
    this.storageManager.redo();
    this.render();
  };

  public clear = () => {
    this.storageManager.clear();
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
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
      case Tools.Move:
        this.tool = new MoveTool({ pathPlanner: this });
        break;
      case Tools.Remove:
        this.tool = new RemoveTool({ pathPlanner: this });
        break;
      default:
        this.tool = null;
    }
  };
}

export default PathPlanner;
