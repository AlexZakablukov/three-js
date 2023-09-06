import { IEntity } from "@/canvas/types/entities";
import { IPathPlanner, IStorageManager } from "@/canvas/types/models";
import { ICoords } from "@/canvas/types/helpers";

interface IStorageManagerProps {
  pathPlanner: IPathPlanner;
  entities?: IEntity[];
}

class StorageManager implements IStorageManager {
  private pathPlanner: IPathPlanner;
  private entities: Map<string, IEntity>;

  constructor({ pathPlanner, entities }: IStorageManagerProps) {
    this.pathPlanner = pathPlanner;
    this.setEntities(entities);
  }

  public getEntities = (): IEntity[] => {
    return Array.from(this.entities.values());
  };

  public getEntityById(id: string): IEntity | null {
    const entity = this.entities.get(id);
    if (!entity) {
      return null;
    }
    return entity;
  }

  public getEntityByCoords({ x, y }: ICoords): IEntity | null {
    const entities = this.getEntities();
    const foundEntity = entities.find((entity) =>
      this.pathPlanner.ctx.isPointInPath(entity.path, x, y)
    );
    if (!foundEntity) {
      return null;
    }
    return foundEntity;
  }

  public setEntities = (entities?: IEntity[]) => {
    this.entities = Array.isArray(entities)
      ? new Map(entities.map((entity) => [entity.id, entity]))
      : new Map();
  };

  public addEntity = (entity: IEntity) => {
    this.entities.set(entity.id, entity);
  };

  public removeEntity = (id: string): boolean => {
    return this.entities.delete(id);
  };
}

export default StorageManager;
