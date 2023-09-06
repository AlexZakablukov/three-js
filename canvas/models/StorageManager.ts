import { IEntity } from "@/canvas/types/entities";
import { IPathPlanner, IStorageManager } from "@/canvas/types/models";
import { ICoords } from "@/canvas/types/helpers";

interface IStorageManagerProps {
  pathPlanner: IPathPlanner;
  entities?: IEntity[];
}

class StorageManager implements IStorageManager {
  private pathPlanner: IPathPlanner;
  private entities: IEntity[];

  constructor({ pathPlanner, entities }: IStorageManagerProps) {
    this.pathPlanner = pathPlanner;
    this.setEntities(entities);
  }

  public getEntities = (): IEntity[] => {
    return this.entities;
  };

  public getEntityByCoords({ x, y }: ICoords): IEntity | null {
    const foundEntity = this.entities.find((entity) =>
      this.pathPlanner.ctx.isPointInPath(entity.path, x, y)
    );
    if (!foundEntity) {
      return null;
    }
    return foundEntity;
  }

  public setEntities = (entities?: IEntity[]) => {
    this.entities = Array.isArray(entities) ? [...entities] : [];
  };

  public addEntity = (entity: IEntity) => {
    this.entities.push(entity);
  };
}

export default StorageManager;
