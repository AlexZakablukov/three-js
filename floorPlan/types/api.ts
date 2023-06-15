export interface IDataApi {
  place: IPlaceApi;
}

export interface IPlaceApi {
  id: number;
  name: string | null;
  floorPlan: string;
  halls: IHallApi[];
}

export interface IHallApi {
  id: number;
  place_id: number;
  name: string;
  planURL: string | null;
  floor: number;
  coords: string | null;
  is_conf: boolean;
  show_stand_name: any;
  show_stand_company: any;
  is_check_in: boolean;
  is_hidden: boolean;
  params: string | null;
}
