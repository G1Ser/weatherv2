import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { catchError, throwError, timeout, TimeoutError } from 'rxjs';
import { showToast } from '@/lib/g1-components.es';
import { environment } from '@/environments/environment.dev';

const REQUEST_TIMEOUT = 10000;

export const httpInterceptor: HttpInterceptorFn = (req, next) => {
  const url = req.url.startsWith('http')
    ? req.url
    : `${environment.ANGULAR_APP_BMAP_API}${req.url}`;

  const apiReq = req.clone({ url });

  return next(apiReq).pipe(
    timeout(REQUEST_TIMEOUT),
    catchError((error: HttpErrorResponse | TimeoutError) => {
      if (error instanceof TimeoutError) {
        showToast('网络波动，请稍后重试', 'error');
      } else if (error.status === 0) {
        showToast('网络连接失败', 'error');
      } else {
        showToast('请求失败', 'error');
      }
      return throwError(() => error);
    }),
  );
};
