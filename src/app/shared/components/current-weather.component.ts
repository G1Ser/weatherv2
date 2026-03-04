import { Component, ChangeDetectionStrategy, input } from '@angular/core';
import { CurrentWeather, WeatherLocation } from '@/app/types/weather';

@Component({
  selector: 'app-current-weather',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'glass-card current-weather',
  },
  template: `
    <div class="top">
      <h2>{{ location().name }}, {{ location().city }}</h2>
      <span class="country">{{ location().country }}</span>
    </div>
    <div class="main">
      <div class="temp-wrapper">
        <span class="temp">{{ weather().temp }}&deg;</span>
        <span class="feels-like">体感 {{ weather().feels_like }}&deg;</span>
      </div>
      <div class="condition">
        <div class="icon">
          <!-- TODO: Load real icon based on weather().text -->
          <svg
            width="48"
            height="48"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path
              d="M17.5 19C19.9853 19 22 16.9853 22 14.5C22 12.1388 20.1873 10.2017 17.8767 10.0247C17.3888 6.62121 14.4691 4 11 4C7.13401 4 4 7.13401 4 11C2.34315 11 1 12.3431 1 14C1 15.6569 2.34315 17 4 17"
            />
            <path d="M12 11V15" />
            <path d="M16 13V15" />
            <path d="M8 13V15" />
          </svg>
        </div>
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
        .icon {
          color: var(--accent-color);
          animation: float 3s ease-in-out infinite;
        }
        .desc {
          font-size: 1.25rem;
          font-weight: 500;
        }
      }
    }

    @keyframes float {
      0% {
        transform: translateY(0);
      }
      50% {
        transform: translateY(-5px);
      }
      100% {
        transform: translateY(0);
      }
    }
  `,
})
export class CurrentWeatherComponent {
  weather = input.required<CurrentWeather>();
  location = input.required<WeatherLocation>();
}
