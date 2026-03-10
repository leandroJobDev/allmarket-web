import { ModuleFederationConfig } from '@nx/module-federation';

const config: ModuleFederationConfig = {
  name: 'allmarket',
  remotes: {
    "notas_mfe": "http://localhost:4201",
    "analise_mfe": "http://localhost:4202",
    "comparador_mfe": "http://localhost:4203",
    "listas_mfe": "http://localhost:4204"
  },
};
export default config;