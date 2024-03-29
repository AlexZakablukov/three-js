import { IFloorPlanItem, IFloorPlanItemData } from "../types/prepared";
import { Texture } from "three";

export enum FloorPlanObjectType {
  Hall = "hall",
}

export interface IFloorPlanItemEvents {
  onItemClick?: (data: IFloorPlanItemData) => void;
  onItemEnter?: (data: IFloorPlanItemData) => void;
  onItemLeave?: (data: IFloorPlanItemData) => void;
}

export interface IFloorPlanEvents {
  item?: IFloorPlanItemEvents;
}

export interface IFloorPlanItemOptions {
  events?: IFloorPlanItemEvents;
}

export interface IFloorPlanOptions {
  canvasContainerId: string;
  labelContainerId: string;
  bgColor?: string;
  bgTexture: Texture;
  items: IFloorPlanItem[];
  events?: IFloorPlanEvents;
}

export interface IContainerSizes {
  width: number;
  height: number;
  ratio: number;
  offsetLeft: number;
  offsetTop: number;
}
