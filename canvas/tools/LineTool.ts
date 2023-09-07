import { ILineTool, Tools } from "@/canvas/types/tools";
import { IPathPlanner } from "@/canvas/types/models";
import { getCoords } from "@/canvas/helpers";
import { Entities, ILine, IPoint } from "@/canvas/types/entities";
import Line from "@/canvas/entities/Line";
import Point from "@/canvas/entities/Point";

interface ILineToolProps {
  pathPlanner: IPathPlanner;
}

class LineTool implements ILineTool {
  public type: Tools = Tools.Line;

  private pathPlanner: IPathPlanner;

  private isPointerDown: boolean = false;

  private line: ILine | null;
  private isTempStartPoint: boolean = false;
  private isTempEndPoint: boolean = false;
  private startPoint: IPoint | null = null;
  private endPoint: IPoint | null = null;

  constructor({ pathPlanner }: ILineToolProps) {
    this.pathPlanner = pathPlanner;
  }

  public onPointerDown = (event: PointerEvent) => {
    // this.isPointerDown = true;
    // const { x, y } = getCoords(event);
    // const hoveredEntity = this.pathPlanner.eventManager.hoveredEntity;
    // if (!hoveredEntity || hoveredEntity.type !== Entities.Point) {
    //   this.isTempStartPoint = true;
    //   this.startPoint = new Point({ x, y, radius: 10 });
    //   this.pathPlanner.storageManager.addEntity(this.startPoint);
    // } else {
    //   this.isTempStartPoint = false;
    //   this.startPoint = hoveredEntity as IPoint;
    // }
  };

  public onPointerUp = (event: PointerEvent) => {
    // this.isPointerDown = false;
    // const hoveredEntity = this.pathPlanner.eventManager.hoveredEntity;
    //
    // if (hoveredEntity && hoveredEntity.id === this.startPoint?.id) {
    //   this.isTempStartPoint &&
    //     this.startPoint &&
    //     this.pathPlanner.storageManager.removeEntity(this.startPoint.id);
    //
    //   this.line && this.pathPlanner.storageManager.removeEntity(this.line.id);
    //
    //   this.endPoint &&
    //     this.pathPlanner.storageManager.removeEntity(this.endPoint.id);
    // } else if (this.isTempEndPoint && this.endPoint) {
    //   this.pathPlanner.storageManager.addEntity(this.endPoint);
    //   this.endPoint.render(this.pathPlanner.ctx);
    // }
    //
    // this.isTempStartPoint = false;
    // this.startPoint = null;
    // this.isTempEndPoint = false;
    // this.endPoint = null;
    // this.line = null;
    // console.log({
    //   start: this.startPoint,
    //   end: this.endPoint,
    // });
  };

  public onPointerMove = (event: PointerEvent) => {
    // if (this.isPointerDown && this.startPoint) {
    //   const { x, y } = getCoords(event);
    //   const hoveredEntity = this.pathPlanner.eventManager.hoveredEntity;
    //
    //   if (this.isTempEndPoint && this.endPoint) {
    //     this.endPoint.x = x;
    //     this.endPoint.y = y;
    //   } else {
    //     this.isTempEndPoint = true;
    //     this.endPoint = new Point({ x, y, radius: 10 });
    //   }
    //
    //   if (
    //     hoveredEntity &&
    //     hoveredEntity.type === Entities.Point &&
    //     hoveredEntity.id !== this.startPoint.id
    //   ) {
    //     this.isTempEndPoint = false;
    //     this.endPoint = hoveredEntity as IPoint;
    //   }
    //   this.draw();
    // }
  };

  private draw() {
    // console.log({
    //   start: this.startPoint,
    //   end: this.endPoint,
    //   storage: this.pathPlanner.storageManager.getEntities(),
    // });
    // if (!this.startPoint || !this.endPoint) {
    //   return;
    // }
    // this.pathPlanner.ctx.beginPath();
    // this.pathPlanner.ctx.moveTo(this.startPoint.x, this.startPoint.y);
    // if (this.line) {
    //   this.line.endPoint = this.endPoint;
    // } else {
    //   this.line = new Line({
    //     startPoint: this.startPoint,
    //     endPoint: this.endPoint,
    //     lineWidth: 5,
    //   });
    //   this.pathPlanner.storageManager.addEntity(this.line);
    // }
    // this.pathPlanner.render();
  }
}

export default LineTool;
