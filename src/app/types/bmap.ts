export interface IPData {
  name_zh: string;
  lon: number;
  lat: number;
}

export interface WeatherNowType {
  text: string;
  temp: number;
  feels_like: number;
  wind_class: string;
  wind_dir: string;
  rh: number;
  vis: number;
  uvi: number;
  pressure: number;
  dpt: number;
  prec_1h?: number;
  clouds?: number;
  wind_angle?: number;
  uptime?: string;
  aqi?: number;
  pm25?: number;
  pm10?: number;
  no2?: number;
  so2?: number;
  o3?: number;
  co?: number;
}

export interface WeatherIndexesType {
  name: string;
  brief: string;
  detail: string;
}

export interface WeatherForecastType {
  text_day: string;
  text_night: string;
  high: number;
  low: number;
  wc_day?: string;
  wd_day?: string;
  wc_night?: string;
  wd_night?: string;
  wind_angle_day?: number;
  wind_angle_night?: number;
  uvi?: number;
  pressure?: number;
  dpt?: number;
  date: string;
  week: string;
}

export interface WeatherForecastHoursType {
  text: string;
  temp_fc: number;
  pop: number;
  wind_class?: string;
  wind_dir?: string;
  rh?: number;
  prec_1h?: number;
  clouds?: number;
  wind_angle?: number;
  uvi?: number;
  pressure?: number;
  dpt?: number;
  data_time: string;
}

export interface WeatherData {
  result: {
    location: { id: string };
    now: WeatherNowType;
    indexes?: WeatherIndexesType[];
    forecasts: WeatherForecastType[];
    forecast_hours: WeatherForecastHoursType[];
  };
}
