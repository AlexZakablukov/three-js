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
import RemoveTool from "@/canvas/tools/RemoveTool";

import EventManager from "@/canvas/models/EventManager";
import ResizeManager from "@/canvas/models/ResizeManager";
import StorageManager from "@/canvas/models/StorageManager";

import { points, connections } from "@/canvas/mocks";

interface IPathPlannerProps {
  canvasId: string;
}

/**
 * @class
 * Represents a Path Planner application for managing points and lines on an HTML canvas.
 */
class PathPlanner implements IPathPlanner {
  public canvas: HTMLCanvasElement;
  public ctx: CanvasRenderingContext2D;
  public tool: ITool | null = null;

  public storageManager: IStorageManager;
  public eventManager: IEventManager;

  private resizeManager: IResizeManager;

  /**
   * @constructor
   * Creates a new instance of the PathPlanner class.
   * @param {IPathPlannerProps} props - The properties for initializing the PathPlanner instance.
   */
  constructor({ canvasId }: IPathPlannerProps) {
    this.init(canvasId);
  }

  /**
   * Initializes the PathPlanner instance.
   * @private
   * @param {string} canvasId - The ID of the HTML canvas element to bind the application to.
   */
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

    // Initialize instance properties.
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

  /**
   * @description
   * Renders the canvas by clearing it and then rendering points and lines.
   */
  public render = () => {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.renderLines();
    this.renderPoints();
  };

  /**
   * @description
   * Renders all the points on the canvas.
   * @private
   */
  private renderPoints = () => {
    const points = this.storageManager.points;
    points.forEach((point) => point.render(this.ctx));
  };

  /**
   * @description
   * Renders all the lines on the canvas.
   * @private
   */
  private renderLines = () => {
    const lines = this.storageManager.lines;
    lines.forEach((line) => line.render(this.ctx));
  };

  /**
   * @description
   * Undoes the most recent action and re-renders the canvas.
   */
  public undo = () => {
    this.storageManager.undo();
    this.render();
  };

  /**
   * @description
   * Redoes the most recently undone action and re-renders the canvas.
   */
  public redo = () => {
    this.storageManager.redo();
    this.render();
  };

  /**
   * @description
   * Clears all points, lines, and the canvas, and re-renders an empty canvas.
   */
  public clear = () => {
    this.storageManager.clear();
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  };

  /**
   * @description
   * Destroys the PathPlanner instance
   * by cleaning up event listeners and resources.
   */
  public destroy = () => {
    this.resizeManager.destroy();
    this.eventManager.destroy();
  };

  /**
   * Sets the active tool based on the provided tool type.
   * @param {Tools} tool - The tool type to set as the active tool.
   */
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
