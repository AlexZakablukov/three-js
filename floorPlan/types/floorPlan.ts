import { IFloorPlanItem } from "../types/prepared";
import { Texture } from "three";
import { Font } from "three/examples/jsm/loaders/FontLoader";

export enum FloorPlanObjectType {
  Hall = "hall",
}

export interface IFloorPlanOptions {
  containerId: string;
  bgTexture: Texture;
  font: Font;
  items: IFloorPlanItem[];
}

export interface IContainerSizes {
  width: number;
  height: number;
  ratio: number;
  offsetLeft: number;
  offsetTop: number;
}

export interface ITextOptions {
  font: Font;
  onSync: () => void;
}
