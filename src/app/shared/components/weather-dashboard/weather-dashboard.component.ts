import { ChangeDetectionStrategy, Component, effect, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BmapService } from '@/api/bmap';
import { showToast } from '@/lib/toast';
import { IpStoreService } from '@/app/core/store/ip-store.service';
import type { IPData, WeatherData as ApiWeatherData } from '@/app/types/bmap';
import type { WeatherData } from '@/app/types/weather';
import { CurrentWeatherComponent } from '../current-weather.component';
import { DailyForecastComponent } from '../daily-forecast.component';
import { HourlyForecastComponent } from '../hourly-forecast.component';
import { WeatherDetailsComponent } from '../weather-details.component';
import { AqiComponent } from '../aqi.component';
import { LifeIndexesComponent } from '../life-indexes.component';
import { FavoritesComponent, FavoriteCity } from '../favorites/favorites.component';
import { localStorageUtil } from '@/app/shared/utils/storage';

type THEME_TYPE = 'dark' | 'light';

const CURRENT_LOCATION_ID = '__current_location__';

const EMPTY_WEATHER_DATA: WeatherData = {
  location: {
    country: '',
    province: '',
    city: '',
    name: '',
    id: '',
  },
  now: {
    text: '',
    temp: 0,
    feels_like: 0,
    rh: 0,
    wind_class: '',
    wind_dir: '',
    prec_1h: 0,
    clouds: 0,
    vis: 0,
    wind_angle: 0,
    uvi: 0,
    pressure: 0,
    dpt: 0,
    uptime: '',
  },
  indexes: [],
  forecasts: [],
  forecast_hours: [],
};

@Component({
  selector: 'app-weather-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    CurrentWeatherComponent,
    DailyForecastComponent,
    HourlyForecastComponent,
    WeatherDetailsComponent,
    AqiComponent,
    LifeIndexesComponent,
    FavoritesComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'weather-dashboard' },
  templateUrl: './weather-dashboard.component.html',
  styleUrl: './weather-dashboard.component.scss',
})
export class WeatherDashboardComponent {
  private readonly THEME_KEY = 'theme';
  private readonly bmapService = inject(BmapService);
  private readonly ipStore = inject(IpStoreService);
  private lastWeatherKey = '';

  readonly weatherData = signal<WeatherData>(EMPTY_WEATHER_DATA);
  readonly activeFavId = signal<string>(CURRENT_LOCATION_ID);
  readonly isDarkTheme = signal<boolean>(false);

  constructor() {
    effect(
      () => {
        const location = this.ipStore.location();
        if (location.lon == null || location.lat == null || !location.name_zh) {
          return;
        }

        const weatherKey = `${location.lon}:${location.lat}:${location.name_zh}`;
        if (weatherKey === this.lastWeatherKey) {
          return;
        }

        this.lastWeatherKey = weatherKey;
        this.activeFavId.set(CURRENT_LOCATION_ID);
        this.weatherData.update(prev => ({
          ...prev,
          location: {
            ...prev.location,
            name: location.name_zh,
            city: location.name_zh,
          },
        }));
        void this.loadCurrentLocationWeather({
          name_zh: location.name_zh,
          lon: location.lon,
          lat: location.lat,
        });
      },
      { allowSignalWrites: true },
    );

    const savedTheme = localStorageUtil.get<THEME_TYPE>(this.THEME_KEY, 'light');
    if (savedTheme === 'dark') {
      this.isDarkTheme.set(true);
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      this.isDarkTheme.set(false);
      document.documentElement.removeAttribute('data-theme');
    }
  }

  toggleTheme() {
    this.isDarkTheme.update(v => !v);
    if (this.isDarkTheme()) {
      document.documentElement.setAttribute('data-theme', 'dark');
      localStorageUtil.set<THEME_TYPE>(this.THEME_KEY, 'dark');
    } else {
      document.documentElement.removeAttribute('data-theme');
      localStorageUtil.set<THEME_TYPE>(this.THEME_KEY, 'light');
    }
  }

  isCurrentLocation() {
    return this.activeFavId() === CURRENT_LOCATION_ID;
  }

  favoriteCities(): FavoriteCity[] {
    const data = this.weatherData();
    if (!data.location.name) {
      return [];
    }

    const today = data.forecasts[0];
    return [
      {
        id: CURRENT_LOCATION_ID,
        name: data.location.name,
        country: data.location.country,
        temp: data.now.temp,
        feels_like: data.now.feels_like,
        text: data.now.text,
        icon: '📍',
        high: today?.high ?? data.now.temp,
        low: today?.low ?? data.now.temp,
        aqi: data.now.aqi,
      },
    ];
  }

  onSearch(query: string) {
    if (!query.trim()) {
      return;
    }

    showToast('城市搜索接口还未接入', 'info');
  }

  onFavCitySelected(city: FavoriteCity) {
    this.activeFavId.set(city.id);
  }

  private async loadCurrentLocationWeather(location: IPData) {
    try {
      const response = await this.bmapService.getWeather({
        lon: location.lon,
        lat: location.lat,
        country: 'CN',
      });

      this.weatherData.set(this.mapWeatherData(response, location));
    } catch (error) {
      console.error(error);
      showToast('天气数据加载失败', 'error');
    }
  }

  private mapWeatherData(response: ApiWeatherData, location: IPData): WeatherData {
    const result = response.result;

    return {
      location: {
        country: '',
        province: '',
        city: location.name_zh,
        name: location.name_zh,
        id: result.location.id,
      },
      now: {
        text: result.now.text,
        temp: result.now.temp,
        feels_like: result.now.feels_like,
        rh: result.now.rh,
        wind_class: result.now.wind_class,
        wind_dir: result.now.wind_dir,
        prec_1h: result.now.prec_1h ?? 0,
        clouds: result.now.clouds ?? 0,
        vis: result.now.vis,
        aqi: result.now.aqi,
        pm25: result.now.pm25,
        pm10: result.now.pm10,
        no2: result.now.no2,
        so2: result.now.so2,
        o3: result.now.o3,
        co: result.now.co,
        wind_angle: result.now.wind_angle ?? 0,
        uvi: result.now.uvi,
        pressure: result.now.pressure,
        dpt: result.now.dpt,
        uptime: result.now.uptime ?? '',
      },
      indexes: result.indexes ?? [],
      forecasts: result.forecasts.map(forecast => ({
        text_day: forecast.text_day,
        text_night: forecast.text_night,
        high: forecast.high,
        low: forecast.low,
        wc_day: forecast.wc_day ?? '',
        wd_day: forecast.wd_day ?? '',
        wc_night: forecast.wc_night ?? '',
        wd_night: forecast.wd_night ?? '',
        wind_angle_day: forecast.wind_angle_day,
        wind_angle_night: forecast.wind_angle_night,
        uvi: forecast.uvi,
        pressure: forecast.pressure,
        dpt: forecast.dpt,
        date: forecast.date,
        week: forecast.week,
      })),
      forecast_hours: result.forecast_hours.map(hour => ({
        text: hour.text,
        temp_fc: hour.temp_fc,
        wind_class: hour.wind_class ?? '',
        wind_dir: hour.wind_dir ?? '',
        rh: hour.rh ?? 0,
        prec_1h: hour.prec_1h ?? 0,
        clouds: hour.clouds ?? 0,
        wind_angle: hour.wind_angle ?? 0,
        pop: hour.pop,
        uvi: hour.uvi ?? 0,
        pressure: hour.pressure ?? 0,
        dpt: hour.dpt ?? 0,
        data_time: hour.data_time,
      })),
    };
  }
}
