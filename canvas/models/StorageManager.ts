import { v4 as uuid } from "uuid";
import { IConnection, ILine, IPoint } from "@/canvas/types/entities";
import {
  IPathPlanner,
  IStorageManager,
  IStorageState,
} from "@/canvas/types/models";
import Line from "@/canvas/entities/Line";
import { getCopiedState, getIntersectedPoint } from "@/canvas/helpers";
import Point from "@/canvas/entities/Point";
import Connection from "@/canvas/entities/Connection";

const HISTORY_SIZE = 20;

/**
 * @interface IStorageManagerProps
 * @description Properties for initializing the StorageManager class.
 * @property {IPathPlanner} pathPlanner - The path planner instance.
 * @property {IPoint[]} [points] - An array of initial points (optional).
 * @property {IConnection[]} [connections] - An array of initial connections (optional).
 */
interface IStorageManagerProps {
  pathPlanner: IPathPlanner;
  points?: IPoint[];
  connections?: IConnection[];
}

/**
 * @class
 * @implements {IStorageManager}
 * @description Manages the storage of points, connections, and lines.
 */
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

  /**
   * @constructor
   * @param {IStorageManagerProps} param - The properties for initializing the StorageManager.
   */
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

  /**
   * @property {IStorageState} state - The current storage state.
   */
  get state(): IStorageState {
    return this.history[this.historyIndex];
  }

  /**
   * @property {IPoint[]} points - An array of points in the current state.
   */
  get points(): IPoint[] {
    return Array.from(this.state.points.values());
  }

  /**
   * @property {IConnection[]} connections - An array of connections in the current state.
   */
  get connections(): IConnection[] {
    return Array.from(this.state.connections.values());
  }

  /**
   * @property {ILine[]} lines - An array of lines generated from connections.
   */
  get lines(): ILine[] {
    return Array.from(this._lines.values());
  }

  private checkIntersectedLines = () => {
    const connectionKeys = Array.from(this.state.connections.keys());
    for (let i = 0; i < connectionKeys.length; i++) {
      for (let j = i + 1; j < connectionKeys.length; j++) {
        const connection1 = this.state.connections.get(connectionKeys[i]);
        const connection2 = this.state.connections.get(connectionKeys[j]);

        const startPoint1 = this.getPointById(connection1.pointIds[0]);
        const endPoint1 = this.getPointById(connection1.pointIds[1]);

        const startPoint2 = this.getPointById(connection2.pointIds[0]);
        const endPoint2 = this.getPointById(connection2.pointIds[1]);

        if (!startPoint1 || !endPoint1 || !startPoint2 || !endPoint2) {
          return;
        }

        const intersectedCoords = getIntersectedPoint(
          startPoint1,
          endPoint1,
          startPoint2,
          endPoint2
        );

        if (!intersectedCoords) {
          return;
        }

        const { x, y } = intersectedCoords;

        const intersectedPoint = new Point({
          id: uuid(),
          x,
          y,
        });

        this.addConnection(
          new Connection({
            id: uuid(),
            pointIds: [connection1.pointIds[0], intersectedPoint.id],
          })
        );

        this.addConnection(
          new Connection({
            id: uuid(),
            pointIds: [intersectedPoint.id, connection1.pointIds[1]],
          })
        );

        this.addConnection(
          new Connection({
            id: uuid(),
            pointIds: [connection2.pointIds[0], intersectedPoint.id],
          })
        );

        this.addConnection(
          new Connection({
            id: uuid(),
            pointIds: [intersectedPoint.id, connection2.pointIds[1]],
          })
        );

        this.removeConnection(connection1.id);
        this.removeConnection(connection2.id);
      }
    }
  };

  /**
   * @private
   * @description Generates lines based on the connections in the current state.
   * It clears the existing lines and recreates them using the current connections.
   */
  private generateLines = () => {
    // Clear the existing lines map to start fresh.
    this._lines.clear();
    // Iterate through all connections in the current state.
    this.state.connections.forEach((connection) => {
      // Retrieve the start and end points of the connection.
      const startPoint = this.getPointById(connection.pointIds[0]);
      const endPoint = this.getPointById(connection.pointIds[1]);

      // Check if both start and end points exist (not null).
      if (startPoint && endPoint) {
        // Create a new Line instance and add it to the _lines map.
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

  /**
   * @public
   * @param {ILine} line - The line to add to the manager.
   * @description Adds a line to the manager.
   */
  public addLine = (line: ILine) => {
    this._lines.set(line.id, line);
  };

  /**
   * @public
   * @param {string} id - The ID of the line to remove.
   * @description Removes a line from the manager by ID.
   */
  public removeLine = (id: string) => {
    this._lines.delete(id);
  };

  /**
   * @public
   * @param {string} id - The ID of the point to retrieve.
   * @returns {IPoint | null} The point with the specified ID or null if not found.
   * @description Retrieves a point by its ID.
   */
  public getPointById = (id: string): IPoint | null => {
    const point = this.state.points.get(id);
    if (!point) {
      return null;
    }
    return point;
  };

  /**
   * @public
   * @param {IPoint} point - The point to add to the manager.
   * @description Adds a point to the manager.
   */
  public addPoint = (point: IPoint) => {
    this.state.points.set(point.id, point);
    this.generateLines();
  };

  /**
   * @public
   * @param {string} id - The ID of the point to remove.
   * @description Removes a point from the manager by ID.
   */
  public removePoint = (id: string) => {
    this.state.points.delete(id);
    const connections = this.getConnectionsByPointId(id);
    connections.forEach((connection) => {
      this.removeConnection(connection.id);
    });
    this.generateLines();
  };

  /**
   * @public
   * @param {string} id - The ID of the connection to retrieve.
   * @returns {IConnection | null} The connection with the specified ID or null if not found.
   * @description Retrieves a connection by its ID.
   */
  public getConnectionById = (id: string): IConnection | null => {
    const connection = this.state.connections.get(id);
    if (!connection) {
      return null;
    }
    return connection;
  };

  /**
   * @public
   * @param {string} pointId - The ID of the point to find connections for.
   * @returns {IConnection[]} An array of connections associated with the specified point.
   * @description Retrieves connections associated with a point by its ID.
   */
  public getConnectionsByPointId = (pointId: string): IConnection[] => {
    return this.connections.filter((connection) =>
      connection.hasPoint(pointId)
    );
  };

  /**
   * @public
   * @param {IConnection} connection - The connection to add to the manager.
   * @description Adds a connection to the manager.
   */
  public addConnection = (connection: IConnection) => {
    this.state.connections.set(connection.id, connection);
    this.generateLines();
  };

  /**
   * @public
   * @param {string} id - The ID of the connection to remove.
   * @description Removes a connection from the manager by ID.
   */
  public removeConnection = (id: string) => {
    this.state.connections.delete(id);
    this.generateLines();
  };

  /**
   * @private
   * @description Saves the current state to the history for undo/redo functionality.
   * It creates a copy of the current state, manages the history array, and ensures the
   * history size does not exceed the specified limit.
   * Calls before changes you want to be able to get back
   */
  private saveToHistory = () => {
    // Create a copy of the current state.
    const copiedState = getCopiedState(this.state);

    // If there are actions done, remove the "redo" history beyond the current index.
    if (this.historyIndex < this.history.length - 1) {
      this.history.splice(this.historyIndex + 1);
    }

    // Insert the copied state at the current history index, advancing the index.
    this.history.splice(this.historyIndex, 0, copiedState);
    this.historyIndex++;

    // Check if the history size exceeds 10 and remove the oldest entry if necessary
    if (this.history.length > HISTORY_SIZE) {
      this.history.shift(); // Remove the oldest entry (first element)
      this.historyIndex--; // Adjust the index to account for the removed entry.
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

  /**
   * @public
   * @description Undoes the previous action by moving back in history.
   */
  public undo = () => {
    if (this.historyIndex !== 0 && this.history.length > 1) {
      this.historyIndex--;
      this.generateLines();
    }
  };

  /**
   * @public
   * @description Redoes the previously undone action by moving forward in history.
   */
  public redo = () => {
    if (this.historyIndex !== this.history.length - 1) {
      this.historyIndex++;
      this.generateLines();
    }
  };

  /**
   * @public
   * @description Clears the current state.
   */
  public clear = () => {
    this.saveToHistory();
    this.state.points = new Map();
    this.state.connections = new Map();
    this._lines = new Map();
  };
}

export default StorageManager;
