import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { retry, throwError, timeout, timer } from 'rxjs';

/**
 * Adds JSON headers to outgoing form submissions and fails after 15 s instead
 * of hanging on a slow 4G link. Retries once, but only when the request never
 * reached the server (status 0), so an enquiry is never submitted twice.
 */
export const apiInterceptor: HttpInterceptorFn = (req, next) => {
  const json = req.clone({
    setHeaders: { Accept: 'application/json', 'Content-Type': 'application/json' },
  });
  return next(json).pipe(
    timeout(15000),
    retry({
      count: 1,
      delay: (err: unknown) =>
        err instanceof HttpErrorResponse && err.status === 0 ? timer(1200) : throwError(() => err),
    }),
  );
};
