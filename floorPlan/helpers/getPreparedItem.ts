import { getPreparedCoords } from "./getPreparedCoords";
import { getPreparedParams } from "./getPreparedParams";
import { IFloorPlanItem } from "../types/prepared";
import { IItemToBePrepared } from "@/floorPlan/types/helpers";

export const getPreparedItem = (item: IItemToBePrepared): IFloorPlanItem => {
  return {
    coords: getPreparedCoords(item.coords),
    params: getPreparedParams(item.params),
    data: {
      id: item.id,
      title: item.name,
    },
  };
};
