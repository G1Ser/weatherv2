import { Component, ChangeDetectionStrategy, output, signal, computed, input } from '@angular/core';
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
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <!-- ===== 桌面端：顶部横向滚动收藏条 ===== -->
    <div class="fav-bar desktop-only">
      <div class="fav-bar-inner">
        @for (city of cities(); track city.id) {
          <div
            class="city-card"
            [class.active]="activeId() === city.id"
            (click)="selectCity(city)"
            [attr.title]="city.name"
          >
            <div class="city-card-top">
              <span class="city-icon">{{ city.icon }}</span>
              <span class="city-temp">{{ city.temp }}°</span>
            </div>
            <div class="city-name">{{ city.name }}</div>
            <div class="city-meta">
              <span class="city-text">{{ city.text }}</span>
              @if (city.aqi) {
                <span class="city-aqi" [style.color]="aqiLevel(city.aqi).color">
                  {{ aqiLevel(city.aqi).label }}
                </span>
              }
            </div>
            <div class="city-range">{{ city.low }}° / {{ city.high }}°</div>
          </div>
        }
      </div>
    </div>

    <!-- ===== 移动端：底部抽屉 sheet ===== -->
    <div class="mobile-only">
      <!-- 收藏按钮触发器 -->
      <button class="fav-trigger" (click)="toggleSheet()">
        <span class="fav-trigger-icon">{{ sheetOpen() ? '✕' : '⭐' }}</span>
        <span class="fav-trigger-label">{{ sheetOpen() ? '关闭' : '收藏城市' }}</span>
        <span class="fav-count">{{ cities().length }}</span>
      </button>

      <!-- 遮罩 -->
      @if (sheetOpen()) {
        <div class="sheet-backdrop" (click)="toggleSheet()"></div>
      }

      <!-- Drawer sheet -->
      <div class="fav-sheet" [class.open]="sheetOpen()">
        <div class="sheet-handle" (click)="toggleSheet()">
          <div class="handle-bar"></div>
        </div>
        <div class="sheet-header">
          <h3>收藏的城市</h3>
          <span class="sheet-count">{{ cities().length }} 个城市</span>
        </div>
        <div class="sheet-list">
          @for (city of cities(); track city.id) {
            <div
              class="sheet-city-row"
              [class.active]="activeId() === city.id"
              (click)="selectCity(city); toggleSheet()"
            >
              <span class="row-icon">{{ city.icon }}</span>
              <div class="row-info">
                <span class="row-name">{{ city.name }}</span>
                <span class="row-country">{{ city.country }}</span>
              </div>
              <div class="row-right">
                <span class="row-temp">{{ city.temp }}°</span>
                <span class="row-text">{{ city.text }}</span>
                @if (city.aqi) {
                  <span class="row-aqi" [style.color]="aqiLevel(city.aqi).color">
                    AQI {{ city.aqi }}
                  </span>
                }
              </div>
            </div>
          }
        </div>
      </div>
    </div>
  `,
  styles: `
    /* ---- 共用 ---- */
    .desktop-only {
      display: block;
    }
    .mobile-only {
      display: none;
    }

    @media (max-width: 768px) {
      .desktop-only {
        display: none !important;
      }
      .mobile-only {
        display: block;
      }
    }

    /* ===== 桌面收藏条 ===== */
    .fav-bar {
      margin-bottom: 24px;
    }
    .fav-bar-inner {
      display: flex;
      gap: 12px;
      overflow-x: auto;
      padding-bottom: 12px;
      padding-top: 4px;
      scrollbar-width: thin;
      scrollbar-color: transparent transparent;
      &:hover {
        scrollbar-color: rgba(255, 255, 255, 0.25) rgba(255, 255, 255, 0.04);
        &::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.25);
          background-clip: padding-box;
        }
      }
      &::-webkit-scrollbar {
        height: 6px;
      }
      &::-webkit-scrollbar-track {
        background: transparent;
        border-radius: 6px;
      }
      &::-webkit-scrollbar-thumb {
        background: transparent;
        border-radius: 6px;
        border: 2px solid transparent;
        background-clip: padding-box;
        transition: background 0.2s;
      }
    }

    .city-card {
      flex: 0 0 auto;
      width: 110px;
      background: var(--surface-color);
      border: 1px solid var(--item-border);
      border-radius: 18px;
      padding: 14px 12px;
      cursor: pointer;
      transition: var(--transition);
      display: flex;
      flex-direction: column;
      gap: 5px;
      position: relative;
      overflow: hidden;
      box-shadow: var(--glass-shadow);

      &::before {
        content: '';
        position: absolute;
        inset: 0;
        background: linear-gradient(135deg, rgba(255, 255, 255, 0.3), transparent);
        opacity: 0;
        transition: opacity 0.25s;
        pointer-events: none;
      }

      &:hover {
        border-color: var(--border-hover);
        transform: translateY(-3px);
        background: var(--surface-hover);
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
        &::before {
          opacity: 1;
        }
      }

      &.active {
        border-color: var(--accent-color);
        background: var(--surface-hover);
        box-shadow:
          0 0 0 1px rgba(14, 165, 233, 0.3),
          0 8px 24px rgba(14, 165, 233, 0.15);
        &::before {
          opacity: 1;
        }
      }
    }

    .city-card-top {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .city-icon {
      font-size: 1.4rem;
      line-height: 1;
    }
    .city-temp {
      font-size: 1.25rem;
      font-weight: 700;
    }
    .city-name {
      font-size: 0.875rem;
      font-weight: 600;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .city-meta {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .city-text {
      font-size: 0.75rem;
      color: var(--text-muted);
    }
    .city-aqi {
      font-size: 0.7rem;
      font-weight: 600;
    }
    .city-range {
      font-size: 0.7rem;
      color: var(--text-muted);
      margin-top: 2px;
    }

    /* ===== 移动端收藏触发按钮 ===== */
    .fav-trigger {
      position: fixed;
      bottom: 24px;
      right: 20px;
      z-index: 100;
      display: flex;
      align-items: center;
      gap: 8px;
      background: var(--fav-btn-gradient);
      border: none;
      border-radius: 50px;
      padding: 12px 18px;
      color: #fff;
      font-weight: 600;
      font-size: 0.875rem;
      cursor: pointer;
      box-shadow: 0 4px 20px rgba(59, 130, 246, 0.4);
      transition: all 0.3s cubic-bezier(0.25, 1, 0.5, 1);
      &:hover {
        transform: scale(1.05);
        box-shadow: 0 6px 28px rgba(59, 130, 246, 0.6);
      }
      &:active {
        transform: scale(0.97);
      }
    }
    .fav-trigger-icon {
      font-size: 1.1rem;
    }
    .fav-trigger-label {
      font-size: 0.875rem;
    }
    .fav-count {
      background: rgba(255, 255, 255, 0.25);
      border-radius: 20px;
      padding: 1px 8px;
      font-size: 0.75rem;
    }

    /* ===== 遮罩 ===== */
    .sheet-backdrop {
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.5);
      z-index: 200;
      backdrop-filter: blur(4px);
      animation: fadeIn 0.2s ease;
    }
    @keyframes fadeIn {
      from {
        opacity: 0;
      }
      to {
        opacity: 1;
      }
    }

    /* ===== 底部抽屉 ===== */
    .fav-sheet {
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      z-index: 300;
      background: var(--sheet-bg);
      backdrop-filter: blur(24px);
      -webkit-backdrop-filter: blur(24px);
      border-top: 1px solid var(--item-border);
      border-radius: 24px 24px 0 0;
      transform: translateY(100%);
      transition: transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
      max-height: 75dvh;
      display: flex;
      flex-direction: column;
      box-shadow: 0 -8px 40px rgba(0, 0, 0, 0.1);

      &.open {
        transform: translateY(0);
      }
    }

    .sheet-handle {
      padding: 12px;
      display: flex;
      justify-content: center;
      cursor: pointer;
    }
    .handle-bar {
      width: 40px;
      height: 4px;
      background: var(--item-border);
      border-radius: 4px;
      transition: background 0.2s;
      .sheet-handle:hover & {
        background: rgba(0, 0, 0, 0.15);
      }
    }

    .sheet-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0 20px 12px;
      h3 {
        font-size: 1.125rem;
        font-weight: 700;
        margin: 0;
      }
    }
    .sheet-count {
      font-size: 0.8rem;
      color: var(--text-muted);
      background: var(--item-bg);
      padding: 3px 10px;
      border-radius: 20px;
    }

    .sheet-list {
      flex: 1;
      overflow-y: auto;
      padding: 0 12px 24px;
      display: flex;
      flex-direction: column;
      gap: 6px;
      scrollbar-width: none;
      &::-webkit-scrollbar {
        display: none;
      }
    }

    .sheet-city-row {
      display: flex;
      align-items: center;
      gap: 14px;
      padding: 14px 16px;
      border-radius: 16px;
      cursor: pointer;
      transition: var(--transition);
      border: 1px solid transparent;

      &:hover {
        background: var(--item-bg-hover);
        border-color: var(--item-border);
      }
      &.active {
        background: var(--surface-color);
        border-color: var(--accent-light);
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.03);
      }
    }
    .row-icon {
      font-size: 1.75rem;
      flex: 0 0 auto;
    }
    .row-info {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 2px;
    }
    .row-name {
      font-size: 1rem;
      font-weight: 600;
    }
    .row-country {
      font-size: 0.75rem;
      color: var(--text-muted);
    }
    .row-right {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      gap: 3px;
    }
    .row-temp {
      font-size: 1.25rem;
      font-weight: 700;
    }
    .row-text {
      font-size: 0.75rem;
      color: var(--text-muted);
    }
    .row-aqi {
      font-size: 0.7rem;
      font-weight: 600;
    }
  `,
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
