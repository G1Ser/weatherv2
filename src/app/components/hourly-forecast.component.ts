import { Component, ChangeDetectionStrategy, input } from '@angular/core';
import { ForecastHourly } from '../types/weather';

@Component({
  selector: 'app-hourly-forecast',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'glass-card hourly-forecast',
  },
  template: `
    <h3>24小时预报</h3>
    <div class="scroll-container">
      @for (hour of forecasts(); track hour.data_time) {
        <div class="hour-item">
          <span class="time">{{ formatTime(hour.data_time) }}</span>
          <span class="cond">{{ hour.text }}</span>
          <span class="temp">{{ hour.temp_fc }}&deg;</span>
          <span class="pop" [style.opacity]="hour.pop ? 1 : 0">{{ hour.pop }}%</span>
        </div>
      }
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
    .scroll-container {
      display: flex;
      overflow-x: auto;
      gap: 24px;
      padding-bottom: 10px;
      scrollbar-width: thin;
      scrollbar-color: transparent transparent;
      transition: scrollbar-color 0.2s ease;
      &::-webkit-scrollbar {
        height: 10px;
      }
      &::-webkit-scrollbar-track {
        background: rgba(255, 255, 255, 0.04);
        border-radius: 8px;
      }
      &::-webkit-scrollbar-thumb {
        background: transparent;
        border-radius: 8px;
        border: 2px solid transparent;
        background-clip: padding-box;
        transition: background 0.2s ease;
      }
      &:hover {
        scrollbar-color: rgba(255, 255, 255, 0.35) rgba(255, 255, 255, 0.04);
        &::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.3);
          background-clip: padding-box;
        }
        &::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.5);
          background-clip: padding-box;
        }
      }
    }
    .hour-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 12px;
      min-width: 48px;
    }
    .time {
      font-size: 0.875rem;
      color: var(--text-muted);
    }
    .cond {
      font-size: 0.875rem;
    }
    .temp {
      font-weight: 600;
      font-size: 1.125rem;
    }
    .pop {
      font-size: 0.75rem;
      color: #3b82f6;
    }
  `,
})
export class HourlyForecastComponent {
  forecasts = input.required<ForecastHourly[]>();

  formatTime(dateTime: string): string {
    return dateTime.split(' ')[1].substring(0, 5);
  }
}
