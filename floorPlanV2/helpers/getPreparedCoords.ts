import { TCoords } from "../types/helpers";
import { jsonParser } from "./extra";

/**
 * Parses the provided coordinates string and returns the prepared coordinates.
 *
 * @param {string | null} coordsString - The string representation of the coordinates.
 * @returns {TCoords[] | null} - The prepared coordinates as an array of TCoords, or null if input is invalid.
 */
export const getPreparedCoords = (
  coordsString: string | null
): TCoords[] | null => {
  if (coordsString === null) {
    return null;
  }
  const parsedData: [string, string][] | null = jsonParser(coordsString, null);

  if (parsedData === null || !Array.isArray(parsedData)) {
    return null;
  }
  return parsedData.map(([x, y]) => [parseFloat(x), parseFloat(y)]);
};
