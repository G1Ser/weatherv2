import { Component, ChangeDetectionStrategy, computed, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WeatherData } from '@/app/types/weather';
import { CurrentWeatherComponent } from '../current-weather.component';
import { DailyForecastComponent } from '../daily-forecast.component';
import { HourlyForecastComponent } from '../hourly-forecast.component';
import { WeatherDetailsComponent } from '../weather-details.component';
import { AqiComponent } from '../aqi.component';
import { LifeIndexesComponent } from '../life-indexes.component';
import { FavoritesComponent, FavoriteCity } from '../favorites/favorites.component';

@Component({
  selector: 'app-weather-dashboard',
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
export class WeatherDashboardComponent implements OnInit {
  weatherData = signal<WeatherData | null>(null);
  error = signal<string | null>(null);
  activeFavId = signal<string>('');
  isChina = computed(() => this.weatherData()?.location.country === '中国');
  isCurrentFav = signal<boolean>(false);
  isDarkTheme = signal<boolean>(false);

  ngOnInit() {
    this.isDarkTheme.set(document.documentElement.getAttribute('data-theme') === 'dark');
    this.loadData('CN');
  }

  toggleTheme() {
    this.isDarkTheme.update(v => !v);
    if (this.isDarkTheme()) {
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
  }

  toggleCurrentFav() {
    this.isCurrentFav.update(v => !v);
  }

  async loadData(type: 'CN' | 'US') {
    this.error.set(null);
    try {
      const res = await fetch(`/__mock__/${type}.json`);
      if (!res.ok) throw new Error('网络请求失败');
      const json = await res.json();
      if (json.status === 0 && json.result) {
        this.weatherData.set(json.result);
      } else {
        throw new Error('未获取到有效数据');
      }
    } catch (e: unknown) {
      this.error.set((e as Error).message);
    }
  }

  onSearch(query: string) {
    if (!query.trim()) return;
    const isEn = /^[a-zA-Z\s]+$/.test(query.trim());
    const typeToLoad = isEn ? 'US' : 'CN';
    this.loadDataWithMockOverride(typeToLoad, query.trim());
  }

  private async loadDataWithMockOverride(type: 'CN' | 'US', cityName: string) {
    this.activeFavId.set('');
    this.error.set(null);
    try {
      const res = await fetch(`/__mock__/${type}.json`);
      if (!res.ok) throw new Error('网络请求失败');
      const json = await res.json();
      if (json.status === 0 && json.result) {
        const data: WeatherData = {
          ...json.result,
          location: {
            ...json.result.location,
            name: cityName,
            city: cityName,
          },
        };
        this.weatherData.set(data);
      }
    } catch (e: unknown) {
      this.error.set((e as Error).message);
    }
  }

  onFavCitySelected(city: FavoriteCity) {
    this.activeFavId.set(city.id);
    this.loadDataForFav(city);
  }

  private async loadDataForFav(city: FavoriteCity) {
    this.error.set(null);
    try {
      const res = await fetch(`/__mock__/${city.mockType}.json`);
      if (!res.ok) throw new Error('网络请求失败');
      const json = await res.json();
      if (json.status === 0 && json.result) {
        const data: WeatherData = {
          ...json.result,
          location: {
            ...json.result.location,
            name: city.name,
            city: city.name,
            country: city.country,
          },
          now: {
            ...json.result.now,
            temp: city.temp,
            feels_like: city.feels_like,
            text: city.text,
          },
        };
        this.weatherData.set(data);
      }
    } catch (e: unknown) {
      this.error.set((e as Error).message);
    }
  }
}
