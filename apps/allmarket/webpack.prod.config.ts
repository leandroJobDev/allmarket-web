import { ModuleFederationConfig } from '@nx/module-federation';
import { withModuleFederation } from '@nx/module-federation/angular';
import config from './module-federation.config';

const prodConfig: ModuleFederationConfig = {
  ...config, 
  remotes: [],
};

export default withModuleFederation(prodConfig, { dts: false });