import { IFloorPlanItem, IFloorPlanItemData } from "../types/prepared";
import { Texture } from "three";
import { Font } from "three/examples/jsm/loaders/FontLoader";

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
  font: Font;
  onTextSync?: () => void;
}

export interface IFloorPlanOptions {
  containerId: string;
  bgColor?: string;
  bgTexture: Texture;
  font: Font;
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
