export interface IPlaceDataApi {
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

export interface IHallApiFull extends IHallApi {
  sectors: ISector[];
  categories: any[];
  exhibitors: any[];
}

export interface IHallDataApi {
  hall: IHallApiFull;
}

export interface ISector {
  id: number;
  name: string;
  coords: string;
  hall_id: number;
  is_conf: boolean;
  number_font_size: any;
  number_x: any;
  number_y: any;
  company_font_size: any;
  company_x: any;
  company_y: any;
  create_timestamp: number;
  update_timestamp: number;
  is_check_in: boolean;
  is_lmr: boolean;
  lmr_number: number;
  is_blounge: boolean;
  params: string;
  visited: boolean;
  categories: any[];
  exhibitors: any[];
}
