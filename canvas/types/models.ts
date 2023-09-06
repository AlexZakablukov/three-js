import { ITool, Tools } from "@/canvas/types/tools";
import { IEntity } from "@/canvas/types/entities";
import { ICoords } from "@/canvas/types/helpers";

export interface IPathPlanner {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  tool: ITool | null;
  storageManager: IStorageManager;
  eventManager: IEventManager;

  setTool: (tool: Tools) => void;
  render: () => void;
  clear: () => void;
  destroy: () => void;
}

export interface IResizeManager {
  destroy: () => void;
}

export interface IEventManager {
  hoveredEntity: IEntity | null;

  destroy: () => void;
}

export interface IStorageManager {
  entities: Map<string, IEntity>;
  getEntities: () => IEntity[];
  getEntityById: (id: string) => IEntity | null;
  getEntityByCoords: (coords: ICoords) => IEntity | null;
  setEntities: (entities: IEntity[]) => void;
  addEntity: (entity: IEntity) => void;
  removeEntity: (id: string) => boolean;
}
