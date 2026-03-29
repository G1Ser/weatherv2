import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import type { FavoriteType } from '@/app/types/bmap';

@Component({
  selector: 'app-favorites',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="desktop-only favorites-panel" aria-label="常用城市">
      <div class="favorites-header">
        <div class="favorites-heading">
          <div class="favorites-title-row">
            <h3>常用城市</h3>
            <span class="favorites-count">{{ cities.length }}</span>
          </div>
        </div>
      </div>

      <div class="favorites-rail" role="list">
        @for (city of cities; track city.id; let index = $index) {
          <button
            class="favorite-card"
            type="button"
            [class.active]="activeId === city.id"
            [attr.title]="city.name"
            [attr.aria-pressed]="activeId === city.id"
            (click)="selectCity(city)"
          >
            <span class="favorite-card-top">
              <span class="favorite-card-tag">
                {{ activeId === city.id ? 'ACTIVE' : index === 0 ? 'LOCAL' : 'SAVED' }}
              </span>
            </span>
            <span class="favorite-name">{{ city.name }}</span>
            <span class="favorite-card-accent" aria-hidden="true"></span>
          </button>
        }
      </div>
    </section>

    <div class="mobile-only">
      <button
        class="mobile-trigger"
        type="button"
        [attr.aria-expanded]="sheetOpen()"
        aria-controls="favorites-sheet"
        (click)="toggleSheet()"
      >
        <span class="mobile-trigger-icon" aria-hidden="true">★</span>
        <span class="mobile-trigger-copy">
          <span class="mobile-trigger-label">常用城市</span>
        </span>
        <span class="mobile-trigger-count">{{ cities.length }}</span>
      </button>

      @if (sheetOpen()) {
        <div
          class="sheet-backdrop"
          role="button"
          tabindex="-1"
          aria-label="关闭常用城市面板"
          (click)="toggleSheet()"
          (keydown.enter)="toggleSheet()"
        ></div>
      }

      <section id="favorites-sheet" class="favorites-sheet" [class.open]="sheetOpen()">
        <button class="sheet-handle" type="button" (click)="toggleSheet()">
          <span class="handle-bar"></span>
        </button>

        <div class="sheet-header">
          <div class="favorites-heading">
            <div class="favorites-title-row">
              <h3>常用城市</h3>
              <span class="favorites-count">{{ cities.length }}</span>
            </div>
          </div>
        </div>

        <div class="sheet-list">
          @for (city of cities; track city.id; let index = $index) {
            <button
              class="sheet-item"
              type="button"
              [class.active]="activeId === city.id"
              [attr.aria-pressed]="activeId === city.id"
              (click)="selectFromSheet(city)"
            >
              <span class="sheet-item-leading">
                <span class="sheet-item-copy">
                  <span class="sheet-item-name">{{ city.name }}</span>
                </span>
              </span>
              <span class="sheet-item-state">{{ activeId === city.id ? 'ACTIVE' : 'OPEN' }}</span>
            </button>
          }
        </div>
      </section>
    </div>
  `,
  styles: `
    .desktop-only {
      display: block;
    }

    .mobile-only {
      display: none;
    }

    .favorites-panel {
      position: relative;
      margin-bottom: 20px;
      padding: 18px;
      overflow: hidden;
      border: 1px solid color-mix(in srgb, var(--accent-color) 10%, var(--item-border));
      border-radius: 28px;
      background: var(--fav-panel-bg);
      box-shadow: var(--fav-panel-shadow);
    }

    .favorites-header,
    .sheet-header,
    .favorites-title-row,
    .sheet-item-leading,
    .sheet-item-copy,
    .mobile-trigger,
    .mobile-trigger-copy {
      display: flex;
      align-items: center;
    }

    .favorites-header,
    .sheet-header {
      justify-content: space-between;
      gap: 16px;
      margin-bottom: 16px;
    }

    .favorites-heading {
      min-width: 0;
    }

    .favorites-title-row {
      gap: 10px;
      flex-wrap: wrap;
    }

    .favorites-header h3,
    .sheet-header h3 {
      margin: 0;
      font-size: 1.1rem;
      font-weight: 700;
      color: var(--text-color);
      letter-spacing: 0.02em;
    }

    .favorites-count {
      min-width: 30px;
      padding: 4px 10px;
      border: 1px solid color-mix(in srgb, var(--accent-color) 12%, var(--item-border));
      border-radius: 999px;
      background: color-mix(in srgb, var(--surface-color) 72%, transparent);
      color: var(--text-color);
      font-size: 0.74rem;
      font-weight: 700;
      text-align: center;
    }

    .favorites-glow {
      position: relative;
      flex: 0 0 96px;
      width: 96px;
      height: 96px;
      pointer-events: none;
      filter: saturate(1.1);
    }

    .glow-orbit,
    .glow-core {
      position: absolute;
      inset: 0;
      border-radius: 50%;
    }

    .glow-orbit-a {
      border: 1px solid color-mix(in srgb, var(--accent-color) 28%, transparent);
      transform: rotate(14deg) scale(1);
    }

    .glow-orbit-b {
      inset: 12px;
      border: 1px dashed color-mix(in srgb, var(--accent-color) 24%, transparent);
      transform: rotate(-18deg);
    }

    .glow-core {
      inset: 24px;
      background:
        radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.9), transparent 44%),
        radial-gradient(
          circle at 65% 70%,
          color-mix(in srgb, var(--accent-color) 52%, transparent),
          transparent 72%
        ),
        color-mix(in srgb, var(--accent-color) 14%, transparent);
      box-shadow: 0 0 24px color-mix(in srgb, var(--accent-color) 18%, transparent);
    }

    .favorites-rail {
      display: flex;
      gap: 12px;
      overflow-x: auto;
      padding: 4px 2px 8px;
      scroll-snap-type: x proximity;
      scrollbar-width: thin;
      scrollbar-color: transparent transparent;
    }

    .favorites-rail::-webkit-scrollbar {
      height: 6px;
    }

    .favorites-rail::-webkit-scrollbar-thumb {
      background: transparent;
      border-radius: 999px;
    }

    .favorites-rail:hover {
      scrollbar-color: rgba(148, 163, 184, 0.4) transparent;
    }

    .favorites-rail:hover::-webkit-scrollbar-thumb {
      background: rgba(148, 163, 184, 0.4);
    }

    .favorite-card {
      position: relative;
      flex: 0 0 auto;
      min-width: 172px;
      padding: 16px;
      overflow: hidden;
      border: 1px solid color-mix(in srgb, var(--item-border) 92%, var(--accent-color) 8%);
      border-radius: 22px;
      background: var(--fav-card-bg);
      color: var(--text-color);
      text-align: left;
      font: inherit;
      cursor: pointer;
      scroll-snap-align: start;
      transition:
        border-color 0.2s ease,
        background 0.2s ease,
        transform 0.2s ease,
        box-shadow 0.2s ease,
        filter 0.2s ease;
    }

    .favorite-card:hover {
      background: var(--fav-card-hover-bg);
      border-color: color-mix(in srgb, var(--accent-color) 28%, var(--item-border));
      transform: translateY(-2px);
      box-shadow: 0 16px 28px rgba(15, 23, 42, 0.1);
      filter: saturate(1.03);
    }

    .favorite-card:focus-visible,
    .mobile-trigger:focus-visible,
    .sheet-handle:focus-visible,
    .sheet-item:focus-visible {
      outline: 2px solid color-mix(in srgb, var(--accent-color) 60%, white);
      outline-offset: 2px;
    }

    .favorite-card.active {
      border-color: color-mix(in srgb, var(--accent-color) 34%, var(--item-border));
      background: var(--fav-card-active-bg);
      box-shadow: var(--fav-card-active-shadow);
    }

    .favorite-card-top {
      display: flex;
      justify-content: flex-end;
      margin-bottom: 14px;
    }

    .favorite-card-tag,
    .sheet-item-state {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      min-width: 58px;
      padding: 4px 10px;
      border: 1px solid color-mix(in srgb, var(--accent-color) 14%, var(--item-border));
      border-radius: 999px;
      background: color-mix(in srgb, var(--surface-color) 70%, transparent);
      color: var(--text-color);
      font-size: 0.68rem;
      font-weight: 700;
      letter-spacing: 0.12em;
      text-transform: uppercase;
    }

    .favorite-name,
    .sheet-item-name {
      display: block;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      font-size: 1rem;
      font-weight: 600;
    }

    .favorite-card-accent {
      position: absolute;
      right: -12px;
      bottom: -10px;
      width: 72px;
      height: 72px;
      border-radius: 50%;
      background: radial-gradient(
        circle,
        color-mix(in srgb, var(--accent-color) 24%, transparent) 0%,
        transparent 68%
      );
      opacity: var(--fav-card-accent-opacity);
      pointer-events: none;
    }

    .mobile-trigger {
      position: fixed;
      right: 16px;
      bottom: 24px;
      z-index: 100;
      justify-content: center;
      gap: 12px;
      min-height: 44px;
      padding: 8px 14px;
      border: 1px solid var(--fav-mobile-border);
      border-radius: 999px;
      background: var(--fav-mobile-bg);
      color: var(--fav-mobile-text);
      font: inherit;
      font-weight: 600;
      cursor: pointer;
      box-shadow: var(--fav-mobile-shadow);
      transition:
        transform 0.2s ease,
        box-shadow 0.2s ease,
        filter 0.2s ease;
    }

    .mobile-trigger:hover {
      transform: translateY(-1px);
      background: var(--fav-card-hover-bg);
      border-color: color-mix(in srgb, var(--accent-color) 22%, var(--item-border));
      box-shadow: 0 16px 28px rgba(15, 23, 42, 0.12);
    }

    .mobile-trigger-icon {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 16px;
      height: 16px;
      flex: 0 0 16px;
      color: var(--fav-mobile-star);
      font-size: 0.95rem;
      line-height: 1;
      text-shadow: 0 0 14px rgba(255, 226, 122, 0.45);
    }

    .mobile-trigger-copy {
      line-height: 1;
    }

    .mobile-trigger-label {
      font-size: 0.88rem;
      font-weight: 700;
      line-height: 1;
    }

    .mobile-trigger-count {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      min-width: 24px;
      height: 24px;
      padding: 0 8px;
      border-radius: 999px;
      background: var(--fav-mobile-count-bg);
      color: var(--fav-mobile-text);
      font-size: 0.74rem;
      font-weight: 700;
      line-height: 1;
      text-align: center;
    }

    .sheet-backdrop {
      position: fixed;
      inset: 0;
      z-index: 200;
      background: rgba(15, 23, 42, 0.44);
      backdrop-filter: blur(4px);
    }

    .favorites-sheet {
      position: fixed;
      inset-inline: 0;
      bottom: 0;
      z-index: 300;
      max-height: 72dvh;
      padding: 0 0 18px;
      border-top: 1px solid color-mix(in srgb, var(--accent-color) 10%, var(--item-border));
      border-radius: 28px 28px 0 0;
      background: var(--fav-panel-bg);
      backdrop-filter: blur(24px);
      -webkit-backdrop-filter: blur(24px);
      box-shadow: 0 -18px 40px rgba(15, 23, 42, 0.2);
      transform: translateY(100%);
      transition: transform 0.28s ease;
    }

    .favorites-sheet.open {
      transform: translateY(0);
    }

    .sheet-handle {
      display: flex;
      justify-content: center;
      width: 100%;
      padding: 12px;
      border: none;
      background: transparent;
      cursor: pointer;
    }

    .handle-bar {
      width: 42px;
      height: 4px;
      border-radius: 999px;
      background: color-mix(in srgb, var(--text-muted) 28%, transparent);
    }

    .sheet-header {
      padding: 2px 18px 5px;
    }

    .sheet-list {
      display: flex;
      flex-direction: column;
      gap: 10px;
      overflow-y: auto;
      padding: 2px 12px;
    }

    .sheet-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      width: 100%;
      padding: 14px 16px;
      border: 1px solid color-mix(in srgb, var(--item-border) 92%, var(--accent-color) 8%);
      border-radius: 20px;
      background: var(--fav-card-bg);
      color: var(--text-color);
      text-align: left;
      font: inherit;
      cursor: pointer;
      transition:
        border-color 0.2s ease,
        background 0.2s ease,
        transform 0.2s ease;
    }

    .sheet-item:hover {
      background: var(--fav-card-hover-bg);
      border-color: color-mix(in srgb, var(--accent-color) 26%, var(--item-border));
      transform: translateY(-1px);
    }

    .sheet-item.active {
      background: var(--fav-card-active-bg);
      border-color: color-mix(in srgb, var(--accent-color) 34%, var(--item-border));
      box-shadow: var(--fav-card-active-shadow);
    }

    .sheet-item-state {
      flex: 0 0 auto;
    }

    @media (prefers-reduced-motion: reduce) {
      .favorite-card,
      .mobile-trigger,
      .favorites-sheet,
      .sheet-item {
        transition: none;
      }
    }

    @media (max-width: 768px) {
      .desktop-only {
        display: none !important;
      }

      .mobile-only {
        display: block;
      }

      .favorites-sheet {
        max-height: min(78dvh, 640px);
      }
    }

    @media (max-width: 420px) {
      .mobile-trigger {
        right: 12px;
        bottom: 18px;
      }
    }
  `,
})
export class FavoritesComponent {
  @Input() activeId = '';
  @Input() cities: FavoriteType[] = [];
  @Output() citySelected = new EventEmitter<FavoriteType>();

  readonly sheetOpen = signal(false);

  selectCity(city: FavoriteType) {
    this.citySelected.emit(city);
  }

  selectFromSheet(city: FavoriteType) {
    this.citySelected.emit(city);
    this.sheetOpen.set(false);
  }

  toggleSheet() {
    this.sheetOpen.update(v => !v);
  }
}
