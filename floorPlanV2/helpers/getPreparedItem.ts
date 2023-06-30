import { getPreparedCoords } from './getPreparedCoords';
import { getPreparedParams } from './getPreparedParams';
import { IFloorPlanItemToBePrepared, IFloorPlanItem } from '../types/floorPlanItem';

/**
 * Converts a floor plan item to a prepared floor plan item by processing its coordinates, parameters, and data.
 *
 * @param {IFloorPlanItemToBePrepared} item - The floor plan item to be prepared.
 * @returns {IFloorPlanItem} The prepared floor plan item with processed coordinates, parameters, and data.
 */
export const getPreparedItem = (item: IFloorPlanItemToBePrepared): IFloorPlanItem => ({
    coords: getPreparedCoords(item.coords),
    params: getPreparedParams(item.params),
    data: {
        id: item.id,
        title: item.name,
    },
});
