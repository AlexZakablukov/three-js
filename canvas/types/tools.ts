export enum Tools {
  Point = "Point",
  Line = "Line",
  Move = "Move",
  Remove = "Remove",
}

export interface ITool {
  type: Tools;

  onPointerDown?: (event: PointerEvent) => void;
  onPointerUp?: (event: PointerEvent) => void;
  onPointerMove?: (event: PointerEvent) => void;
}

export interface ILineTool extends ITool {
  draw: () => void;
}

export interface IPointTool extends ITool {
  draw: (x: number, y: number, radius: number) => void;
}
