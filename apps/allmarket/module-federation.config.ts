import { ModuleFederationConfig } from '@nx/module-federation';

const isProd = process.env['NODE_ENV'] === 'production' || process.argv.includes('--configuration=production');

const config: ModuleFederationConfig = {
  name: 'allmarket',
  remotes: [
    ['notas_mfe', isProd ? 'https://allmarket-notas-mfe.web.app' : 'http://localhost:4201'],
    ['analise_mfe', isProd ? 'https://allmarket-analise-mfe.web.app' : 'http://localhost:4202'],
    ['comparador_mfe', isProd ? 'https://allmarket-comparador-mfe.web.app' : 'http://localhost:4203'],
    ['listas_mfe', isProd ? 'https://allmarket-listas-mfe.web.app' : 'http://localhost:4204'],
  ],
};

export default config;