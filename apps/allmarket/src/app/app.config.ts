import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { appRoutes } from './app.routes';
import { setRemoteDefinitions } from '@nx/angular/mf';
import { environment } from '@allmarket-web/shared';

console.log('🔧 Configurando remotes:', {
  notas_mfe: environment.notasMfeUrl,
  analise_mfe: environment.analiseMfeUrl
});

setRemoteDefinitions({
  'notas_mfe': environment.notasMfeUrl,
  'analise_mfe': environment.analiseMfeUrl,
});

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(appRoutes),
    provideHttpClient(),
  ],
};