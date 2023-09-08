import { ICoords } from "@/canvas/types/helpers";
import { ILine } from "@/canvas/types/entities";

interface IGetNearestCoordsToLine {
  source: ICoords;
  line: ILine;
}

/**
 * Calculates the coordinates of the nearest point on a line to a given source point.
 *
 * @param {Object} options - The options for the calculation.
 * @param {ICoords} options.source - The source point coordinates.
 * @param {ILine} options.line - The line for which to find the nearest point.
 * @returns {ICoords} - The coordinates of the nearest point on the line to the source point.
 */
const getNearestCoordsToLine = ({
  source,
  line,
}: IGetNearestCoordsToLine): ICoords => {
  // Calculate the vector P, which represents the vector from the starting point to the current mouse position
  const vectorPX = source.x - line.startPoint.x;
  const vectorPY = source.y - line.startPoint.y;

  // Calculate the vector V, which represents the direction of the line from the starting point to the ending point
  const vectorVX = line.endPoint.x - line.startPoint.x;
  const vectorVY = line.endPoint.y - line.startPoint.y;

  // Calculate the dot product of vectors P and V
  const dotProduct = vectorPX * vectorVX + vectorPY * vectorVY;

  // Calculate the square of the length of vector V
  const lengthVSquared = vectorVX ** 2 + vectorVY ** 2;

  // Calculate the parameter t
  // The parameter t indicates how close the current mouse position is to the nearest point on the line
  const t = dotProduct / lengthVSquared;

  const nearestX =
    line.startPoint.x + t * (line.endPoint.x - line.startPoint.x);
  const nearestY =
    line.startPoint.y + t * (line.endPoint.y - line.startPoint.y);

  // Return the coordinates of the nearest point
  return { x: nearestX, y: nearestY };
};

export default getNearestCoordsToLine;
