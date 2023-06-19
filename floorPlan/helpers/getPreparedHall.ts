import { IHallDataApi } from "@/floorPlan/types/api";
import { IFloorPlanData } from "../types/prepared";
import { getPreparedItem } from "@/floorPlan/helpers/getPreparedItem";

export const getPreparedHall = (data: IHallDataApi): IFloorPlanData => {
  return {
    id: data.hall.id,
    backgroundImage: data.hall.planURL,
    items: data.hall.sectors.map(getPreparedItem),
  };
};
