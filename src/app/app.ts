import {
  AfterViewInit,
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
  inject,
  signal,
} from '@angular/core';
import { WeatherDashboardComponent } from './shared/components/weather-dashboard/weather-dashboard.component';
import { IpStoreService } from './core/store/ip-store.service';
import { localStorageUtil } from './shared/utils/storage';
import { BmapService } from '@/api/bmap';
import { showToast } from '@/lib/toast';
import type { IntroScroll } from '@/lib/introScroll';

type NavigateStorageType = 'unknown' | 'yes' | 'no';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.scss',
  standalone: true,
  imports: [WeatherDashboardComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA], //允许写非Angular组件
})
export class App implements OnInit, AfterViewInit, OnDestroy {
  private readonly NAVIGATE_KEY = 'isNavigate';
  private readonly ipStore = inject(IpStoreService);
  private readonly bmapService = inject(BmapService);
  private readonly handleIntroBurn = () => {
    this.showPage.set(true);
  };

  @ViewChild('introRef')
  introRef?: ElementRef<HTMLElement & IntroScroll>;

  protected readonly showIntro = signal(true);
  protected readonly showPage = signal(false);

  ngOnInit() {
    const isNavigate = localStorageUtil.get<NavigateStorageType>(this.NAVIGATE_KEY, 'unknown');
    if (isNavigate !== 'unknown') {
      this.showIntro.set(false);
      this.showPage.set(true);
    } else {
      this.loadIntroScroll();
    }
    if (isNavigate === 'no') {
      this.getLocal();
    }
    if (isNavigate === 'yes') {
      this.navigateCurrentLocation();
    }
  }

  ngAfterViewInit() {
    this.introRef?.nativeElement.addEventListener('burn', this.handleIntroBurn);
  }

  ngOnDestroy() {
    this.introRef?.nativeElement.removeEventListener('burn', this.handleIntroBurn);
  }

  handleReject() {
    localStorageUtil.set<NavigateStorageType>(this.NAVIGATE_KEY, 'no');
    this.getLocal();
    this.destroyScroll();
  }

  handleReceive() {
    this.navigateCurrentLocation();
    this.destroyScroll();
  }

  private destroyScroll() {
    this.introRef?.nativeElement.ignite();
  }

  private async loadIntroScroll() {
    await import('@/lib/introScroll');
  }

  private async getLocal(longitude?: number, latitude?: number) {
    const res = await this.bmapService.getIp(longitude, latitude);
    const { name_zh, lon, lat } = res;
    this.ipStore.updateLocation({ name_zh, lon, lat });
  }

  private navigateCurrentLocation() {
    const geolocation = navigator.geolocation;
    if (!geolocation) {
      showToast('当前浏览器不支持本地定位', 'error');
      localStorageUtil.set<NavigateStorageType>(this.NAVIGATE_KEY, 'no');
      return;
    }
    geolocation.getCurrentPosition(
      pos => {
        localStorageUtil.set<NavigateStorageType>(this.NAVIGATE_KEY, 'yes');
        const { latitude, longitude } = pos.coords;
        this.getLocal(longitude, latitude);
      },
      err => {
        showToast(`定位失败${err.message}`, 'error');
        localStorageUtil.set<NavigateStorageType>(this.NAVIGATE_KEY, 'no');
        this.getLocal();
      },
      {
        enableHighAccuracy: true,
        timeout: 20 * 1000,
        maximumAge: 10 * 1000,
      },
    );
  }
}
