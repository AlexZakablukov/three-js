import { ACTION } from 'camera-controls/dist/types';
import { IFloorPlanItem } from './floorPlanItem';

export interface IFloorPlanViewerSettings {
    /**
     * @description
     * string with hex color not allowed,
     * working example: 'black', 0x000000
     */
    backgroundColor: string | number;
    truckSpeed: number;
    dollyToCursor: boolean;
    dollySpeed: number;
    smoothTime: number;
    draggingSmoothTime: number;
    maxZoom: number;
    /**
     * @description
     * when areaPerZoom = 300 and current zoom = 1
     * label of object with area that less than 300 will be hidden
     * so to show small object`s label user should increase zoom value by wheel
     * or you can decrease areaPerZoom value
     * @example
     * areaPerZoom = 300, currentZoom = 1 - labels less than 300 will be hidden
     * areaPerZoom = 300, currentZoom = 3 - labels less than 100 will be hidden
     * areaPerZoom = 100, currentZoom = 0.5 - labels less than 200 will be hidden
     */
    areaPerZoom: number;
    onControlStart: (currentAction: ACTION) => void | null;
    onControlEnd: () => void | null;
}

export interface IFloorPlanViewerOptions {
    canvasContainerId: string;
    backgroundImage?: string;
    items: IFloorPlanItem[];
    settings?: Partial<IFloorPlanViewerSettings>;
}
