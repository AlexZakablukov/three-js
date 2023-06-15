import { DrawingTools, IParams } from "../types/helpers";
import { parseJson } from "./parseJson";

export const getPreparedParams = (
  paramsString: string | null
): IParams | null => {
  if (paramsString === null) {
    return null;
  }
  const parsedData: Record<keyof IParams, string> | null = parseJson(
    paramsString,
    null
  );

  if (parsedData === null) {
    return null;
  }

  return {
    width: Number(parsedData.width),
    height: Number(parsedData.height),
    drawingTool: parsedData.drawingTool as DrawingTools,
    hideStand: parsedData.hideStand === "true",
    shapeColor: parseJson(parsedData.shapeColor, null),
    strokeColor: parseJson(parsedData.strokeColor, null),
    strokeWidth: Number(parsedData.strokeWidth),
  };
};
