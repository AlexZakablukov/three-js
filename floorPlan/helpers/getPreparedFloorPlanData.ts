import { IDataApi } from "../types/api";
import { getPreparedFloorPlanHall } from "./getPreparedFloorPlanHall";
import { IFloorPlanData } from "../types/prepared";

export const getPreparedFloorPlanData = (data: IDataApi): IFloorPlanData => {
  return {
    id: data.place.id,
    backgroundImage: data.place.floorPlan,
    items: data.place.halls.map(getPreparedFloorPlanHall),
  };
};
