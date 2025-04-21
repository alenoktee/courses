import { ApplicationConfig, inject, importProvidersFrom } from '@angular/core';
import { provideRouter, withViewTransitions } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { AuthService } from './services/auth.service';
import { RegisterStep2Component } from './pages/register/register-step2/register-step2.component';
import { provideAnimations } from '@angular/platform-browser/animations';
import { NZ_I18N, ru_RU } from 'ng-zorro-antd/i18n';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes, withViewTransitions()),
    provideHttpClient(withInterceptors([
      (req, next) => {
        try {
          const authService = inject(AuthService);
          const token = authService.getToken();
          if (token) {
            const authReq = req.clone({
              setHeaders: {
                Authorization: `Bearer ${token}`
              }
            });
            return next(authReq);
          }
        } catch (e) {
        }
        return next(req);
      }
    ])),
    provideAnimations(),
    { provide: NZ_I18N, useValue: ru_RU }
  ]
};
