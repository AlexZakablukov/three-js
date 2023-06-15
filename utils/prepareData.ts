import { IPlace } from "@/utils/data";

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
  width: number;
  height: number;
  drawingTool: DrawingTools;
  hideStand: boolean;
  shapeColor: IColor;
  strokeColor: IColor;
  strokeWidth: number;
}

export const getPreparedCoords = (
  coordsString: string | null
): TCoords[] | null => {
  if (coordsString === null) {
    return null;
  }
  const parsedData: [string, string][] = JSON.parse(coordsString);
  return parsedData.map((item) => item.map(parseFloat));
};

export const getPreparedParams = (
  paramsString: string | null
): IParams | null => {
  if (paramsString === null) {
    return null;
  }
  const parsedData: Record<keyof IParams, string> = JSON.parse(paramsString);

  return {
    width: Number(parsedData.width),
    height: Number(parsedData.height),
    drawingTool: parsedData.drawingTool as DrawingTools,
    hideStand: parsedData.hideStand === "true",
    shapeColor: JSON.parse(parsedData.shapeColor),
    strokeColor: JSON.parse(parsedData.strokeColor),
    strokeWidth: Number(parsedData.strokeWidth),
  };
};

export const getPreparedFloorPlanData = (place: IPlace) => {
  return {
    id: place.id,
    backgroundImage: place.floorPlan,
    items: place.halls.map((hall) => {
      return {
        coords: getPreparedCoords(hall.coords),
        params: getPreparedParams(hall.params),
        data: {
          id: hall.id,
          title: hall.name,
        },
      };
    }),
  };
};
