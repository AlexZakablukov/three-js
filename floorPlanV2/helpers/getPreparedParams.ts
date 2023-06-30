import { DrawingTools, IParams } from "../types/helpers";
import { jsonParser } from "./extra";
import { getRgbaFromHex } from "./getRgbaFromHex";

/**
 * Parses the provided parameters string and returns the prepared parameters.
 *
 * @param {string | null} paramsString - The string representation of the parameters.
 * @returns {IParams | null} The prepared parameters as an object of type IParams, or null if the input is invalid.
 */
export const getPreparedParams = (
  paramsString: string | null
): IParams | null => {
  if (paramsString === null) {
    return null;
  }
  const parsedData: Record<string, string> | null = jsonParser(
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
    result.bgColor = jsonParser(parsedData.shapeColor, null);
  }

  if (parsedData.fillColor) {
    result.bgColor = getRgbaFromHex(parsedData.fillColor);
  }

  if (parsedData.strokeColor) {
    const strokeColor = jsonParser(parsedData.strokeColor, null);
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
