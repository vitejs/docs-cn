import type { DefaultTheme } from 'vitepress'
import { defineConfig } from 'vitepress'
import { transformerTwoslash } from '@shikijs/vitepress-twoslash'
import {
  groupIconMdPlugin,
  groupIconVitePlugin,
} from 'vitepress-plugin-group-icons'
import llmstxt from 'vitepress-plugin-llms'
import type { PluginOption } from 'vite'
import { buildEnd } from './buildEnd.config'

const siteUrl = 'https://v6.cn.vite.dev'
const ogDescription = 'Vite 6 历史版本官方中文文档'
const ogImage = `${siteUrl}/og-image.jpg`
const ogTitle = 'Vite'
const ogUrl = siteUrl

const commitRef = process.env.COMMIT_REF?.slice(0, 8) || 'dev'

const versionLinks: DefaultTheme.NavItemWithLink[] = [
  { text: '中文最新版', link: 'https://cn.vite.dev' },
  { text: 'Vite 6 文档（英文）', link: 'https://v6.vite.dev' },
  { text: 'Vite 5 文档（英文）', link: 'https://v5.vite.dev' },
  { text: 'Vite 4 文档（英文）', link: 'https://v4.vite.dev' },
  { text: 'Vite 3 文档（英文）', link: 'https://v3.vite.dev' },
  { text: 'Vite 2 文档（英文）', link: 'https://v2.vite.dev' },
]

export default defineConfig({
  title: 'Vite 6 官方中文文档',
  description: 'Vite 6 历史版本官方中文文档',
  lang: 'zh-CN',
  cleanUrls: true,
  srcExclude: ['README.md'],
  sitemap: {
    hostname: siteUrl,
  },

  head: [
    ['link', { rel: 'icon', type: 'image/svg+xml', href: '/logo.svg' }],
    [
      'link',
      { rel: 'alternate', type: 'application/rss+xml', href: '/blog.rss' },
    ],
    ['link', { rel: 'preconnect', href: 'https://fonts.googleapis.com' }],
    [
      'link',
      {
        rel: 'preconnect',
        href: 'https://fonts.gstatic.com',
        crossorigin: 'true',
      },
    ],
    [
      'link',
      {
        rel: 'preload',
        href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Manrope:wght@600&family=IBM+Plex+Mono:wght@400&display=swap',
        as: 'style',
      },
    ],
    [
      'link',
      {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Manrope:wght@600&family=IBM+Plex+Mono:wght@400&display=swap',
      },
    ],
    ['link', { rel: 'me', href: 'https://m.webtoo.ls/@vite' }],
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:title', content: ogTitle }],
    ['meta', { property: 'og:image', content: ogImage }],
    ['meta', { property: 'og:url', content: ogUrl }],
    ['meta', { property: 'og:description', content: ogDescription }],
    ['meta', { property: 'og:site_name', content: 'vitejs' }],
    ['meta', { name: 'twitter:card', content: 'summary_large_image' }],
    ['meta', { name: 'twitter:site', content: '@vite_js' }],
    ['meta', { name: 'theme-color', content: '#646cff' }],
    [
      'script',
      {
        src: 'https://cdn.usefathom.com/script.js',
        'data-site': 'TPLGJZGR',
        'data-spa': 'auto',
        defer: '',
      },
    ],
  ],

  locales: {
    root: { label: '简体中文' },
    en: { label: 'English', link: 'https://v6.vite.dev' },
    ja: { label: '日本語', link: 'https://ja.vite.dev' },
    es: { label: 'Español', link: 'https://es.vite.dev' },
    pt: { label: 'Português', link: 'https://pt.vite.dev' },
    ko: { label: '한국어', link: 'https://ko.vite.dev' },
    de: { label: 'Deutsch', link: 'https://de.vite.dev' },
    fa: { label: 'فارسی', link: 'https://fa.vite.dev' },
  },

  themeConfig: {
    logo: '/logo.svg',

    editLink: {
      pattern: 'https://github.com/vitejs/docs-cn/edit/6.x-stable/:path',
      text: '为此页提供修改建议',
    },

    outline: {
      label: '本页目录',
      level: [2, 3],
    },

    socialLinks: [
      { icon: 'bluesky', link: 'https://bsky.app/profile/vite.dev' },
      { icon: 'mastodon', link: 'https://elk.zone/m.webtoo.ls/@vite' },
      { icon: 'x', link: 'https://x.com/vite_js' },
      { icon: 'discord', link: 'https://chat.vite.dev' },
      { icon: 'github', link: 'https://github.com/vitejs/vite' },
    ],

    search: {
      provider: 'local',
      options: {
        translations: {
          button: {
            buttonText: '搜索文档',
            buttonAriaLabel: '搜索文档',
          },
          modal: {
            noResultsText: '没有找到相关结果',
            resetButtonTitle: '重置搜索',
            footer: {
              selectText: '选择',
              navigateText: '导航',
              closeText: '关闭',
            },
          },
        },
      },
    },

    docFooter: {
      prev: '上一页',
      next: '下一页'
    },

    // Using WwAds for China
    // carbonAds: {
    //   code: 'CEBIEK3N',
    //   placement: 'vitejsdev',
    // },

    footer: {
      message: `Vite 6.4.3 历史版本文档（${commitRef}）`,
      copyright:
        '本中文文档内容版权为 Vite 官方中文翻译团队所有，保留所有权利。'
    },

    nav: [
      { text: '指引', link: '/guide/', activeMatch: '/guide/' },
      { text: '配置', link: '/config/', activeMatch: '/config/' },
      { text: '插件', link: '/plugins/', activeMatch: '/plugins/' },
      {
        text: '相关链接',
        items: [
          { text: '团队成员', link: '/team' },
          { text: '最新博客', link: '/blog' },
          { text: '发布策略', link: '/releases' },
          {
            items: [
              {
                text: 'Bluesky',
                link: 'https://bsky.app/profile/vite.dev',
              },
              {
                text: 'Mastodon',
                link: 'https://elk.zone/m.webtoo.ls/@vite',
              },
              {
                text: 'X',
                link: 'https://x.com/vite_js',
              },
              {
                text: 'Discord 聊天室',
                link: 'https://chat.vite.dev',
              },
              {
                text: 'Awesome Vite',
                link: 'https://github.com/vitejs/awesome-vite'
              },
              {
                text: 'ViteConf',
                link: 'https://viteconf.org',
              },
              {
                text: 'Dev.to 社区',
                link: 'https://dev.to/t/vite'
              },
              {
                text: '更新日志',
                link: 'https://github.com/vitejs/vite/blob/v6/packages/vite/CHANGELOG.md',
              },
              {
                text: '贡献指南',
                link: 'https://github.com/vitejs/vite/blob/v6/CONTRIBUTING.md',
              },
            ],
          },
        ]
      },
      {
        text: 'v6.4.3',
        items: versionLinks,
      }
    ],

    sidebar: {
      '/guide/': [
        {
          text: '介绍',
          items: [
            {
              text: '开始',
              link: '/guide/',
            },
            {
              text: '理念',
              link: '/guide/philosophy',
            },
            {
              text: '为什么选 Vite',
              link: '/guide/why',
            },
          ],
        },
        {
          text: '指引',
          items: [
            {
              text: '功能',
              link: '/guide/features',
            },
            {
              text: '命令行接口',
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
              text: '故障排除',
              link: '/guide/troubleshooting',
            },
            {
              text: '性能',
              link: '/guide/performance',
            },
            {
              text: 'Rolldown',
              link: '/guide/rolldown',
            },
            {
              text: '从 v5 迁移',
              link: '/guide/migration',
            },
            {
              text: '破坏性变更',
              link: '/changes/',
            },
          ],
        },
        {
          text: 'API',
          items: [
            {
              text: '插件 API',
              link: '/guide/api-plugin'
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
              text: '配置参考',
              link: '/config/',
            },
          ],
        },
        {
          text: '环境 API',
          items: [
            {
              text: '介绍',
              link: '/guide/api-environment',
            },
            {
              text: '环境实例',
              link: '/guide/api-environment-instances',
            },
            {
              text: '插件',
              link: '/guide/api-environment-plugins',
            },
            {
              text: '框架',
              link: '/guide/api-environment-frameworks',
            },
            {
              text: '运行时',
              link: '/guide/api-environment-runtimes',
            },
          ],
        },
      ],
      '/config/': [
        {
          text: '配置',
          items: [
            {
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
              link: '/config/worker-options',
            },
          ],
        },
      ],
      '/changes/': [
        {
          text: '破坏性变更',
          link: '/changes/',
        },
        {
          text: '现在',
          items: [],
        },
        {
          text: '未来',
          items: [
            {
              text: '钩子函数中的 this.environment',
              link: '/changes/this-environment-in-hooks',
            },
            {
              text: 'HMR hotUpdate 插件钩子',
              link: '/changes/hotupdate-hook',
            },
            {
              text: '迁移到基于环境的API',
              link: '/changes/per-environment-apis',
            },
            {
              text: '使用 ModuleRunner API 进行服务端渲染',
              link: '/changes/ssr-using-modulerunner',
            },
            {
              text: '构建过程中的共享插件',
              link: '/changes/shared-plugins-during-build',
            },
          ],
        },
        {
          text: '过去',
          items: [],
        },
      ],
    },
  },
  transformPageData(pageData) {
    const canonicalUrl = `${ogUrl}/${pageData.relativePath}`
      .replace(/\/index\.md$/, '/')
      .replace(/\.md$/, '')
    pageData.frontmatter.head ??= []
    pageData.frontmatter.head.unshift(
      ['link', { rel: 'canonical', href: canonicalUrl }],
      ['meta', { property: 'og:title', content: pageData.title }],
      ['meta', { property: 'og:url', content: canonicalUrl }],
    )
    return pageData
  },
  markdown: {
    // @ts-ignore
    codeTransformers: [transformerTwoslash()],
    config(md) {
      md.use(groupIconMdPlugin)
    },
  },
  vite: {
    plugins: [
      // @ts-ignore
      groupIconVitePlugin({
        customIcon: {
          firebase: 'vscode-icons:file-type-firebase',
          '.gitlab-ci.yml': 'vscode-icons:file-type-gitlab',
        },
      }),
      // @ts-ignore
      llmstxt({
        ignoreFiles: ['blog/*', 'blog.md', 'index.md', 'team.md'],
        description: '面向 Web 的构建工具',
        details: `\
- 💡 极速的开发服务器启动
- ⚡️ 轻量快速的模块热替换（HMR）
- 🛠️ 丰富的功能
- 📦 自带优化的构建
- 🔩 通用的插件接口
- 🔑 完全类型化的 API

Vite 是一种新型前端构建工具，能够显著改善前端开发体验。它主要由两部分组成：

- 一个基于[原生 ES 模块](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Guide/Modules)提供源文件的开发服务器，具有[丰富的内建功能](${siteUrl}/guide/features)和快速的[模块热替换（HMR）](${siteUrl}/guide/features#hot-module-replacement)。

- 一套使用 [Rollup](https://cn.rollupjs.org) 打包代码的[构建命令](${siteUrl}/guide/build)，预先配置为生成高度优化的生产资源。

此外，Vite 还可以通过完整类型支持的[插件 API](${siteUrl}/guide/api-plugin)和 [JavaScript API](${siteUrl}/guide/api-javascript)进行扩展。`,
      }) as PluginOption,
    ],
    optimizeDeps: {
      include: [
        '@shikijs/vitepress-twoslash/client',
        'gsap',
        'gsap/dist/ScrollTrigger',
        'gsap/dist/MotionPathPlugin',
      ],
    },
  },
  buildEnd,
})
