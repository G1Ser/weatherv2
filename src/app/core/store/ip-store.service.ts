import { Injectable, signal } from '@angular/core';

interface IPLocationStore {
  name_zh: string;
  lon: number | null;
  lat: number | null;
}

const DEFAULT_LOCATION = {
  name_zh: '',
  lon: null,
  lat: null,
};

@Injectable({ providedIn: 'root' })
export class IpStoreService {
  readonly location = signal<IPLocationStore>(DEFAULT_LOCATION);

  updateLocation(patch: Partial<IPLocationStore>) {
    this.location.update(prev => ({ ...prev, ...patch }));
  }
}
