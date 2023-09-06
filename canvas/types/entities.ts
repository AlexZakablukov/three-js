export enum Entities {
  Point = "Point",
  Line = "Line",
}

export interface IEntity {
  // id: string;
  type: Entities;
  isHovered: boolean;
  path: Path2D;
  render: (ctx: CanvasRenderingContext2D) => void;
}

export interface IPoint extends IEntity {
  x: number;
  y: number;
  radius: number;
}

export interface ILine extends IEntity {
  startPoint: IPoint;
  endPoint: IPoint;
  lineWidth: number;
}
