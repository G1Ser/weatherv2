const weatherCategories: Record<string, string[]> = {
  sun: ['晴'],
  cloudy: ['多云', '阴'],
  'light-rain': ['小雨'],
  rain: ['小到中雨', '中雨', '中到大雨', '雨', '大雨'],
  'heavy-rain': ['大到暴雨', '暴雨', '暴雨到大暴雨', '大暴雨', '大暴雨到特大暴雨', '特大暴雨'],
  showers: ['阵雨'],
  thunderstorm: ['雷阵雨', '雷阵雨并伴有冰雹'],
  'ice-rain': ['冻雨', '雨夹雪'],
  'light-snow': ['阵雪', '小雪', '小到中雪', '中雪', '中到大雪', '雪'],
  'heavy-snow': ['大雪', '大到暴雪', '暴雪', '弱高吹雪'],
  ash: ['浮尘', '扬沙'],
  dust: ['沙尘暴', '强沙尘暴'],
  fog: ['轻雾', '雾', '大雾', '浓雾', '强浓雾', '特强浓雾', '霾', '中度霾', '重度霾', '严重霾'],
  typhoon: ['龙卷风'],
};

/**
 * @description 根据天气获取对应icon
 * @param weather 天气现象名称
 * @returns 对应的图标名称
 */
export default function getWeatherIcon(weather: string) {
  for (const [icon, weathers] of Object.entries(weatherCategories)) {
    if (weathers.includes(weather)) {
      return icon;
    }
  }
  return 'sun';
}
