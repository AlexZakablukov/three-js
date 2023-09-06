import { IPathPlanner, IResizeManager } from "@/canvas/types/models";

interface ICanvasSizeObserverProps {
  pathPlanner: IPathPlanner;
}

class ResizeManager implements IResizeManager {
  private pathPlanner: IPathPlanner;
  private resizeObserver: ResizeObserver;

  constructor({ pathPlanner }: ICanvasSizeObserverProps) {
    this.pathPlanner = pathPlanner;
    this.init();
  }

  private init() {
    this.resizeObserver = new ResizeObserver(this.onParentResize);
    this.resizeObserver.observe(this.pathPlanner.canvas.parentElement);
  }

  private onParentResize = ([observedCanvasParent]: ResizeObserverEntry[]) => {
    const { width, height } = observedCanvasParent.contentRect;
    this.pathPlanner.canvas.width = width;
    this.pathPlanner.canvas.height = height;
    this.pathPlanner.render();
  };

  public destroy() {
    if (!this.resizeObserver) {
      return;
    }
    this.resizeObserver.disconnect();
  }
}

export default ResizeManager;
