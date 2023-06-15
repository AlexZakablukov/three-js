import { IFloorPlanItem } from "../types/prepared";

export interface IFloorPlanOptions {
  containerId: string;
  backgroundImage: string;
  items: IFloorPlanItem[];
}

export interface IContainerSizes {
  width: number;
  height: number;
  ratio: number;
  offsetLeft: number;
  offsetTop: number;
}
