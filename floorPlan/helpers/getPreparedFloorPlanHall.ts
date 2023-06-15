import { getPreparedCoords } from "./getPreparedCoords";
import { getPreparedParams } from "./getPreparedParams";
import { IHallApi } from "../types/api";
import { IFloorPlanItem } from "../types/prepared";

export const getPreparedFloorPlanHall = (item: IHallApi): IFloorPlanItem => {
  return {
    coords: getPreparedCoords(item.coords),
    params: getPreparedParams(item.params),
    data: {
      id: item.id,
      title: item.name,
    },
  };
};
