import { defineConfig } from 'vitepress'
import renderPermaLink from './render-perma-link'
import MarkDownItCustomAnchor from './markdown-it-custom-anchor'

const ogDescription = 'Next Generation Frontend Tooling'
const ogImage = 'https://vitejs.dev/og-image.png'
const ogTitle = 'Vite'
const ogUrl = 'https://vitejs.dev'

<<<<<<< HEAD
=======
// netlify envs
const deployURL = process.env.DEPLOY_PRIME_URL || ''
const commitRef = process.env.COMMIT_REF?.slice(0, 8) || 'dev'

const deployType = (() => {
  switch (deployURL) {
    case 'https://main--vite-docs-main.netlify.app':
      return 'main'
    case '':
      return 'local'
    default:
      return 'release'
  }
})()
const additionalTitle = ((): string => {
  switch (deployType) {
    case 'main':
      return ' (main branch)'
    case 'local':
      return ' (local)'
    case 'release':
      return ''
  }
})()
const versionLinks = ((): DefaultTheme.NavItemWithLink[] => {
  switch (deployType) {
    case 'main':
    case 'local':
      return [
        {
          text: 'Vite 3 Docs (release)',
          link: 'https://vitejs.dev',
        },
        {
          text: 'Vite 2 Docs',
          link: 'https://v2.vitejs.dev',
        },
      ]
    case 'release':
      return [
        {
          text: 'Vite 2 Docs',
          link: 'https://v2.vitejs.dev',
        },
      ]
  }
})()

>>>>>>> 876e8037c68dbce404204707763678927b0d3069
export default defineConfig({
  title: 'Vite 官方中文文档',
  description: '下一代前端工具链',
  lang: 'zh-CN',

  head: [
    ['link', { rel: 'icon', type: 'image/svg+xml', href: '/logo.svg' }],
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:title', content: ogTitle }],
    ['meta', { property: 'og:image', content: ogImage }],
    ['meta', { property: 'og:url', content: ogUrl }],
    ['meta', { property: 'og:description', content: ogDescription }],
    ['meta', { name: 'twitter:card', content: 'summary_large_image' }],
    ['meta', { name: 'twitter:site', content: '@vite_js' }],
    ['meta', { name: 'theme-color', content: '#646cff' }],
    [
      'script',
      {
        src: 'https://cdn.usefathom.com/script.js',
        'data-site': 'CBDFBSLI',
        'data-spa': 'auto',
        defer: '',
      },
    ],
  ],

  vue: {
    reactivityTransform: true,
  },

  themeConfig: {
    logo: '/logo.svg',

    editLink: {
<<<<<<< HEAD
      text: '为此页提供修改建议',
      pattern: 'https://github.com/vitejs/docs-cn/edit/main/docs/:path',
=======
      pattern: 'https://github.com/vitejs/vite/edit/main/docs/:path',
      text: 'Suggest changes to this page',
>>>>>>> 876e8037c68dbce404204707763678927b0d3069
    },

    socialLinks: [
      { icon: 'twitter', link: 'https://twitter.com/vite_js' },
      { icon: 'discord', link: 'https://chat.vitejs.dev' },
      { icon: 'github', link: 'https://github.com/vitejs/vite' },
    ],

    algolia: {
      appId: '7H67QR5P0A',
      apiKey: 'deaab78bcdfe96b599497d25acc6460e',
      indexName: 'vitejs',
      searchParameters: {
<<<<<<< HEAD
        facetFilters: ['tags:cn']
      }
=======
        facetFilters: ['tags:en'],
      },
>>>>>>> 876e8037c68dbce404204707763678927b0d3069
    },

    carbonAds: {
      code: 'CEBIEK3N',
      placement: 'vitejsdev',
    },

    localeLinks: {
      text: '简体中文',
      items: [
        { text: 'English', link: 'https://vitejs.dev' },
        { text: '日本語', link: 'https://ja.vitejs.dev' },
        { text: 'Español', link: 'https://es.vitejs.dev' },
      ],
    },

    footer: {
<<<<<<< HEAD
      message: '根据 MIT 许可证发布。',
      copyright: 'Copyright © 2019-present Evan You & Vite Contributors'
=======
      message: `Released under the MIT License. (${commitRef})`,
      copyright: 'Copyright © 2019-present Evan You & Vite Contributors',
>>>>>>> 876e8037c68dbce404204707763678927b0d3069
    },

    nav: [
      { text: '指引', link: '/guide/', activeMatch: '/guide/' },
      { text: '配置', link: '/config/', activeMatch: '/config/' },
      { text: '插件', link: '/plugins/', activeMatch: '/plugins/' },
      {
        text: '相关链接',
        items: [
          { text: 'Team', link: '/team' },
          {
<<<<<<< HEAD
            text: 'Twitter',
            link: 'https://twitter.com/vite_js'
          },
          {
            text: 'Discord Chat',
            link: 'https://chat.vitejs.dev'
          },
          {
            text: 'Awesome Vite',
            link: 'https://github.com/vitejs/awesome-vite'
          },
          {
            text: 'Dev.to 社区',
            link: 'https://dev.to/t/vite'
          },
          {
            text: 'Rollup 插件兼容',
            link: 'https://vite-rollup-plugins.patak.dev/'
          },
          {
            text: '更新日志',
            link: 'https://github.com/vitejs/vite/blob/main/packages/vite/CHANGELOG.md'
          }
        ]
      },
      {
        text: 'Version',
        items: [
          {
            text: 'Vite v2 文档',
            link: 'https://v2.vitejs.dev'
          }
        ]
      }
=======
            items: [
              {
                text: 'Twitter',
                link: 'https://twitter.com/vite_js',
              },
              {
                text: 'Discord Chat',
                link: 'https://chat.vitejs.dev',
              },
              {
                text: 'Awesome Vite',
                link: 'https://github.com/vitejs/awesome-vite',
              },
              {
                text: 'DEV Community',
                link: 'https://dev.to/t/vite',
              },
              {
                text: 'Rollup Plugins Compat',
                link: 'https://vite-rollup-plugins.patak.dev/',
              },
              {
                text: 'Changelog',
                link: 'https://github.com/vitejs/vite/blob/main/packages/vite/CHANGELOG.md',
              },
            ],
          },
        ],
      },
      {
        text: 'Version',
        items: versionLinks,
      },
>>>>>>> 876e8037c68dbce404204707763678927b0d3069
    ],

    sidebar: {
      '/guide/': [
        {
          text: '指引',
          items: [
            {
<<<<<<< HEAD
              text: '为什么选 Vite',
              link: '/guide/why'
            },
            {
              text: '开始',
              link: '/guide/'
            },
            {
              text: '功能',
              link: '/guide/features'
            },
            {
              text: '命令行界面',
              link: '/guide/cli'
            },
            {
              text: '使用插件',
              link: '/guide/using-plugins'
            },
            {
              text: '依赖预构建',
              link: '/guide/dep-pre-bundling'
            },
            {
              text: '静态资源处理',
              link: '/guide/assets'
            },
            {
              text: '构建生产版本',
              link: '/guide/build'
            },
            {
              text: '部署静态站点',
              link: '/guide/static-deploy'
            },
            {
              text: '环境变量与模式',
              link: '/guide/env-and-mode'
            },
            {
              text: '服务端渲染（SSR）',
              link: '/guide/ssr'
            },
            {
              text: '后端集成',
              link: '/guide/backend-integration'
            },
            {
              text: '比较',
              link: '/guide/comparisons'
            },
            {
              text: '故障排除',
              link: '/guide/troubleshooting'
            },
            {
              text: '从 v2 迁移',
              link: '/guide/migration'
            }
          ]
=======
              text: 'Why Vite',
              link: '/guide/why',
            },
            {
              text: 'Getting Started',
              link: '/guide/',
            },
            {
              text: 'Features',
              link: '/guide/features',
            },
            {
              text: 'CLI',
              link: '/guide/cli',
            },
            {
              text: 'Using Plugins',
              link: '/guide/using-plugins',
            },
            {
              text: 'Dependency Pre-Bundling',
              link: '/guide/dep-pre-bundling',
            },
            {
              text: 'Static Asset Handling',
              link: '/guide/assets',
            },
            {
              text: 'Building for Production',
              link: '/guide/build',
            },
            {
              text: 'Deploying a Static Site',
              link: '/guide/static-deploy',
            },
            {
              text: 'Env Variables and Modes',
              link: '/guide/env-and-mode',
            },
            {
              text: 'Server-Side Rendering (SSR)',
              link: '/guide/ssr',
            },
            {
              text: 'Backend Integration',
              link: '/guide/backend-integration',
            },
            {
              text: 'Comparisons',
              link: '/guide/comparisons',
            },
            {
              text: 'Troubleshooting',
              link: '/guide/troubleshooting',
            },
            {
              text: 'Migration from v2',
              link: '/guide/migration',
            },
          ],
>>>>>>> 876e8037c68dbce404204707763678927b0d3069
        },
        {
          text: 'API',
          items: [
            {
<<<<<<< HEAD
              text: '插件 API',
              link: '/guide/api-plugin'
=======
              text: 'Plugin API',
              link: '/guide/api-plugin',
>>>>>>> 876e8037c68dbce404204707763678927b0d3069
            },
            {
              text: 'HMR API',
              link: '/guide/api-hmr',
            },
            {
              text: 'JavaScript API',
              link: '/guide/api-javascript',
            },
            {
<<<<<<< HEAD
              text: '配置参考',
              link: '/config/'
            }
          ]
        }
=======
              text: 'Config Reference',
              link: '/config/',
            },
          ],
        },
>>>>>>> 876e8037c68dbce404204707763678927b0d3069
      ],
      '/config/': [
        {
          text: '配置',
          items: [
            {
<<<<<<< HEAD
              text: '配置 Vite',
              link: '/config/'
            },
            {
              text: '共享选项',
              link: '/config/shared-options'
            },
            {
              text: '服务器选项',
              link: '/config/server-options'
            },
            {
              text: '构建选项',
              link: '/config/build-options'
            },
            {
              text: '预览选项',
              link: '/config/preview-options'
            },
            {
              text: '依赖优化选项',
              link: '/config/dep-optimization-options'
            },
            {
              text: 'SSR 选项',
              link: '/config/ssr-options'
            },
            {
              text: 'Worker 选项',
              link: '/config/worker-options'
            }
          ]
        }
      ]
    }
  },

  markdown: {
    anchor: {
      permalink: renderPermaLink,
    },
    config: (md) => {
      md.use(MarkDownItCustomAnchor)
    }
  }
=======
              text: 'Configuring Vite',
              link: '/config/',
            },
            {
              text: 'Shared Options',
              link: '/config/shared-options',
            },
            {
              text: 'Server Options',
              link: '/config/server-options',
            },
            {
              text: 'Build Options',
              link: '/config/build-options',
            },
            {
              text: 'Preview Options',
              link: '/config/preview-options',
            },
            {
              text: 'Dep Optimization Options',
              link: '/config/dep-optimization-options',
            },
            {
              text: 'SSR Options',
              link: '/config/ssr-options',
            },
            {
              text: 'Worker Options',
              link: '/config/worker-options',
            },
          ],
        },
      ],
    },
  },
>>>>>>> 876e8037c68dbce404204707763678927b0d3069
})
