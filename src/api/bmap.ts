import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import type { IPData, WeatherData } from '@/app/types/bmap';
import { firstValueFrom } from 'rxjs';

export interface WeatherParams {
  lon: number;
  lat: number;
  country: string;
}

@Injectable({ providedIn: 'root' })
export class BmapService {
  private http = inject(HttpClient);

  async getIp(lon?: number, lat?: number) {
    let params = new HttpParams();
    if (lon !== undefined) {
      params = params.set('lon', lon);
    }
    if (lat !== undefined) {
      params = params.set('lat', lat);
    }
    return await firstValueFrom(this.http.get<IPData>('/ip', { params }));
  }

  async getWeather(params: WeatherParams) {
    return await firstValueFrom(
      this.http.get<WeatherData>('/bmap/weather', {
        params: new HttpParams()
          .set('lon', params.lon)
          .set('lat', params.lat)
          .set('country', params.country),
      }),
    );
  }
}
