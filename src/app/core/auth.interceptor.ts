import { HttpInterceptorFn } from '@angular/common/http';
import { API_URL, TOKEN_KEY } from './api.config';

/** Anexa o token JWT (Authorization: Bearer) nas chamadas para a API. */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  let token: string | null = null;
  try {
    token = localStorage.getItem(TOKEN_KEY);
  } catch {
    // localStorage indisponível
  }

  if (token && req.url.startsWith(API_URL)) {
    req = req.clone({ setHeaders: { Authorization: `Bearer ${token}` } });
  }
  return next(req);
};
