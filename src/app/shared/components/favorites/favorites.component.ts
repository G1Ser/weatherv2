import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
  signal,
} from '@angular/core';
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
}

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
  templateUrl: './favorites.component.html',
  styleUrl: './favorites.component.scss',
})
export class FavoritesComponent {
  @Input() activeId = '';
  @Input() cities: FavoriteCity[] = [];
  @Output() citySelected = new EventEmitter<FavoriteCity>();

  readonly sheetOpen = signal(false);
  readonly aqiLevel = getAqiLevel;

  selectCity(city: FavoriteCity) {
    this.citySelected.emit(city);
  }

  toggleSheet() {
    this.sheetOpen.update(v => !v);
  }
}
