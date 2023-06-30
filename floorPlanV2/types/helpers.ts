export type TCoords = [number, number];

export enum DrawingTools {
    Polygon = 'polygon',
    Rectangle = 'rectangle',
}

export interface IColor {
    r: number;
    g: number;
    b: number;
    a: number;
}

export interface IColorStringAndOpacity {
    color: string;
    opacity: number;
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

export interface IHtmlElementSize {
    width: number;
    height: number;
    ratio: number;
    offsetLeft: number;
    offsetTop: number;
}

export interface IBounds {
    maxX: number;
    minX: number;
    maxY: number;
    minY: number;
    centerX: number;
    centerY: number;
    width: number;
    height: number;
    area: number;
}
