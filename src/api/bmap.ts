import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import type { IPData, WeatherData } from '@/app/types/bmap';

export interface WeatherParams {
  lon: number;
  lat: number;
  country: string;
}

@Injectable({ providedIn: 'root' })
export class BmapService {
  private http = inject(HttpClient);

  getIp() {
    return this.http.get<IPData>('/ip');
  }

  getWeather(params: WeatherParams) {
    return this.http.get<WeatherData>('/bmap/weather', {
      params: new HttpParams()
        .set('lon', params.lon)
        .set('lat', params.lat)
        .set('country', params.country),
    });
  }
}
