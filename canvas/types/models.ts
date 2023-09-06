import { ITool, Tools } from "@/canvas/types/tools";
import { IEntity } from "@/canvas/types/entities";
import { ICoords } from "@/canvas/types/helpers";

export interface IPathPlanner {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  tool: ITool | null;
  storageManager: IStorageManager;

  setTool: (tool: Tools) => void;
  render: () => void;
  destroy: () => void;
}

export interface IResizeManager {
  destroy: () => void;
}

export interface IEventManager {
  destroy: () => void;
}

export interface IStorageManager {
  entities: IEntity[];
  getEntities: () => IEntity[];
  getEntityByCoords: (coords: ICoords) => IEntity | null;
  setEntities: (entities: IEntity[]) => void;
  addEntity: (entity: IEntity) => void;
}
