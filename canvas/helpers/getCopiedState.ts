import Point from "@/canvas/entities/Point";
import Connection from "@/canvas/entities/Connection";
import { IStorageState } from "@/canvas/types/models";

/**
 * Creates a deep copy of an IStorageHistory object by creating new Point and Connection instances.
 *
 * @param {IStorageState} original - The original IStorageState object to copy.
 * @returns {IStorageState} A deep copy of the original IStorageState object.
 */
function getCopiedState(original: IStorageState): IStorageState {
  const copiedHistory = {
    points: new Map(),
    connections: new Map(),
  };

  // Copy the 'points' map by creating new points
  original.points.forEach(({ id, x, y }) =>
    copiedHistory.points.set(
      id,
      new Point({
        id,
        x,
        y,
      })
    )
  );

  // Copy the 'connections' map by creating new connections
  original.connections.forEach(({ id, pointIds }) =>
    copiedHistory.connections.set(
      id,
      new Connection({
        id,
        pointIds: [...pointIds],
      })
    )
  );

  return copiedHistory;
}

export default getCopiedState;
