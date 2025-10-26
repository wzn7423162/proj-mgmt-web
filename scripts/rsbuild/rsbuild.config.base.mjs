import { defineConfig, loadEnv, mergeRsbuildConfig } from '@rsbuild/core';

import { ProvidePlugin } from '@rspack/core';
import { RsdoctorRspackPlugin } from '@rsdoctor/rspack-plugin';
import { composeChunkSplit } from './utils/chunkSplit.mjs';
import { composePathAlias } from './utils/pathAlias.mjs';
import path from 'node:path';
import { pluginLess } from '@rsbuild/plugin-less';
import { pluginReact } from '@rsbuild/plugin-react';
import { pluginSass } from '@rsbuild/plugin-sass';
import { pluginSvgr } from '@rsbuild/plugin-svgr';

const isDev = process.env.NODE_ENV === 'development';
const monorepoRoot = path.resolve(__dirname, '../../');

// transfer CRA env
const { rawPublicVars } = loadEnv({ prefixes: ['PUBLIC_', 'REACT_APP_', 'NODE_ENV'] });

// only for production
const PUBLIC_URL = process.env.PUBLIC_URL ?? '/';

const HOST = process.env.HOST ?? 'localhost';
const PORT = process.env.PORT ?? 4000;

const DOMAIN_INFER = 'baicainfer.com';
const DOMAIN_UCENTER = 'apps.datacanvas.com';
const DOMAIN_ONLINE = 'llamafactory.online';
const DOMAIN =
  {
    infer: DOMAIN_INFER,
    ucenter: DOMAIN_UCENTER,
  }[process.env.PLATFORM] || DOMAIN_ONLINE;
console.log('q=>DOMAIN', process.env.PLATFORM, DOMAIN);
const getTargetUrl = () => {
  switch (process.env.PROXY_ENV) {
    case 'local': {
      const host = process.env.BACKEND_HOST || 'localhost';
      const port = process.env.BACKEND_PORT || '8890';
      return `http://${host}:${port}`;
    }
    case 'bugfix':
      return `https://www.bugfix.${DOMAIN}/`;
    case 'feature':
      return `https://www.feature.${DOMAIN}/`;
    case 'test':
      if (process.env.PLATFORM === 'ucenter') {
        return `https://test.${DOMAIN}`;
      }
      return `https://www.test.${DOMAIN}`;
    case 'prod':
      return `https://www.${DOMAIN}`;
    default:
      return `http://localhost:8890`
  }
};
export default function generateConfig({ projectCWD }) {
  const targetUrl = getTargetUrl();
  console.log('q=>targetUrl', targetUrl);
  const baseConfig = defineConfig({
    plugins: [
      pluginReact(),
      pluginSvgr({ mixedImport: true }),
      pluginLess(),
      pluginSass({
        // sassLoaderOptions: {
        //   api: 'legacy',
        //   sassOptions: {
        //     silenceDeprecations: [
        //       'legacy-js-api',
        //       'import',
        //       'global-builtin',
        //       'color-functions',
        //       'mixed-decls',
        //     ],
        //   },
        // },
      }),
    ],
    html: {
      template: path.resolve(projectCWD, './public/index.html'),
      tags: process.env.BUILD_YOUMENG
        ? [
            {
              tag: 'script',
              head: false,
              inject: 'body',
              children: `var _czc = _czc || [];
            (function () {
              var um = document.createElement("script");
              um.src = "${
                process.env.BUILD_YOUMENG === 'production'
                  ? 'https://v1.cnzz.com/z.js?id=1281425384&async=1'
                  : 'https://s4.cnzz.com/z.js?id=1281425385&async=1'
              }";
              var s = document.getElementsByTagName("script")[0];
              s.parentNode.insertBefore(um, s);
            })();`,
            },
          ]
        : [],
    },
    performance: {
      buildCache: false,
      preload: {
        type: 'initial',
        exclude: [/.*\.(png|svg|jpg|jpeg|gif|woff|woff2|ttf|eot|ico|webp)$/],
      },
      preconnect: PUBLIC_URL.startsWith('http') ? [{ href: PUBLIC_URL, crossorigin: true }] : [],
      dnsPrefetch: [],
      // prefetch: true,
      removeMomentLocale: true,
    },
    dev: {
      // configs目录变更的时候重启rsbuild的server
      watchFiles: [
        {
          paths: [__dirname],
          type: 'reload-server',
        },
      ],
      hmr: false,
      liveReload: true,
      lazyCompilation: false,
    },
    server: {
      host: HOST,
      port: PORT,
      proxy: {
        // 平台定向本地代理，仅在 PROXY_ENV=local 时生效
        ...(process.env.PROXY_ENV === 'local'
          ? {
              '/api/ucenter': {
                secure: false,
                target: 'http://localhost:8890',
                changeOrigin: true,
                pathRewrite: {
                  '^/api/ucenter': '',
                },
              },
              '/api/infer': {
                secure: false,
                target: 'http://localhost:8888',
                changeOrigin: true,
                pathRewrite: {
                  '^/api/infer': '',
                },
              },
              '/api/online': {
                secure: false,
                target: 'http://localhost:8889',
                changeOrigin: true,
                pathRewrite: {
                  '^/api/online': '',
                },
              },
            }
          : {}),
        '/api': {
          secure: false,
          target: targetUrl,
          changeOrigin: true,
          pathRewrite: {
            '^/api': '',
          },
        },

        '/deployment': {
          secure: false,
          target: 'https://api.alayanew.com/deployment/',
          changeOrigin: true,
          pathRewrite: {
            '^/deployment': '',
          },
        },
      },
    },
    tools: {
      rspack: (config, { appendPlugins }) => {
        appendPlugins(
          new ProvidePlugin({
            _: 'lodash',
          })
        );

        if (process.env.RSDOCTOR) {
          appendPlugins(
            new RsdoctorRspackPlugin({
              features: ['bundle', 'dependencies'],
              supports: {
                generateTileGraph: true,
              },
            })
          );
        }
      },
    },
    source: {
      define: {
        'process.env': JSON.stringify(rawPublicVars),
      },
      include: [
        /node_modules/, // ✅ 匹配所有 node_modules
      ],
      copy: [
        {
          from: './public/proxy', // 源目录（相对于项目根目录）
          to: './', // 目标目录（相对于输出目录，保持原结构）
          pattern: ['*.html'], // 复制所有文件，排除 .md 文件
        },
      ],
    },
    output: {
      // only for production
      polyfill: isDev ? 'off' : 'entry',
      assetPrefix: PUBLIC_URL,
      distPath: {
        root: isDev ? 'dev_build' : 'build',
      },
    },
  });

  const composeConfigParams = {
    projectCWD,
    isDev,
    monorepoRoot,
  };

  const aliasConfig = composePathAlias(composeConfigParams);
  const chunkSplitConfig = composeChunkSplit(composeConfigParams);

  const mergedConfig = mergeRsbuildConfig(baseConfig, chunkSplitConfig, aliasConfig);

  return mergedConfig;
}
