import { Component, ChangeDetectionStrategy, input } from '@angular/core';
import { IndexData } from '../types/weather';

@Component({
  selector: 'app-life-indexes',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'glass-card life-indexes',
  },
  template: `
    <h3>生活指数</h3>
    <div class="list">
      @for (idx of indexes(); track idx.name) {
        <div class="index-item">
          <div class="header">
            <span class="name">{{ idx.name }}</span>
            <span class="brief highlight">{{ idx.brief }}</span>
          </div>
          <div class="detail">{{ idx.detail }}</div>
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
    .list {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 16px;
    }
    .index-item {
      padding: 12px;
      background: rgba(255, 255, 255, 0.03);
      border-radius: var(--radius-sm);
    }
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 6px;
    }
    .name {
      font-weight: 500;
      color: var(--text-muted);
    }
    .highlight {
      color: var(--accent-color);
      font-weight: 600;
      font-size: 0.875rem;
    }
    .detail {
      font-size: 0.8rem;
      line-height: 1.4;
      color: var(--text-color);
      opacity: 0.9;
    }

    @media (max-width: 600px) {
      .list {
        grid-template-columns: 1fr;
      }
    }
  `,
})
export class LifeIndexesComponent {
  indexes = input.required<IndexData[]>();
}
