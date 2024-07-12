import { ApplicationConfig, importProvidersFrom, inject } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgxSpinnerModule } from 'ngx-spinner';
import { JwtModule } from '@auth0/angular-jwt';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { LocalStorageService } from './services/local-storage.service';

export function tokenGetter() {
  return inject(LocalStorageService).getItem<string>('token');
}
export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    importProvidersFrom(
      BrowserAnimationsModule,
      NgxSpinnerModule,
      JwtModule.forRoot({
        config: {
            tokenGetter:()=> inject(LocalStorageService).getItem("token"),
            allowedDomains:["localhost:7090"]
        },
      })
    ),
    provideHttpClient(
      withInterceptorsFromDi()
    )]
};
