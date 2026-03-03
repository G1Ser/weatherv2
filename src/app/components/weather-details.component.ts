import { Component, ChangeDetectionStrategy, input } from '@angular/core';
import { CurrentWeather } from '../types/weather';

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
        <span class="label">紫外线指数</span>
        <span class="value">{{ weather().uvi }}</span>
      </div>
      <div class="detail-item">
        <span class="label">风向风速</span>
        <span class="value">{{ weather().wind_dir }} {{ weather().wind_class }}</span>
      </div>
      <div class="detail-item">
        <span class="label">气压</span>
        <span class="value">{{ weather().pressure }} hPa</span>
      </div>
      <div class="detail-item">
        <span class="label">能见度</span>
        <span class="value">{{ weather().vis / 1000 }} km</span>
      </div>
      <div class="detail-item">
        <span class="label">湿度</span>
        <span class="value">{{ weather().rh }}%</span>
      </div>
      <div class="detail-item">
        <span class="label">露点</span>
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
      grid-template-columns: repeat(2, 1fr);
      gap: 16px;
    }
    .detail-item {
      display: flex;
      flex-direction: column;
      gap: 4px;
      padding: 12px;
      background: rgba(255, 255, 255, 0.03);
      border-radius: var(--radius-sm);
    }
    .label {
      font-size: 0.875rem;
      color: var(--text-muted);
    }
    .value {
      font-size: 1.25rem;
      font-weight: 500;
    }
  `,
})
export class WeatherDetailsComponent {
  weather = input.required<CurrentWeather>();
}
