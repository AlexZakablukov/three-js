import { ITool, Tools } from "@/canvas/types/tools";
import { IConnection, IPoint, ILine } from "@/canvas/types/entities";

export interface IPathPlanner {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  tool: ITool | null;
  storageManager: IStorageManager;
  eventManager: IEventManager;

  undo: () => void;
  redo: () => void;
  setTool: (tool: Tools) => void;
  render: () => void;
  clear: () => void;
  destroy: () => void;
}

export interface IResizeManager {
  destroy: () => void;
}

export interface IEventManager {
  hoveredPoint: IPoint | null;
  hoveredLines: ILine[];
  isCheckHoveredPoint: boolean;
  isCheckHoveredLines: boolean;

  destroy: () => void;
}

export interface IStorageState {
  points: Map<string, IPoint>;
  connections: Map<string, IConnection>;
}

export interface IStorageManager {
  history: IStorageState[];
  points: IPoint[];
  connections: IConnection[];
  lines: ILine[];

  undo(): void;
  redo(): void;
  generateLines(): void;
  saveToHistory(): void;
  generateLines(): void;
  getPointById(id: string): IPoint | null;
  addPoint(point: IPoint): void;
  removePoint(id: string): void;
  getConnectionById(id: string): IConnection | null;
  addConnection(connection: IConnection): void;
  removeConnection(id: string): void;
  addLine(line: ILine): void;
  removeLine(id: string): void;
  clear(): void;
}
