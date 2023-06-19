import { DrawingTools, IParams } from "../types/helpers";
import { parseJson } from "./parseJson";
import { getRgbaFromHex } from "./getRgbaFromHex";

export const getPreparedParams = (
  paramsString: string | null
): IParams | null => {
  if (paramsString === null) {
    return null;
  }
  const parsedData: Record<string, string> | null = parseJson(
    paramsString,
    null
  );

  if (parsedData === null) {
    return null;
  }

  const result: IParams = {};

  if (parsedData.width) {
    result.width = Number(parsedData.width);
  }

  if (parsedData.height) {
    result.height = Number(parsedData.height);
  }

  if (parsedData.drawingTool) {
    result.drawingTool = parsedData.drawingTool as DrawingTools;
  }

  if (parsedData.hideStand) {
    result.hideStand = parsedData.hideStand === "true";
  }

  if (parsedData.shapeColor) {
    result.bgColor = parseJson(parsedData.shapeColor, null);
  }

  if (parsedData.fillColor) {
    result.bgColor = getRgbaFromHex(parsedData.fillColor);
  }

  if (parsedData.strokeColor) {
    const strokeColor = parseJson(parsedData.strokeColor, null);
    if (strokeColor) {
      result.strokeColor = strokeColor;
    } else {
      result.strokeColor = getRgbaFromHex(parsedData.strokeColor);
    }
  }

  if (parsedData.strokeWidth) {
    result.strokeWidth = Number(parsedData.strokeWidth);
  }

  return result;
};
