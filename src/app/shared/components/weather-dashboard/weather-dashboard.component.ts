import {
  CUSTOM_ELEMENTS_SCHEMA,
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  effect,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { BmapService } from '@/api/bmap';
import { showToast } from '@/lib/toast';
import { IpStoreService } from '@/app/core/store/ip-store.service';
import type {
  FavoriteType,
  IPData,
  SearchData,
  WeatherForecastHoursType,
  WeatherForecastType,
  WeatherIndexesType,
  WeatherNowDataType,
} from '@/app/types/bmap';
import { CurrentWeatherComponent } from '../current-weather.component';
import { DailyForecastComponent } from '../daily-forecast.component';
import { FavoritesComponent } from '../favorites.component';
import { HourlyForecastComponent } from '../hourly-forecast.component';
import { WeatherDetailsComponent } from '../weather-details.component';
import { AqiComponent } from '../aqi.component';
import { LifeIndexesComponent } from '../life-indexes.component';
import { localStorageUtil } from '@/app/shared/utils/storage';
import getWeatherIcon from '@/app/shared/utils/weather-icon';
import {
  Subject,
  catchError,
  debounceTime,
  distinctUntilChanged,
  from,
  of,
  switchMap,
  tap,
} from 'rxjs';
import '@/lib/skeleton';

type THEME_TYPE = 'dark' | 'light';

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
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'weather-dashboard' },
  templateUrl: './weather-dashboard.component.html',
  styleUrl: './weather-dashboard.component.scss',
})
export class WeatherDashboardComponent implements OnInit {
  private readonly THEME_KEY = 'theme';
  private readonly FAVORITE_KEY = 'favorites';
  private readonly bmapService = inject(BmapService);
  private readonly ipStore = inject(IpStoreService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly searchKeyword$ = new Subject<string>();

  readonly localId = signal<string | null>(null);
  readonly localLocation = signal<IPData>({ name_zh: '', lon: 0, lat: 0 });
  readonly weatherNowData = signal<WeatherNowDataType | null>(null);
  readonly weatherForecast = signal<WeatherForecastType[]>([]);
  readonly weatherForecastHours = signal<WeatherForecastHoursType[]>([]);
  readonly weatherIndexes = signal<WeatherIndexesType[]>([]);
  readonly searchResults = signal<SearchData[]>([]);
  readonly isSearching = signal<boolean>(false);
  readonly isWeatherLoading = signal<boolean>(true);
  readonly isFav = signal<boolean>(false);
  readonly isDarkTheme = signal<boolean>(false);
  readonly favoriteCities = signal<FavoriteType[]>([]);

  constructor() {
    effect(
      () => {
        const location = this.ipStore.location();
        if (location.lon == null || location.lat == null) {
          return;
        }
        const { name_zh, lon, lat } = location;
        this.localLocation.set({ name_zh, lon, lat });
        this.loadCurrentLocationWeather(lon, lat, name_zh);
      },
      { allowSignalWrites: true },
    );

    this.searchKeyword$
      .pipe(
        debounceTime(500),
        distinctUntilChanged(),
        switchMap(keyword =>
          from(this.bmapService.searchLocation(keyword)).pipe(
            tap(() => this.isSearching.set(false)),
            catchError(() => {
              this.isSearching.set(false);
              return of({ data: [] as SearchData[] });
            }),
          ),
        ),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe(res => {
        this.searchResults.set(res.data ?? []);
      });
  }

  ngOnInit() {
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

  onSearch(query: string) {
    const keyword = query.trim();

    if (!keyword) {
      this.isSearching.set(false);
      this.searchResults.set([]);
      return;
    }

    this.isSearching.set(true);
    this.searchKeyword$.next(keyword);
  }

  toggleFavorite() {
    const current = this.weatherNowData();
    if (!current) {
      return;
    }

    const favorites = this.getStoredFavorites();
    const exists = favorites.some(item => item.id === current.id);
    const nextFavorites = exists
      ? favorites.filter(item => item.id !== current.id)
      : [{ id: current.id, name: current.name, lon: current.lon, lat: current.lat }, ...favorites];

    localStorageUtil.set<FavoriteType[]>(this.FAVORITE_KEY, nextFavorites);
    this.isFav.set(!exists);

    const message = exists ? '已从收藏移除' : '已添加到收藏';
    showToast(`${current.name}${message}`, 'success');
    this.getFavoriteCities();
  }

  getFavoriteCities() {
    const localId = this.localId();
    if (!localId) return;

    const localCity: FavoriteType = {
      id: localId,
      name: this.localLocation().name_zh,
      lon: this.localLocation().lon,
      lat: this.localLocation().lat,
    };

    const favorites = this.getStoredFavorites().filter(item => item.id !== localId);
    this.favoriteCities.set([localCity, ...favorites]);
  }

  async onSelectSearchResult(item: SearchData, input: HTMLInputElement) {
    await this.loadCurrentLocationWeather(item.lon, item.lat, item.name_zh);
    input.value = '';
    this.searchResults.set([]);
  }

  async onFavoriteCitySelected(city: FavoriteType) {
    await this.loadCurrentLocationWeather(city.lon, city.lat, city.name);
  }

  private async loadCurrentLocationWeather(lon: number, lat: number, name: string) {
    this.isWeatherLoading.set(true);

    try {
      const res = await this.bmapService.getWeather({ lon, lat });
      const results = res.result;
      if (!results) return;

      const { location, now, forecasts, forecast_hours, indexes } = results;
      if (!this.localId()) {
        this.localId.set(location.id);
      }

      this.weatherNowData.set({
        ...now,
        id: location.id,
        name,
        lon,
        lat,
        icon: getWeatherIcon(now.text),
      });

      const favorites = this.getStoredFavorites();
      this.isFav.set(favorites.some(item => item.id === location.id));
      this.getFavoriteCities();

      this.weatherForecast.set(forecasts);
      this.weatherForecastHours.set(forecast_hours);
      this.weatherIndexes.set(indexes ?? []);
    } finally {
      this.isWeatherLoading.set(false);
    }
  }

  private getStoredFavorites(): FavoriteType[] {
    return localStorageUtil.get<FavoriteType[]>(this.FAVORITE_KEY, []);
  }
}
