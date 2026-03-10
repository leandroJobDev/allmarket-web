import { ModuleFederationConfig } from '@nx/module-federation';
import { withModuleFederation } from '@nx/module-federation/angular';
import config from './module-federation.config';

const prodConfig: ModuleFederationConfig = {
  ...config,
  remotes: [
    ['notas_mfe', 'https://allmarket-notas-mfe.web.app'],
    ['analise_mfe', 'https://allmarket-analise-mfe.web.app'],
    ['comparador_mfe', 'https://allmarket-comparador-mfe.web.app'],
    ['listas_mfe', 'https://allmarket-listas-mfe.web.app'],
  ],
};

export default withModuleFederation(prodConfig, { dts: false });