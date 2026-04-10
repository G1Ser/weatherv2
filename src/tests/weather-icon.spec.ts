import getWeatherIcon from '@/app/shared/utils/weather-icon';

describe('天气图标映射工具', () => {
  it('晴天应映射为 sun 图标', () => {
    expect(getWeatherIcon('晴')).toBe('sun');
  });

  it('多云应映射为 cloudy 图标', () => {
    expect(getWeatherIcon('多云')).toBe('cloudy');
  });

  it('未知天气应回退为 sun 图标', () => {
    expect(getWeatherIcon('台风眼外环')).toBe('sun');
  });
});
