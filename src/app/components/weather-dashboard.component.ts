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
      <!-- ===== 固定在顶部的导航区 ===== -->
      <div class="sticky-top-nav">
        <!-- ===== Header ===== -->
        <header class="dashboard-header">
          <div class="header-left">
            <div class="search-box">
              <span class="search-icon">🔍</span>
              <input
                #searchInput
                type="text"
                placeholder="搜索城市..."
                class="glass-input"
                id="city-search"
                (keyup.enter)="onSearch(searchInput.value)"
              />
            </div>
          </div>
          <div class="header-right">
            <span class="location-badge"> 📍 {{ weatherData()!.location.name }} </span>
            <button
              class="fav-heart-btn"
              [class.is-fav]="isCurrentFav()"
              (click)="toggleCurrentFav()"
            >
              <span class="heart-icon">❤️</span>
            </button>
            <button class="theme-toggle" (click)="toggleTheme()">
              {{ isDarkTheme() ? '🌙' : '☀️' }}
            </button>
          </div>
        </header>

        <!-- ===== 收藏夹（桌面横条 / 移动端底部抽屉） ===== -->
        <app-favorites [activeId]="activeFavId()" (citySelected)="onFavCitySelected($event)" />
      </div>

      <!-- ===== 主内容区 ===== -->
      <div class="grid-layout">
        <aside class="left-col">
          <app-current-weather
            class="top-card"
            [weather]="weatherData()!.now"
            [location]="weatherData()!.location"
          />
          <app-daily-forecast [forecasts]="weatherData()!.forecasts" />
        </aside>

        <main class="right-col">
          <app-hourly-forecast class="top-card" [forecasts]="weatherData()!.forecast_hours" />
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

    /* ---- Sticky Navigation ---- */
    .sticky-top-nav {
      position: sticky;
      top: 0;
      z-index: 50;
      background: var(--nav-bg);
      backdrop-filter: blur(24px);
      -webkit-backdrop-filter: blur(24px);
      margin: -24px -24px 24px -24px;
      padding: 24px 24px 0 24px;
      border-bottom: 1px solid var(--border-color);
      /* Add mild shadow when sticky */
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.02);
      transition:
        background 0.4s ease,
        border-color 0.4s ease;
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
      flex: 1;
      min-width: 0;
    }
    .search-box {
      display: flex;
      align-items: center;
      gap: 12px;
      background: var(--item-bg);
      border: 1px solid var(--item-border);
      border-radius: 20px;
      padding: 10px 20px;
      flex: 1;
      max-width: 400px;
      transition: var(--transition);
      &:focus-within {
        background: var(--item-bg-hover);
        border-color: var(--accent-color);
        box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.15); /* Elegant crisp blue shadow */
      }
    }
    .search-icon {
      font-size: 1rem;
      opacity: 0.5;
      flex: 0 0 auto;
    }
    .glass-input {
      background: transparent;
      border: none;
      color: var(--text-color);
      outline: none;
      font-size: 1rem;
      width: 100%;
      font-family: inherit;
      &::placeholder {
        color: var(--text-muted);
      }
    }
    .header-right {
      display: flex;
      align-items: center;
      gap: 16px;
      flex: 0 0 auto;
    }
    .location-badge {
      display: flex;
      align-items: center;
      gap: 6px;
      background: var(--item-bg);
      border: 1px solid var(--item-border);
      border-radius: 20px;
      padding: 8px 16px;
      font-size: 0.95rem;
      color: var(--text-muted);
      white-space: nowrap;
    }

    .fav-heart-btn {
      background: var(--item-bg);
      border: 1px solid var(--item-border);
      border-radius: 50%;
      width: 40px;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      &:hover {
        background: var(--item-bg-hover);
        transform: scale(1.05);
      }
      &.is-fav {
        border-color: rgba(239, 68, 68, 0.3);
        background: rgba(239, 68, 68, 0.1);
        .heart-icon {
          filter: grayscale(0%) opacity(1);
          animation: heartbeat 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }
      }
    }
    .heart-icon {
      font-size: 1.1rem;
      filter: grayscale(100%) opacity(0.5);
      transition: all 0.3s ease;
    }

    .theme-toggle {
      background: var(--item-bg);
      border: 1px solid var(--item-border);
      border-radius: 50%;
      width: 40px;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      font-size: 1.1rem;
      transition: all 0.3s cubic-bezier(0.25, 1, 0.5, 1);
      &:hover {
        background: var(--item-bg-hover);
        transform: scale(1.05);
      }
    }

    @keyframes heartbeat {
      0% {
        transform: scale(1);
      }
      15% {
        transform: scale(1.3);
      }
      30% {
        transform: scale(1);
      }
      45% {
        transform: scale(1.2);
      }
      60% {
        transform: scale(1);
      }
      100% {
        transform: scale(1);
      }
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
      top: 154px; /* Navigate safely right below the entire top sticky header combo */
      height: fit-content;
    }
    .right-col {
      display: flex;
      flex-direction: column;
      gap: 24px;
      min-width: 0;
    }

    /* ---- 顶部卡片对齐 ---- */
    @media (min-width: 1025px) {
      .top-card {
        height: 240px; /* 强制两张卡片具有一样的死高度 */
        box-sizing: border-box;
      }
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
        padding: 16px 16px 90px;
      }
      .sticky-top-nav {
        position: sticky;
        top: 0;
        z-index: 50;
        background: var(--bg-color); /* Fallback to solid color to un-trap backdrop-filter bugs */
        backdrop-filter: none;
        -webkit-backdrop-filter: none;
        margin: -16px -16px 16px -16px;
        padding: 16px 16px 10px 16px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05); /* Soft shadow when sticky on mobile */
      }
      .dashboard-header {
        flex-direction: column;
        align-items: stretch;
        gap: 12px;
      }
      .header-left,
      .search-box {
        max-width: none;
        width: 100%;
      }
      .header-right {
        justify-content: space-between;
        width: 100%;
      }
      .location-badge {
        padding: 8px 14px;
        font-size: 0.9rem;
        flex: 1;
        justify-content: center;
      }
    }

    /* ---- 超小屏 ---- */
    @media (max-width: 420px) {
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
  isCurrentFav = signal<boolean>(false);
  isDarkTheme = signal<boolean>(false);

  ngOnInit() {
    // Determine the initial theme from the document's structure, or default to false
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
    } catch (e: any) {
      this.error.set(e.message);
    }
  }

  onSearch(query: string) {
    if (!query.trim()) return;
    // Mock simple logic: if query contains English letters, use US data, else CN
    const isEn = /^[a-zA-Z\s]+$/.test(query.trim());
    const typeToLoad = isEn ? 'US' : 'CN';

    // Simulate updating the location name for the mock data visualization
    this.loadDataWithMockOverride(typeToLoad, query.trim());
  }

  private async loadDataWithMockOverride(type: 'CN' | 'US', cityName: string) {
    this.activeFavId.set(''); // Clear active favorite
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
