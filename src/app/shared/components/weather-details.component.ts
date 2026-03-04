import { Component, ChangeDetectionStrategy, input } from '@angular/core';
import { CurrentWeather } from '@/app/types/weather';

@Component({
  selector: 'app-weather-details',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'glass-card weather-details',
  },
  template: `
    <h3>详细信息</h3>
    <div class="grid">
      <div class="detail-item">
        <span class="label">☀️ 紫外线指数</span>
        <span class="value">{{ weather().uvi }}</span>
      </div>
      <div class="detail-item">
        <span class="label">💨 风向风速</span>
        <span class="value">{{ weather().wind_dir }} {{ weather().wind_class }}</span>
      </div>
      <div class="detail-item">
        <span class="label">🧭 气压</span>
        <span class="value">{{ weather().pressure }} hPa</span>
      </div>
      <div class="detail-item">
        <span class="label">👁️ 能见度</span>
        <span class="value">{{ weather().vis / 1000 }} km</span>
      </div>
      <div class="detail-item">
        <span class="label">💧 湿度</span>
        <span class="value">{{ weather().rh }}%</span>
      </div>
      <div class="detail-item">
        <span class="label">🌡️ 露点</span>
        <span class="value">{{ weather().dpt }}&deg;</span>
      </div>
    </div>
  `,
  styles: `
    :host {
      display: block;
      padding: 24px;
    }
    h3 {
      font-size: 1.125rem;
      font-weight: 600;
      margin: 0 0 16px;
      color: var(--text-muted);
    }
    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(130px, 1fr));
      gap: 12px 16px;
    }
    .detail-item {
      display: flex;
      flex-direction: column;
      gap: 6px;
      padding: 14px 16px;
      background: var(--item-bg);
      border: 1px solid var(--item-border);
      border-radius: 16px;
      transition: all 0.2s ease;
      &:hover {
        background: var(--item-bg-hover);
      }
    }
    .label {
      font-size: 0.8rem;
      color: var(--text-muted);
      display: flex;
      align-items: center;
      gap: 6px;
    }
    .value {
      font-size: 1.25rem;
      font-weight: 600;
      color: var(--text-color);
      margin-top: 4px;
    }
  `,
})
export class WeatherDetailsComponent {
  weather = input.required<CurrentWeather>();
}
