import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { appRoutes } from './app.routes';
import { setRemoteDefinitions } from '@nx/angular/mf';
import { environment } from '@allmarket-web/shared';

// register remotes early so router/loadRemoteModule can find them
// the remote name must match the one used in app.routes.ts and module-federation.config.ts
setRemoteDefinitions({
  // use underscore notation to stay consistent with the federated config
  'notas_mfe': environment.notasMfeUrl,
});

import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(appRoutes),
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideFirestore(() => getFirestore()),
  ],
};