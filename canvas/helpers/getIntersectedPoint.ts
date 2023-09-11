import { ILine, IPoint } from "@/canvas/types/entities";
import { ICoords } from "@/canvas/types/helpers";

/**
 * Calculate the intersection point of two line segments.
 * line intercept math by Paul Bourke http://paulbourke.net/geometry/pointlineplane/
 *
 * @param {ILine} line1 - The first line segment defined by its start and end points.
 * @param {ILine} line2 - The second line segment defined by its start and end points.
 *
 * @returns {ICoords|false} - If the lines intersect, returns an object with the x and y coordinates of the intersection.
 *                            If the lines do not intersect, returns false.
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
