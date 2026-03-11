import { ModuleFederationConfig } from '@nx/module-federation';

const config: ModuleFederationConfig = {
  name: 'notas_mfe',
  exposes: {
    './Routes': 'apps/notas_mfe/src/app/remote-entry/entry.routes.ts',
  },
};


export default config;
