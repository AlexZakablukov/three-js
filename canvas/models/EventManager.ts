import { IEventManager, IPathPlanner } from "@/canvas/types/models";

interface IEventManagerProps {
  pathPlanner: IPathPlanner;
}

class EventManager implements IEventManager {
  private pathPlanner: IPathPlanner;

  constructor({ pathPlanner }: IEventManagerProps) {
    this.pathPlanner = pathPlanner;
    this.addEventListeners();
  }

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

  private onPointerDown = (event: PointerEvent) => {
    const activeTool = this.pathPlanner.tool;

    if (activeTool) {
      activeTool.onPointerDown(event);
    }
  };

  private onPointerUp = (event: PointerEvent) => {
    const activeTool = this.pathPlanner.tool;

    if (activeTool) {
      activeTool.onPointerUp(event);
    }
  };

  private onPointerMove = (event: PointerEvent) => {
    const activeTool = this.pathPlanner.tool;

    if (activeTool) {
      activeTool.onPointerMove(event);
    }
  };

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
