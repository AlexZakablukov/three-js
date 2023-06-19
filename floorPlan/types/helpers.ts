export type TCoords = [number, number];

export enum DrawingTools {
  Polygon = "polygon",
  Rectangle = "rectangle",
}

export interface IColor {
  r: number;
  g: number;
  b: number;
  a: number;
}

export interface IParams {
  width?: number;
  height?: number;
  drawingTool?: DrawingTools;
  hideStand?: boolean;
  bgColor?: IColor | null;
  strokeColor?: IColor | null;
  strokeWidth?: number;
}

export interface IItemToBePrepared {
  id: number;
  name: string;
  coords: string | null;
  params: string | null;
}
