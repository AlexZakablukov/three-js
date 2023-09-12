import { IPoint } from "@/canvas/types/entities";
import { ICoords } from "@/canvas/types/helpers";

/**
 * Calculates the intersection point of two line segments defined by their start and end points.
 *
 * @param {IPoint} startPoint1 - The start point of the first line segment.
 * @param {IPoint} endPoint1 - The end point of the first line segment.
 * @param {IPoint} startPoint2 - The start point of the second line segment.
 * @param {IPoint} endPoint2 - The end point of the second line segment.
 *
 * @returns {(ICoords | false)} - Returns the coordinates of the intersection point as an object with `x` and `y` properties,
 *                               or `false` if there is no intersection or the lines are parallel.
 */
const getIntersectedPoint = (
  startPoint1: IPoint,
  endPoint1: IPoint,
  startPoint2: IPoint,
  endPoint2: IPoint
): ICoords | false => {
  // Extract the coordinates of the start and end points of both lines
  const { x: x1, y: y1 } = startPoint1;
  const { x: x2, y: y2 } = endPoint1;
  const { x: x3, y: y3 } = startPoint2;
  const { x: x4, y: y4 } = endPoint2;

  // Check if either of the lines has zero length
  if ((x1 === x2 && y1 === y2) || (x3 === x4 && y3 === y4)) {
    return false;
  }

  // Calculate the denominator for determining the intersection
  const denominator = (y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1);

  // Check if the lines are parallel (denominator is zero)
  if (denominator === 0) {
    return false;
  }

  // Calculate the parameters 'ua' and 'ub' to determine the intersection
  let ua = ((x4 - x3) * (y1 - y3) - (y4 - y3) * (x1 - x3)) / denominator;
  let ub = ((x2 - x1) * (y1 - y3) - (y2 - y1) * (x1 - x3)) / denominator;

  // Check if the intersection is within the line segments
  if (ua < 0 || ua > 1 || ub < 0 || ub > 1) {
    return false;
  }

  // Calculate the coordinates of the intersection point
  let x = x1 + ua * (x2 - x1);
  let y = y1 + ua * (y2 - y1);

  // Return an object with the x and y coordinates of the intersection
  return { x, y };
};

export default getIntersectedPoint;
