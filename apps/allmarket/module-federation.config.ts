import { ModuleFederationConfig } from '@nx/module-federation';

const config: ModuleFederationConfig = {
  name: 'allmarket',
  remotes: {
    "notas_mfe": "http://localhost:4201"
  },
};
export default config;