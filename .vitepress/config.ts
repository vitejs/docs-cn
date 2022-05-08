import { defineConfig } from 'vitepress'

<<<<<<< HEAD:.vitepress/config.js
const pkg = require('../package.json')

/**
 * @type {import('vitepress').UserConfig}
 */
module.exports = {
  title: 'Vite 官方中文文档',
  lang: 'zh-CN',
  description: '下一代前端开发与构建工具',
  head: [
    ['link', { rel: 'icon', type: 'image/svg+xml', href: '/logo.svg' }],
    ['script', { src: 'https://cdn.wwads.cn/js/makemoney.js', async: '' }]
  ],
=======
export default defineConfig({
  title: 'Vite',
  description: 'Next Generation Frontend Tooling',
  head: [['link', { rel: 'icon', type: 'image/svg+xml', href: '/logo.svg' }]],
>>>>>>> 8ab716cb0a0d066c8604c649c1983f048b0185ce:.vitepress/config.ts
  vue: {
    reactivityTransform: true
  },
  themeConfig: {
    repo: pkg.repository,
    logo: '/logo.svg',
    docsBranch: 'main',
    editLinks: true,
    editLinkText: '为此页提供修改建议',

    algolia: {
      apiKey: 'b573aa848fd57fb47d693b531297403c',
      indexName: 'vitejs',
      searchParameters: {
        facetFilters: ['tags:cn']
      }
    },

    nav: [
      { text: '指引', link: '/guide/' },
      { text: '配置', link: '/config/' },
      { text: '插件', link: '/plugins/' },
      {
        text: '相关链接',
        items: [
          {
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
<<<<<<< HEAD:.vitepress/config.js
        text: '多语言',
=======
        text: 'v3 (next)',
        items: [
          {
            text: 'v2.x (stable)',
            link: 'https://v2.vitejs.dev'
          }
        ]
      },
      {
        text: 'Languages',
>>>>>>> 8ab716cb0a0d066c8604c649c1983f048b0185ce:.vitepress/config.ts
        items: [
          {
            text: 'English',
            link: 'https://vitejs.dev'
          },
          {
            text: '简体中文',
            link: 'https://cn.vitejs.dev'
          },
          {
            text: '日本語',
            link: 'https://ja.vitejs.dev'
          }
        ]
      }
    ],

    sidebar: {
      '/config/': 'auto',
      '/plugins': 'auto',
      // catch-all fallback
      '/': [
        {
          text: '指引',
          children: [
            {
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
              text: '从 v1 迁移',
              link: '/guide/migration'
            }
          ]
        },
        {
          text: 'API',
          children: [
            {
              text: '插件 API',
              link: '/guide/api-plugin'
            },
            {
              text: 'HMR API',
              link: '/guide/api-hmr'
            },
            {
              text: 'JavaScript API',
              link: '/guide/api-javascript'
            },
            {
              text: '配置参考',
              link: '/config/'
            }
          ]
        }
      ]
    }
  },

  markdown: {
    anchor: {
      renderPermalink: require('./render-perma-link')
    },
    config: (md) => {
      md.use(require('./markdown-it-custom-anchor'))
    }
  }
})
