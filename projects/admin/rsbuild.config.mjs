import { defineConfig, mergeRsbuildConfig } from '@rsbuild/core';

import { PROJECT_ROOT } from '../../scripts/utils/common.mjs';
import { debounce } from 'lodash';
import execa from 'execa';
import generateConfig from '../../scripts/rsbuild/rsbuild.config.base.mjs';
import path from 'path';
import { pluginWatchSecondaryDir } from '../../scripts/rsbuild/utils/plugins/watchSecondaryDir.mjs';

const baseConfig = generateConfig({ projectCWD: __dirname });

const debounceExecuteFix = debounce(() => {
  execa('pnpm', ['run', 'fix:tsconfig'], {
    cwd: PROJECT_ROOT,
  }).catch(console.error);
}, 1e3);

/* override base rsbuild config */
const customConfig = defineConfig({
  plugins: [
    pluginWatchSecondaryDir({
      projectRoot: PROJECT_ROOT,
      handler: (params) => {
        const { actionType, path } = params;
        debounceExecuteFix();
      },
    }),
  ],
  server: {
    open: [`http://localhost:${process.env.PORT ?? 4000}`],
  },
  html: {
    favicon: './public/favicon.ico',
  },
  output: {
    cssModules: {
      localIdentName: '[local]_[hash:base64:5]',
    },
    // 从环境变量获取 PUBLIC_URL
    assetPrefix: process.env.PUBLIC_URL || '/',
    // sourceMap: {
    //   js: 'cheap-module-source-map',
    //   css: true,
    // },
  },
  optimization: {
    concatenateModules: false,
  },
  source: {
    alias: {
      '@llama-fa/component': path.resolve(__dirname, '../../packages/b-component/src'),
    },
  },
});

export default mergeRsbuildConfig(baseConfig, customConfig);
