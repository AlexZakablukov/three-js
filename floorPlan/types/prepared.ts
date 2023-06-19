import { IParams, TCoords } from "./helpers";

export interface IFloorPlanItemData {
  id: number;
  title: string;
}

export interface IFloorPlanItem {
  params: IParams | null;
  coords: TCoords[] | null;
  data: IFloorPlanItemData;
}

export interface IFloorPlanData {
  id: number;
  backgroundImage: string | null;
  items: IFloorPlanItem[];
}
