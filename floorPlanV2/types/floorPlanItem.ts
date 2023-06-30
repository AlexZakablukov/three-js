import { IParams, TCoords } from './helpers';

// the interface contains the necessary props for both stands and halls
export interface IFloorPlanItemToBePrepared {
    id: number;
    name: string;
    coords: string | null;
    params: string | null;
}

export interface IFloorPlanItemData {
    id: number;
    title: string;
}

export interface IFloorPlanItem {
    params: IParams | null;
    coords: TCoords[] | null;
    data: IFloorPlanItemData;
}
