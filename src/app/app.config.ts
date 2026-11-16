import { IMAGE_CONFIG, IMAGE_LOADER } from '@angular/common';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  provideZonelessChangeDetection,
} from '@angular/core';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import {
  TitleStrategy,
  provideRouter,
  withComponentInputBinding,
  withInMemoryScrolling,
  withViewTransitions,
} from '@angular/router';
import { routes } from './app.routes';
import { schoolImageLoader } from './core/images/image-loader';
import { apiInterceptor } from './core/interceptors/api.interceptor';
import { SeoTitleStrategy } from './core/services/seo.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter(
      routes,
      withComponentInputBinding(),
      withInMemoryScrolling({ scrollPositionRestoration: 'enabled', anchorScrolling: 'enabled' }),
      withViewTransitions({ skipInitialTransition: true }),
    ),
    provideClientHydration(withEventReplay()),
    provideHttpClient(withFetch(), withInterceptors([apiInterceptor])),
    { provide: TitleStrategy, useClass: SeoTitleStrategy },
    { provide: IMAGE_LOADER, useValue: schoolImageLoader },
    {
      provide: IMAGE_CONFIG,
      useValue: { breakpoints: [480, 800, 1200, 1600, 2000], placeholderResolution: 16 },
    },
  ],
};
