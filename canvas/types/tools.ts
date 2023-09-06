export enum Tools {
  Point = "Point",
  Select = "Select",
  Line = "Line",
}

export interface ITool {
  type: Tools;

  onPointerDown: (event: PointerEvent) => void;
  onPointerUp: (event: PointerEvent) => void;
  onPointerMove: (event: PointerEvent) => void;
}

export interface ILineTool extends ITool {
  draw: (x: number, y: number) => void;
}

export interface IPointTool extends ITool {
  draw: (x: number, y: number, radius: number) => void;
}
