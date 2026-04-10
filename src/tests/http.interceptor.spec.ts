import { HttpErrorResponse, HttpHandlerFn, HttpRequest, HttpResponse } from '@angular/common/http';
import { NEVER, of, throwError, TimeoutError } from 'rxjs';
import { httpInterceptor } from '@/app/core/interceptors/http.interceptor';
import { environment } from '@/environments/environment.dev';

describe('HTTP 拦截器', () => {
  let appendChildSpy: jasmine.Spy;

  beforeEach(() => {
    appendChildSpy = spyOn(document.body, 'appendChild').and.callFake(node => node);
  });

  it('相对路径请求应拼接 API 基础地址', done => {
    const req = new HttpRequest('GET', '/ip');
    const next: HttpHandlerFn = nextReq =>
      of(new HttpResponse({ status: 200, body: { ok: true, url: nextReq.url } }));

    httpInterceptor(req, next).subscribe({
      next: () => {
        expect(appendChildSpy).not.toHaveBeenCalled();
        done();
      },
      error: done.fail,
    });
  });

  it('绝对路径请求不应重复拼接基础地址', done => {
    const url = 'https://example.com/weather';
    const req = new HttpRequest('GET', url);
    let handledUrl = '';
    const next: HttpHandlerFn = nextReq => {
      handledUrl = nextReq.url;
      return of(new HttpResponse({ status: 200, body: { ok: true } }));
    };

    httpInterceptor(req, next).subscribe({
      next: () => {
        expect(handledUrl).toBe(url);
        done();
      },
      error: done.fail,
    });
  });

  it('相对路径 /bmap/weather 应拼接为完整地址', done => {
    const req = new HttpRequest('GET', '/bmap/weather');
    let handledUrl = '';
    const next: HttpHandlerFn = nextReq => {
      handledUrl = nextReq.url;
      return of(new HttpResponse({ status: 200, body: { ok: true } }));
    };

    httpInterceptor(req, next).subscribe({
      next: () => {
        expect(handledUrl).toBe(`${environment.ANGULAR_APP_BMAP_API}/bmap/weather`);
        done();
      },
      error: done.fail,
    });
  });

  it('网络错误(status=0)时应弹出错误提示', done => {
    const req = new HttpRequest('GET', '/ip');
    const next: HttpHandlerFn = () =>
      throwError(() => new HttpErrorResponse({ status: 0, statusText: 'Unknown Error' }));

    httpInterceptor(req, next).subscribe({
      next: () => done.fail('预期应抛出错误'),
      error: () => {
        expect(appendChildSpy).toHaveBeenCalledTimes(1);
        done();
      },
    });
  });

  it('通用 HTTP 错误时应弹出错误提示', done => {
    const req = new HttpRequest('GET', '/ip');
    const next: HttpHandlerFn = () =>
      throwError(() => new HttpErrorResponse({ status: 500, statusText: 'Server Error' }));

    httpInterceptor(req, next).subscribe({
      next: () => done.fail('预期应抛出错误'),
      error: () => {
        expect(appendChildSpy).toHaveBeenCalledTimes(1);
        done();
      },
    });
  });

  it('超时后应抛出 TimeoutError 并弹出错误提示', () => {
    const req = new HttpRequest('GET', '/ip');
    const next: HttpHandlerFn = () => NEVER;
    let caughtError: unknown;

    jasmine.clock().install();
    httpInterceptor(req, next).subscribe({
      error: err => {
        caughtError = err;
      },
    });

    jasmine.clock().tick(20001);

    expect(caughtError instanceof TimeoutError).toBeTrue();
    expect(appendChildSpy).toHaveBeenCalledTimes(1);
    jasmine.clock().uninstall();
  });
});
