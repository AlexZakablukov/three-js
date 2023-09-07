import { IConnection } from "@/canvas/types/entities";

interface IConnectionProps {
  id: string;
  pointIds: [string, string];
}

class Connection implements IConnection {
  public id: string;
  public pointIds: [string, string];

  constructor({ id, pointIds }: IConnectionProps) {
    this.id = id;
    this.pointIds = pointIds;
  }

  public hasPoint(id: string): boolean {
    return this.pointIds.includes(id);
  }
}

export default Connection;
