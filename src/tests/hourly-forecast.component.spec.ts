import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HourlyForecastComponent } from '@/app/shared/components/hourly-forecast.component';

describe('小时预报组件', () => {
  let fixture: ComponentFixture<HourlyForecastComponent>;
  let component: HourlyForecastComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HourlyForecastComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(HourlyForecastComponent);
    component = fixture.componentInstance;
  });

  it('formatTime 应返回 HH:mm 格式', () => {
    expect(component.formatTime('2026-04-10 09:30:00')).toBe('09:30');
  });

  it('formatTime 应保留前导零', () => {
    expect(component.formatTime('2026-04-10 01:05:00')).toBe('01:05');
  });
});
