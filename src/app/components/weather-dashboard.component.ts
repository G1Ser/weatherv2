import { Component, ChangeDetectionStrategy, computed, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WeatherData } from '../types/weather';
import { CurrentWeatherComponent } from './current-weather.component';
import { DailyForecastComponent } from './daily-forecast.component';
import { HourlyForecastComponent } from './hourly-forecast.component';
import { WeatherDetailsComponent } from './weather-details.component';
import { AqiComponent } from './aqi.component';
import { LifeIndexesComponent } from './life-indexes.component';
import { FavoritesComponent, FavoriteCity } from './favorites.component';

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
  template: `
    @if (error()) {
      <div class="status-screen">
        <span class="status-icon">⚠️</span>
        <span>加载数据出错: {{ error() }}</span>
      </div>
    } @else if (!weatherData()) {
      <div class="status-screen">
        <div class="loading-spinner"></div>
        <span>加载中...</span>
      </div>
    } @else {
      <!-- ===== Header ===== -->
      <header class="dashboard-header">
        <div class="header-left">
          <span class="app-logo">🌤️</span>
          <div class="search-box">
            <span class="search-icon">🔍</span>
            <input type="text" placeholder="搜索城市..." class="glass-input" id="city-search" />
          </div>
        </div>
        <div class="header-right">
          <span class="location-badge"> 📍 {{ weatherData()!.location.name }} </span>
        </div>
      </header>

      <!-- ===== 收藏夹（桌面横条 / 移动端底部抽屉） ===== -->
      <app-favorites [activeId]="activeFavId()" (citySelected)="onFavCitySelected($event)" />

      <!-- ===== 主内容区 ===== -->
      <div class="grid-layout">
        <aside class="left-col">
          <app-current-weather
            [weather]="weatherData()!.now"
            [location]="weatherData()!.location"
          />
          <app-daily-forecast [forecasts]="weatherData()!.forecasts" />
        </aside>

        <main class="right-col">
          <app-hourly-forecast [forecasts]="weatherData()!.forecast_hours" />
          <app-weather-details [weather]="weatherData()!.now" />

          @if (isChina() && weatherData()!.indexes && weatherData()!.now.aqi) {
            <app-aqi
              [aqi]="weatherData()!.now.aqi!"
              [pm25]="weatherData()!.now.pm25!"
              [pm10]="weatherData()!.now.pm10!"
              [o3]="weatherData()!.now.o3!"
              [no2]="weatherData()!.now.no2!"
              [so2]="weatherData()!.now.so2!"
              [co]="weatherData()!.now.co!"
            />
            <app-life-indexes [indexes]="weatherData()!.indexes!" />
          }
        </main>
      </div>
    }
  `,
  styles: `
    :host {
      display: block;
      padding: 24px;
      max-width: 1440px;
      margin: 0 auto;
      min-height: 100vh;
    }

    /* ---- 状态屏（loading / error） ---- */
    .status-screen {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 16px;
      min-height: 60vh;
      color: var(--text-muted);
      font-size: 0.95rem;
    }
    .status-icon {
      font-size: 2rem;
    }
    .loading-spinner {
      width: 36px;
      height: 36px;
      border: 3px solid rgba(255, 255, 255, 0.1);
      border-top-color: var(--accent-color);
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
    }
    @keyframes spin {
      to {
        transform: rotate(360deg);
      }
    }

    /* ---- Header ---- */
    .dashboard-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
      gap: 16px;
    }
    .header-left {
      display: flex;
      align-items: center;
      gap: 12px;
      flex: 1;
      min-width: 0;
    }
    .app-logo {
      font-size: 1.6rem;
      flex: 0 0 auto;
      line-height: 1;
    }
    .search-box {
      display: flex;
      align-items: center;
      gap: 8px;
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 20px;
      padding: 6px 14px;
      flex: 1;
      max-width: 280px;
      transition: var(--transition);
      &:focus-within {
        background: rgba(255, 255, 255, 0.09);
        border-color: var(--accent-color);
        box-shadow: 0 0 0 3px rgba(34, 197, 94, 0.12);
      }
    }
    .search-icon {
      font-size: 0.85rem;
      opacity: 0.5;
      flex: 0 0 auto;
    }
    .glass-input {
      background: transparent;
      border: none;
      color: var(--text-color);
      outline: none;
      font-size: 0.875rem;
      width: 100%;
      font-family: inherit;
      &::placeholder {
        color: var(--text-muted);
      }
    }
    .header-right {
      display: flex;
      align-items: center;
      gap: 12px;
      flex: 0 0 auto;
    }
    .location-badge {
      display: flex;
      align-items: center;
      gap: 6px;
      background: rgba(255, 255, 255, 0.06);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 20px;
      padding: 6px 14px;
      font-size: 0.875rem;
      color: var(--text-muted);
      white-space: nowrap;
    }

    /* ---- Grid ---- */
    .grid-layout {
      display: grid;
      grid-template-columns: 350px 1fr;
      gap: 24px;
      align-items: start;
    }
    .left-col {
      display: flex;
      flex-direction: column;
      gap: 24px;
      position: sticky;
      top: 24px;
    }
    .right-col {
      display: flex;
      flex-direction: column;
      gap: 24px;
      min-width: 0;
    }

    /* ---- Tablet ---- */
    @media (max-width: 1024px) {
      .grid-layout {
        grid-template-columns: 1fr;
      }
      .left-col {
        position: static;
      }
    }

    /* ---- Mobile ---- */
    @media (max-width: 768px) {
      :host {
        padding: 14px 14px 90px; /* 底部留空给 FAB */
      }
      .dashboard-header {
        gap: 10px;
        margin-bottom: 14px;
      }
      .app-logo {
        font-size: 1.3rem;
      }
      .search-box {
        max-width: none; /* 移动端搜索框撑满 */
      }
      .location-badge {
        padding: 6px 10px;
        font-size: 0.8rem;
      }
    }

    /* ---- 超小屏 ---- */
    @media (max-width: 420px) {
      .app-logo {
        display: none;
      }
      .location-badge span:first-child {
        display: none;
      } /* 隐藏 📍 图标 */
    }
  `,
})
export class WeatherDashboardComponent implements OnInit {
  weatherData = signal<WeatherData | null>(null);
  error = signal<string | null>(null);
  activeFavId = signal<string>('');
  isChina = computed(() => this.weatherData()?.location.country === '中国');

  ngOnInit() {
    this.loadData('CN');
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
    } catch (e: any) {
      this.error.set(e.message);
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
    } catch (e: any) {
      this.error.set(e.message);
    }
  }
}
