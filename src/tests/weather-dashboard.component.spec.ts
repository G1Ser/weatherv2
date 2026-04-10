import { ComponentFixture, TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { BmapService } from '@/api/bmap';
import { IpStoreService } from '@/app/core/store/ip-store.service';
import { localStorageUtil } from '@/app/shared/utils/storage';
import { WeatherDashboardComponent } from '@/app/shared/components/weather-dashboard/weather-dashboard.component';
import type { WeatherData } from '@/app/types/bmap';

describe('天气看板组件', () => {
  let fixture: ComponentFixture<WeatherDashboardComponent>;
  let component: WeatherDashboardComponent;
  let bmapServiceSpy: jasmine.SpyObj<BmapService>;
  let storageGetSpy: jasmine.Spy;
  let storageSetSpy: jasmine.Spy;

  beforeEach(async () => {
    bmapServiceSpy = jasmine.createSpyObj<BmapService>('BmapService', [
      'searchLocation',
      'getWeather',
    ]);
    bmapServiceSpy.searchLocation.and.resolveTo({ data: [] });
    bmapServiceSpy.getWeather.and.resolveTo({ result: null } as any);

    storageGetSpy = spyOn(localStorageUtil as any, 'get').and.callFake(
      <T>(_key: string, defaultValue: T) => defaultValue,
    );
    storageSetSpy = spyOn(localStorageUtil as any, 'set').and.stub();

    await TestBed.configureTestingModule({
      imports: [WeatherDashboardComponent],
      providers: [
        { provide: BmapService, useValue: bmapServiceSpy },
        {
          provide: IpStoreService,
          useValue: {
            location: signal({
              name_zh: '',
              lon: null,
              lat: null,
            }),
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(WeatherDashboardComponent);
    component = fixture.componentInstance;
    document.documentElement.removeAttribute('data-theme');
  });

  afterEach(() => {
    document.documentElement.removeAttribute('data-theme');
  });

  it('初始化时读取暗色主题应设置 data-theme=dark', () => {
    storageGetSpy.withArgs('theme', 'light').and.returnValue('dark');

    fixture.detectChanges();

    expect(component.isDarkTheme()).toBeTrue();
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
  });

  it('切换主题时应更新状态并写入本地存储', () => {
    component.toggleTheme();
    expect(component.isDarkTheme()).toBeTrue();
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
    expect(storageSetSpy).toHaveBeenCalledWith('theme', 'dark');

    component.toggleTheme();
    expect(component.isDarkTheme()).toBeFalse();
    expect(document.documentElement.hasAttribute('data-theme')).toBeFalse();
    expect(storageSetSpy).toHaveBeenCalledWith('theme', 'light');
  });

  it('搜索词为空时应停止搜索并清空结果', () => {
    component.isSearching.set(true);
    component.searchResults.set([
      { id: 1, name_zh: '北京市', display_zh: '北京市', lon: 116.4, lat: 39.9 },
    ]);

    component.onSearch('   ');

    expect(component.isSearching()).toBeFalse();
    expect(component.searchResults()).toEqual([]);
  });

  it('搜索词非空时应进入搜索中状态', () => {
    component.onSearch('  北京  ');
    expect(component.isSearching()).toBeTrue();
  });

  it('加载天气成功后应更新页面数据并关闭 loading', async () => {
    bmapServiceSpy.getWeather.and.resolveTo({
      result: {
        location: { id: '310000' },
        now: {
          text: '晴',
          temp: 26,
          feels_like: 27,
          wind_class: '3级',
          wind_dir: '北风',
          rh: 42,
          vis: 10000,
          uvi: 5,
          pressure: 1012,
          dpt: 10,
        },
        forecasts: [
          { date: '2026-04-10', week: '周五', text_day: '晴', text_night: '阴', high: 28, low: 19 },
        ],
        forecast_hours: [{ text: '晴', temp_fc: 26, pop: 0, data_time: '2026-04-10 09:00:00' }],
        indexes: [{ name: '穿衣', brief: '舒适', detail: '建议长袖' }],
      },
    } as WeatherData);

    await (component as any).loadCurrentLocationWeather(121.47, 31.23, '上海市');

    expect(component.isWeatherLoading()).toBeFalse();
    expect(component.localId()).toBe('310000');
    expect(component.weatherNowData()?.name).toBe('上海市');
    expect(component.weatherForecast().length).toBe(1);
    expect(component.weatherForecastHours().length).toBe(1);
    expect(component.weatherIndexes().length).toBe(1);
  });

  it('加载天气失败时也应关闭 loading', async () => {
    bmapServiceSpy.getWeather.and.returnValue(Promise.reject(new Error('请求失败')));

    await expectAsync(
      (component as any).loadCurrentLocationWeather(121.47, 31.23, '上海市'),
    ).toBeRejected();
    expect(component.isWeatherLoading()).toBeFalse();
  });
});
