import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { appRoutes } from './app.routes';
import { setRemoteDefinitions } from '@nx/angular/mf';
import { environment } from '@allmarket-web/shared';

// register remotes early so router/loadRemoteModule can find them
setRemoteDefinitions({
  'notas-mfe': environment.notasMfeUrl,
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