import { Component, ChangeDetectionStrategy, input, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import type { WeatherNowDataType } from '@/app/types/bmap';

@Component({
  selector: 'app-current-weather',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  host: {
    class: 'glass-card current-weather',
  },
  template: `
    <div class="top">
      <h2>{{ weather().name }}</h2>
    </div>
    <div class="main">
      <div class="temp-wrapper">
        <span class="temp">{{ weather().temp }}&deg;</span>
        <span class="feels-like">体感 {{ weather().feels_like }}&deg;</span>
      </div>
      <div class="condition">
        <g1-svg-icon [name]="weather().icon" size="96" />
        <div class="desc">{{ weather().text }}</div>
      </div>
    </div>
  `,
  styles: `
    :host {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      padding: 24px;
      gap: 16px;
      height: 100%;
      box-sizing: border-box;
    }
    .top {
      display: flex;
      justify-content: space-between;
      align-items: center;
      h2 {
        font-size: 1.5rem;
        font-weight: 600;
        margin: 0;
      }
      .country {
        color: var(--text-muted);
        font-size: 0.875rem;
      }
    }
    .main {
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      .temp-wrapper {
        display: flex;
        flex-direction: column;
      }
      .temp {
        font-size: 4rem;
        font-weight: 700;
        line-height: 1;
        margin-bottom: 8px;
        text-shadow: 0 0 10px rgba(255, 255, 255, 0.2);
      }
      .feels-like {
        color: var(--text-muted);
        font-size: 0.875rem;
      }
      .condition {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 8px;
        .desc {
          font-size: 1.25rem;
          font-weight: 500;
        }
      }
    }
  `,
})
export class CurrentWeatherComponent {
  weather = input.required<WeatherNowDataType>();
}
