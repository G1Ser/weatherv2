import { Component, ChangeDetectionStrategy, input } from '@angular/core';

@Component({
  selector: 'app-aqi',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'glass-card aqi',
  },
  template: `
    <h3>空气质量</h3>
    <div class="aqi-main">
      <div class="circle">
        <span class="value">{{ aqi() }}</span>
        <span class="label">AQI</span>
      </div>
      <div class="pollutants">
        <div class="item">
          <span>PM2.5</span><span>{{ pm25() }}</span>
        </div>
        <div class="item">
          <span>PM10</span><span>{{ pm10() }}</span>
        </div>
        <div class="item">
          <span>O3</span><span>{{ o3() }}</span>
        </div>
        <div class="item">
          <span>NO2</span><span>{{ no2() }}</span>
        </div>
        <div class="item">
          <span>SO2</span><span>{{ so2() }}</span>
        </div>
        <div class="item">
          <span>CO</span><span>{{ co() }}</span>
        </div>
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
    .aqi-main {
      display: flex;
      align-items: center;
      gap: 24px;
    }
    .circle {
      width: 100px;
      height: 100px;
      border-radius: 50%;
      border: 6px solid var(--accent-color);
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      background: rgba(34, 197, 94, 0.1);
      .value {
        font-size: 2rem;
        font-weight: 700;
        line-height: 1;
        color: var(--accent-color);
      }
      .label {
        font-size: 0.75rem;
        color: var(--text-muted);
        margin-top: 4px;
      }
    }
    .pollutants {
      flex: 1;
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 8px 16px;
    }
    .item {
      display: flex;
      justify-content: space-between;
      font-size: 0.875rem;
      span:first-child {
        color: var(--text-muted);
      }
      span:last-child {
        font-weight: 500;
      }
    }
  `,
})
export class AqiComponent {
  aqi = input.required<number>();
  pm25 = input<number>(0);
  pm10 = input<number>(0);
  o3 = input<number>(0);
  no2 = input<number>(0);
  so2 = input<number>(0);
  co = input<number>(0);
}
