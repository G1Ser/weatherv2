import { Component, signal } from '@angular/core';
import { WeatherDashboardComponent } from './components/weather-dashboard.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  standalone: true,
  imports: [WeatherDashboardComponent],
})
export class App {
  protected readonly title = signal('angular-demo');
}
