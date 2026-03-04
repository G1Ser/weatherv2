import { Component, ChangeDetectionStrategy, output, signal, input } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface FavoriteCity {
  id: string;
  name: string;
  country: string;
  temp: number;
  feels_like: number;
  text: string;
  icon: string;
  high: number;
  low: number;
  aqi?: number;
  /** 决定加载哪套 mock 数据 */
  mockType: 'CN' | 'US';
}

// 模拟天气状态配置
const WEATHER_CONDITIONS = [
  { text: '晴', icon: '☀️' },
  { text: '多云', icon: '⛅' },
  { text: '阴', icon: '☁️' },
  { text: '小雨', icon: '🌦️' },
  { text: '中雨', icon: '🌧️' },
  { text: '雷阵雨', icon: '⛈️' },
  { text: '小雪', icon: '🌨️' },
  { text: '大雾', icon: '🌫️' },
  { text: '沙尘', icon: '🌪️' },
  { text: '暴雨', icon: '🌊' },
];

function randomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function makeCity(
  id: string,
  name: string,
  country: string,
  basetemp: number,
  mockType: 'CN' | 'US' = 'CN',
): FavoriteCity {
  const cond = WEATHER_CONDITIONS[randomInt(0, WEATHER_CONDITIONS.length - 1)];
  const temp = basetemp + randomInt(-5, 5);
  return {
    id,
    name,
    country,
    temp,
    feels_like: temp + randomInt(-3, 2),
    text: cond.text,
    icon: cond.icon,
    high: temp + randomInt(2, 8),
    low: temp - randomInt(2, 8),
    aqi: randomInt(10, 200),
    mockType,
  };
}

const MOCK_CITIES: FavoriteCity[] = [
  makeCity('BJ', '北京', '中国', 5),
  makeCity('SH', '上海', '中国', 12),
  makeCity('GZ', '广州', '中国', 22),
  makeCity('CD', '成都', '中国', 10),
  makeCity('WH', '武汉', '中国', 8),
  makeCity('XA', '西安', '中国', 4),
  makeCity('HB', '哈尔滨', '中国', -8),
  makeCity('SZ', '深圳', '中国', 23),
  makeCity('HK', '香港', '中国', 20),
  makeCity('TY', '台北', '中国', 18),
  makeCity('TK', '东京', '日本', 8),
  makeCity('SK', '首尔', '韩国', 2),
  makeCity('SEA', '西雅图', '美国', 8, 'US'),
  makeCity('NY', '纽约', '美国', -2, 'US'),
  makeCity('LA', '洛杉矶', '美国', 18, 'US'),
  makeCity('CH', '芝加哥', '美国', -4, 'US'),
  makeCity('LD', '伦敦', '英国', 7),
  makeCity('PA', '巴黎', '法国', 9),
  makeCity('DU', '迪拜', '阿联酋', 30),
  makeCity('SY', '悉尼', '澳大利亚', 25),
  makeCity('SP', '新加坡', '新加坡', 31),
  makeCity('MO', '莫斯科', '俄罗斯', -5),
];

function getAqiLevel(aqi: number): { label: string; color: string } {
  if (aqi <= 50) return { label: '优', color: '#22c55e' };
  if (aqi <= 100) return { label: '良', color: '#84cc16' };
  if (aqi <= 150) return { label: '轻度', color: '#f59e0b' };
  if (aqi <= 200) return { label: '中度', color: '#f97316' };
  return { label: '重度', color: '#ef4444' };
}

@Component({
  selector: 'app-favorites',
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './favorites.component.html',
  styleUrl: './favorites.component.scss',
})
export class FavoritesComponent {
  activeId = input<string>('');
  citySelected = output<FavoriteCity>();

  cities = signal<FavoriteCity[]>(MOCK_CITIES);
  sheetOpen = signal(false);

  aqiLevel = getAqiLevel;

  selectCity(city: FavoriteCity) {
    this.citySelected.emit(city);
  }

  toggleSheet() {
    this.sheetOpen.update(v => !v);
  }
}
