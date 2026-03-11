import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { RemoteEntry } from './app/remote-entry/entry';
import { setRemoteDefinitions } from '@nx/angular/mf';
import { environment } from '@allmarket-web/shared';

// Configura os remotes antes de inicializar
setRemoteDefinitions({
  'notas_mfe': environment.notasMfeUrl,
  'analise_mfe': environment.analiseMfeUrl,
  'comparador_mfe': environment.comparadorMfeUrl,
  'listas_mfe': environment.listasMfeUrl,
});

bootstrapApplication(RemoteEntry, appConfig)
  .catch((err) => {
    console.error('Erro ao inicializar:', err);
  });