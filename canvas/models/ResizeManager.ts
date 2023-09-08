import { IPathPlanner, IResizeManager } from "@/canvas/types/models";

/**
 * @interface ICanvasSizeObserverProps
 * @description Properties for initializing the ResizeManager class.
 * @property {IPathPlanner} pathPlanner - The path planner instance.
 */
interface ICanvasSizeObserverProps {
  pathPlanner: IPathPlanner;
}

/**
 * @class
 * @implements {IResizeManager}
 * @description Manages resizing of the canvas based on the parent element's size changes.
 */
class ResizeManager implements IResizeManager {
  private pathPlanner: IPathPlanner;
  private resizeObserver: ResizeObserver;

  /**
   * @constructor
   * @param {ICanvasSizeObserverProps} param - The properties for initializing the ResizeManager.
   */
  constructor({ pathPlanner }: ICanvasSizeObserverProps) {
    this.pathPlanner = pathPlanner;
    this.init();
  }

  /**
   * @private
   * @description Initializes the ResizeManager by creating a ResizeObserver.
   * The ResizeObserver is used to monitor size changes of the parent element of the canvas.
   */
  private init() {
    this.resizeObserver = new ResizeObserver(this.onParentResize);
    this.resizeObserver.observe(this.pathPlanner.canvas.parentElement);
  }

  /**
   * @private
   * @param {ResizeObserverEntry[]} observedCanvasParent - The observed ResizeObserverEntry.
   * @description Handles the parent element's resize event and updates the canvas size accordingly.
   * @param {number} observedCanvasParent.contentRect.width - The new width of the parent element.
   * @param {number} observedCanvasParent.contentRect.height - The new height of the parent element.
   */
  private onParentResize = ([observedCanvasParent]: ResizeObserverEntry[]) => {
    const { width, height } = observedCanvasParent.contentRect;
    this.pathPlanner.canvas.width = width;
    this.pathPlanner.canvas.height = height;
    this.pathPlanner.render();
  };

  /**
   * @public
   * @description Disconnects the ResizeObserver, stopping the canvas size monitoring.
   */
  public destroy() {
    if (!this.resizeObserver) {
      return;
    }
    this.resizeObserver.disconnect();
  }
}

export default ResizeManager;
