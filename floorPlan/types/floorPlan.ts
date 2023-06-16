import { IFloorPlanItem } from "../types/prepared";
import { Texture } from "three";

export interface IFloorPlanOptions {
  containerId: string;
  bgTexture: Texture;
  items: IFloorPlanItem[];
}

export interface IContainerSizes {
  width: number;
  height: number;
  ratio: number;
  offsetLeft: number;
  offsetTop: number;
}
