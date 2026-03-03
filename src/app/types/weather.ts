export interface WeatherLocation {
  country: string;
  province: string;
  city: string;
  name: string;
  id: string;
}

export interface CurrentWeather {
  text: string;
  temp: number;
  feels_like: number;
  rh: number;
  wind_class: string;
  wind_dir: string;
  prec_1h: number;
  clouds: number;
  vis: number;
  aqi?: number;
  pm25?: number;
  pm10?: number;
  no2?: number;
  so2?: number;
  o3?: number;
  co?: number;
  wind_angle: number;
  uvi: number;
  pressure: number;
  dpt: number;
  uptime: string;
}

export interface IndexData {
  name: string;
  brief: string;
  detail: string;
}

export interface Alert {
  // Define alert structure if needed
}

export interface ForecastDaily {
  text_day: string;
  text_night: string;
  high: number;
  low: number;
  wc_day: string;
  wd_day: string;
  wc_night: string;
  wd_night: string;
  wind_angle_day?: number;
  wind_angle_night?: number;
  uvi?: number;
  pressure?: number;
  dpt?: number;
  date: string;
  week: string;
}

export interface ForecastHourly {
  text: string;
  temp_fc: number;
  wind_class: string;
  wind_dir: string;
  rh: number;
  prec_1h: number;
  clouds: number;
  wind_angle: number;
  pop: number;
  uvi: number;
  pressure: number;
  dpt: number;
  data_time: string;
}

export interface WeatherData {
  location: WeatherLocation;
  now: CurrentWeather;
  indexes?: IndexData[];
  alerts?: Alert[];
  forecasts: ForecastDaily[];
  forecast_hours: ForecastHourly[];
}
