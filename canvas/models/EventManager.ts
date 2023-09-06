import { IEventManager, IPathPlanner } from "@/canvas/types/models";
import { IEntity } from "@/canvas/types/entities";
import { getCoords } from "@/canvas/helpers";

interface IEventManagerProps {
  pathPlanner: IPathPlanner;
}

class EventManager implements IEventManager {
  public hoveredEntity: IEntity | null = null;

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
    this.checkHover(event);

    const activeTool = this.pathPlanner.tool;

    if (activeTool) {
      activeTool.onPointerMove(event);
    }
  };

  private checkHover(event: PointerEvent) {
    const coords = getCoords(event);
    const entity = this.pathPlanner.storageManager.getEntityByCoords(coords);
    if (!entity) {
      if (this.hoveredEntity) {
        this.hoveredEntity.isHovered = false;
        this.hoveredEntity = null;
        this.pathPlanner.render();
      }
      return;
    }
    if (!this.hoveredEntity || this.hoveredEntity !== entity) {
      this.hoveredEntity = entity;
      this.hoveredEntity.isHovered = true;
      this.pathPlanner.render();
    }
  }

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
