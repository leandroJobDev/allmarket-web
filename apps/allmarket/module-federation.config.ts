import { ModuleFederationConfig } from '@nx/module-federation';

const config: ModuleFederationConfig = {
  name: 'allmarket',
  remotes: [
    'notas_mfe',
    'analise_mfe',
    'comparador_mfe',
    'listas_mfe',
  ],
};

export default config;