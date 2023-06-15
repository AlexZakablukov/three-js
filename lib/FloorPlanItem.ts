import { Mesh, PlaneGeometry, MeshBasicMaterial, Color } from "three";

export interface IFloorPlanItemData {
  id: string;
  title: string;
}

export interface IFloorPlanItem {
  width: number;
  height: number;
  color: string;
  data?: IFloorPlanItemData;
}

export class FloorPlanItem extends Mesh {
  public geometry: PlaneGeometry;
  public material: MeshBasicMaterial;
  public data?: IFloorPlanItemData;

  constructor(props: IFloorPlanItem) {
    super();
    const { width, height, color, data } = props;
    this.geometry = new PlaneGeometry(width, height);
    this.material = new MeshBasicMaterial({ color: new Color(color) });
    this.data = data;
  }

  public onClick(e: MouseEvent) {
    this.material.color.setHex(Math.random() * 0xffffff);
  }
}
