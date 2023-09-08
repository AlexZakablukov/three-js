import { IEventManager, IPathPlanner } from "@/canvas/types/models";
import { IPoint, ILine } from "@/canvas/types/entities";
import { getCoords } from "@/canvas/helpers";

interface IEventManagerProps {
  pathPlanner: IPathPlanner;
}

class EventManager implements IEventManager {
  public hoveredPoint: IPoint | null = null;
  public hoveredLine: ILine | null = null;
  public isCheckHoveredPoint: boolean = false;
  public isCheckHoveredLine: boolean = false;

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

    if (activeTool && activeTool.onPointerDown) {
      activeTool.onPointerDown(event);
    }
  };

  private onPointerUp = (event: PointerEvent) => {
    const activeTool = this.pathPlanner.tool;

    if (activeTool && activeTool.onPointerUp) {
      activeTool.onPointerUp(event);
    }
  };

  private onPointerMove = (event: PointerEvent) => {
    if (this.isCheckHoveredPoint) {
      this.checkHoveredPoint(event);
    }

    if (this.isCheckHoveredLine) {
      this.checkHoveredLine(event);
    }

    const activeTool = this.pathPlanner.tool;

    if (activeTool && activeTool.onPointerMove) {
      activeTool.onPointerMove(event);
    }
  };

  private checkHoveredPoint(event: PointerEvent) {
    const { x, y } = getCoords(event);
    const points = this.pathPlanner.storageManager.points;
    const hoveredPoint = points.find((point) => {
      if (point.path) {
        return this.pathPlanner.ctx.isPointInPath(point.path, x, y);
      }
    });

    // навелись на ту же самую точку, ничего не делаем
    if (
      hoveredPoint &&
      this.hoveredPoint &&
      hoveredPoint.id === this.hoveredPoint.id
    ) {
      return;
    }

    // никуда не навелись но точка есть, сбрасываем ховер
    if (!hoveredPoint && this.hoveredPoint) {
      this.hoveredPoint.isHovered = false;
      this.hoveredPoint = null;
      this.pathPlanner.render();
    }

    // навелись на другую точку, сбрасывем ховер для текущей и устанавливаем для новой
    if (
      hoveredPoint &&
      this.hoveredPoint &&
      hoveredPoint.id !== this.hoveredPoint.id
    ) {
      this.hoveredPoint.isHovered = false;
      hoveredPoint.isHovered = true;
      this.hoveredPoint = hoveredPoint;
      this.pathPlanner.render();
      return;
    }

    // навелись на точку, устанавливаем ховер
    if (hoveredPoint && !this.hoveredPoint) {
      hoveredPoint.isHovered = true;
      this.hoveredPoint = hoveredPoint;
      this.pathPlanner.render();
      return;
    }
  }

  private checkHoveredLine(event: PointerEvent) {
    const { x, y } = getCoords(event);
    const lines = this.pathPlanner.storageManager.lines;
    const hoveredLine = lines.find((line) => {
      if (line.path) {
        return this.pathPlanner.ctx.isPointInStroke(line.path, x, y);
      }
    });

    // навелись на ту же самую линию, ничего не делаем
    if (
      hoveredLine &&
      this.hoveredLine &&
      hoveredLine.id === this.hoveredLine.id
    ) {
      return;
    }

    // никуда не навелись но линия есть, сбрасываем ховер
    if (!hoveredLine && this.hoveredLine) {
      this.hoveredLine.isHovered = false;
      this.hoveredLine = null;
      this.pathPlanner.render();
    }

    // навелись на другую линию, сбрасывем ховер для текущей и устанавливаем для новой
    if (
      hoveredLine &&
      this.hoveredLine &&
      hoveredLine.id !== this.hoveredLine.id
    ) {
      this.hoveredLine.isHovered = false;
      hoveredLine.isHovered = true;
      this.hoveredLine = hoveredLine;
      this.pathPlanner.render();
      return;
    }

    // навелись на линию, устанавливаем ховер
    if (hoveredLine && !this.hoveredLine) {
      hoveredLine.isHovered = true;
      this.hoveredLine = hoveredLine;
      this.pathPlanner.render();
      return;
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
