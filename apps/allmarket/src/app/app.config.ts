import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { appRoutes } from './app.routes';
import { setRemoteDefinitions } from '@nx/angular/mf';
import { environment } from '@allmarket-web/shared';

setRemoteDefinitions({
  'notas_mfe': environment.notasMfeUrl,
  'analise_mfe': environment.analiseMfeUrl,
  'comparador_mfe': environment.comparadorMfeUrl,
  'listas_mfe': environment.listasMfeUrl,
});

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(appRoutes),
    provideHttpClient(),
  ],
};