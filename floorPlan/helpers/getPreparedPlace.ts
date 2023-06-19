import { IPlaceDataApi } from "../types/api";
import { getPreparedItem } from "./getPreparedItem";
import { IFloorPlanData } from "../types/prepared";

export const getPreparedPlace = (data: IPlaceDataApi): IFloorPlanData => {
  return {
    id: data.place.id,
    backgroundImage: data.place.floorPlan,
    items: data.place.halls.map(getPreparedItem),
  };
};
