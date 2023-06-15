import { TCoords } from "../types/helpers";
import { parseJson } from "./parseJson";

export const getPreparedCoords = (
  coordsString: string | null
): TCoords[] | null => {
  if (coordsString === null) {
    return null;
  }
  const parsedData: [string, string][] | null = parseJson(coordsString, null);

  if (parsedData === null) {
    return null;
  }
  return parsedData.map((item) => item.map(parseFloat));
};
