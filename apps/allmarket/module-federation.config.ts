import { ModuleFederationConfig } from '@nx/module-federation';

const config: ModuleFederationConfig = {
  name: 'allmarket',
  remotes: {
    "notas_mfe": "http://localhost:4201",
    "analise_mfe": "http://localhost:4202"
  },
};
export default config;