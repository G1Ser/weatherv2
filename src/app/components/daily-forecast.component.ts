import { Component, ChangeDetectionStrategy, input } from '@angular/core';
import { ForecastDaily } from '../types/weather';

@Component({
  selector: 'app-daily-forecast',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'glass-card daily-forecast',
  },
  template: `
    <h3>7日预报</h3>
    <div class="list">
      @for (day of forecasts(); track day.date) {
        <div class="day-item">
          <div class="day">{{ day.week }}</div>
          <div class="cond">{{ day.text_day }}</div>
          <div class="temps">
            <span class="low">{{ day.low }}&deg;</span>
            <div class="bar"></div>
            <span class="high">{{ day.high }}&deg;</span>
          </div>
        </div>
      }
    </div>
  `,
  styles: `
    :host {
      display: flex;
      flex-direction: column;
      padding: 24px;
      gap: 16px;
    }
    h3 {
      font-size: 1.125rem;
      font-weight: 600;
      margin: 0;
      color: var(--text-muted);
    }
    .list {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
    .day-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 8px 0;
      border-bottom: 1px solid var(--item-border);
      &:last-child {
        border-bottom: none;
      }
    }
    .day {
      width: 60px;
      font-weight: 500;
    }
    .cond {
      flex: 1;
      text-align: center;
      color: var(--text-muted);
    }
    .temps {
      display: flex;
      align-items: center;
      gap: 8px;
      width: 120px;
      justify-content: flex-end;
      .low {
        color: var(--text-muted);
      }
      .bar {
        height: 6px;
        flex: 1;
        background: linear-gradient(
          90deg,
          color-mix(in srgb, var(--text-color) 10%, transparent),
          color-mix(in srgb, var(--text-color) 40%, transparent)
        );
        border-radius: 4px;
      }
      .high {
        font-weight: 600;
      }
    }
  `,
})
export class DailyForecastComponent {
  forecasts = input.required<ForecastDaily[]>();
}
