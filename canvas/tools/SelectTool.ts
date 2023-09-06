import { ITool, Tools } from "@/canvas/types/tools";
import { IPathPlanner } from "@/canvas/types/models";
import { getCoords } from "@/canvas/helpers";
import { Entities, IEntity, IPoint } from "@/canvas/types/entities";

interface ISelectToolProps {
  pathPlanner: IPathPlanner;
}

class SelectTool implements ITool {
  public type: Tools = Tools.Select;

  private prevHoveredEntity: IEntity | null = null;
  private pathPlanner: IPathPlanner;
  private isPointerDown: boolean;

  constructor({ pathPlanner }: ISelectToolProps) {
    this.pathPlanner = pathPlanner;
  }

  public onPointerDown = (event: PointerEvent) => {
    this.isPointerDown = true;
    console.log("SelectTool onPointerDown", event);
  };

  public onPointerUp = (event: PointerEvent) => {
    this.isPointerDown = false;
    console.log("SelectTool onPointerUp", event);
  };

  public onPointerMove = (event: PointerEvent) => {
    const coords = getCoords(event);
    const entity = this.pathPlanner.storageManager.getEntityByCoords(coords);
    if (!entity) {
      if (this.prevHoveredEntity) {
        this.prevHoveredEntity.isHovered = false;
        this.prevHoveredEntity = null;
        this.pathPlanner.render();
      }
      return;
    }
    if (this.prevHoveredEntity !== entity) {
      this.prevHoveredEntity = entity;
      entity.isHovered = true;
      this.pathPlanner.render();
    }
  };
}

export default SelectTool;
