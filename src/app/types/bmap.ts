export interface IPData {
  city: string;
  countryCode: string;
  lon: number;
  lat: number;
}

export interface WeatherNowType {
  text: string; //天气现象
  temp: number; //当前温度
  feels_like: number; //体感温度
  wind_class: string; //风速
  wind_dir: string; //风向
  rh: number; //相对湿度
  vis: number; //能见度(m)
  uvi: number; //紫外线指数
  pressure: number; //大气压(hPa)
  dpt: number; //露点温度
  /**
   * 以下参数为中国大陆特有
   */
  aqi?: number; //空气质量指数
  /**
   * 污染物浓度(ug/m³)
   */
  pm25?: number;
  pm10?: number;
  no2?: number;
  so2?: number;
  o3?: number;
  co?: number;
}

// 生活指数数据 仅限中国大陆
export interface WeatherIndexesType {
  name: string; //中文名称
  brief: string; // 概要
  detail: string; // 详细说明
}

export interface WeatherForecastType {
  text_day: string;
  text_night: string;
  high: number;
  low: number;
  date: string;
  week: string;
}

export interface WeatherForecastHoursType {
  text: string;
  temp_fc: number;
  pop: number; // 降水概率
  data_time: string;
}

export interface WeatherData {
  result: {
    now: WeatherNowType;
    indexes?: WeatherIndexesType[];
    forecasts: WeatherForecastType[];
    forecast_hours: WeatherForecastHoursType[];
  };
}
