import { defineConfig, mergeConfig } from 'vite';

import baseViteConfig from '@llama-fa/compile/config/vite.config.base';

export default defineConfig((configEnv) => {
  /* override base vite config */
  const customConfig = {};

  return mergeConfig(
    baseViteConfig({
      pkgRoot: __dirname,
      configEnv,
    }),
    customConfig
  );
});
