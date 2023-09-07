import { IConnection, ILine, IPoint } from "@/canvas/types/entities";
import {
  IPathPlanner,
  IStorageManager,
  IStorageState,
} from "@/canvas/types/models";
import Line from "@/canvas/entities/Line";
import { getCopiedState } from "@/canvas/helpers";

const HISTORY_SIZE = 10;

interface IStorageManagerProps {
  pathPlanner: IPathPlanner;
  points?: IPoint[];
  connections?: IConnection[];
}

class StorageManager implements IStorageManager {
  private pathPlanner: IPathPlanner;
  private history: IStorageState[] = [
    {
      points: new Map<string, IPoint>(),
      connections: new Map<string, IConnection>(),
    },
  ];
  private historyIndex: number = 0;
  private _lines: Map<string, ILine> = new Map();

  constructor({ pathPlanner, points, connections }: IStorageManagerProps) {
    this.pathPlanner = pathPlanner;
    if (Array.isArray(points)) {
      this.state.points = new Map(points.map((point) => [point.id, point]));
    }
    if (Array.isArray(connections)) {
      this.state.connections = new Map(
        connections.map((connection) => [connection.id, connection])
      );
    }
    this.generateLines();
  }

  get state(): IStorageState {
    return this.history[this.historyIndex];
  }

  get points(): IPoint[] {
    return Array.from(this.state.points.values());
  }

  get connections(): IConnection[] {
    return Array.from(this.state.connections.values());
  }

  get lines(): ILine[] {
    return Array.from(this._lines.values());
  }

  private generateLines = () => {
    this._lines.clear();
    this.state.connections.forEach((connection) => {
      const startPoint = this.getPointById(connection.pointIds[0]);
      const endPoint = this.getPointById(connection.pointIds[1]);
      if (startPoint && endPoint) {
        this._lines.set(
          connection.id,
          new Line({
            id: connection.id,
            startPoint,
            endPoint,
          })
        );
      }
    });
  };

  public getPointById = (id: string): IPoint | null => {
    const point = this.state.points.get(id);
    if (!point) {
      return null;
    }
    return point;
  };

  public addPoint = (point: IPoint) => {
    this.saveToHistory();
    this.state.points.set(point.id, point);
    this.generateLines();
  };

  public removePoint = (id: string) => {
    this.saveToHistory();
    this.state.points.delete(id);
    const connections = this.getConnectionsByPointId(id);
    connections.forEach((connection) => {
      this.removeConnection(connection.id);
    });
    this.generateLines();
  };

  public getConnectionById = (id: string): IConnection | null => {
    const connection = this.state.connections.get(id);
    if (!connection) {
      return null;
    }
    return connection;
  };

  public getConnectionsByPointId = (pointId: string): IConnection[] => {
    return this.connections.filter((connection) =>
      connection.hasPoint(pointId)
    );
  };

  public addConnection = (connection: IConnection) => {
    this.state.connections.set(connection.id, connection);
    this.generateLines();
  };

  public removeConnection = (id: string) => {
    this.state.connections.delete(id);
    this.generateLines();
  };

  private saveToHistory = () => {
    const copiedState = getCopiedState(this.state);
    if (this.historyIndex < this.history.length - 1) {
      this.history.splice(this.historyIndex + 1);
    }

    this.history.splice(this.historyIndex, 0, copiedState);
    this.historyIndex++;

    // Check if the history size exceeds 10 and remove the oldest entry if necessary
    if (this.history.length > HISTORY_SIZE) {
      this.history.shift(); // Remove the oldest entry (first element)
      this.historyIndex--;
    }
  };

  /**
   * @description
   * TODO: think which solution is better, push better by performance,
   * but using splice we stay on the original state (not copied)
   */
  /*private saveToHistory = () => {
    const copiedState = getCopiedState(this.state);
    if (this.historyIndex < this.history.length - 1) {
      this.history.splice(this.historyIndex + 1);
    }

    this.history.push(copiedState);
    this.historyIndex++;

    if (this.history.length > HISTORY_SIZE) {
      const excess = this.history.length - HISTORY_SIZE;
      this.history.splice(0, excess); // Remove the oldest entries
      this.historyIndex -= excess;
    }
  };*/

  public undo = () => {
    if (this.historyIndex !== 0 && this.history.length > 1) {
      this.historyIndex--;
      this.generateLines();
    }
  };

  public redo = () => {
    if (this.historyIndex !== this.history.length - 1) {
      this.historyIndex++;
      this.generateLines();
    }
  };

  public clear = () => {
    this.saveToHistory();
    this.state.points = new Map();
    this.state.connections = new Map();
    this._lines = new Map();
  };
}

export default StorageManager;
