import path from 'node:path'
import fs from 'node:fs'
import type { HeadConfig } from 'vitepress'
import { defineConfig } from 'vitepress'
import { transformerTwoslash } from '@shikijs/vitepress-twoslash'
import {
  groupIconMdPlugin,
<<<<<<< HEAD
  groupIconVitePlugin
=======
  groupIconVitePlugin,
  localIconLoader,
>>>>>>> 71ce737810d515ededd7e1ca0a59a5b48c339958
} from 'vitepress-plugin-group-icons'
import { markdownItImageSize } from 'markdown-it-image-size'
<<<<<<< HEAD
import packageJson from '../package.json' with { type: 'json' }
=======
import { extendConfig } from '@voidzero-dev/vitepress-theme/config'
import type { FooterLink } from '@voidzero-dev/vitepress-theme'
import packageJson from '../../packages/vite/package.json' with { type: 'json' }
>>>>>>> 71ce737810d515ededd7e1ca0a59a5b48c339958
import { buildEnd } from './buildEnd.config'

const viteVersion = packageJson.version
const viteMajorVersion = +viteVersion.split('.')[0]

const ogDescription = 'Next Generation Frontend Tooling'
const ogImage = 'https://vite.dev/og-image.jpg'
const ogTitle = 'Vite'
const ogUrl = 'https://vite.dev'

// netlify envs
const commitRef = process.env.COMMIT_REF?.slice(0, 8) || 'dev'

<<<<<<< HEAD
const versionLinks = ((): DefaultTheme.NavItemWithLink[] => {
  const links: DefaultTheme.NavItemWithLink[] = []
=======
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
const versionLinks = (() => {
  const links: FooterLink[] = []
>>>>>>> 71ce737810d515ededd7e1ca0a59a5b48c339958

  // Create version links from v2 onwards
  for (let i = viteMajorVersion - 1; i >= 2; i--) {
    links.push({
      text: `Vite ${i} Docs`,
      link: `https://v${i}.vite.dev`
    })
  }

  return links
})()

function inlineScript(file: string): HeadConfig {
  return [
    'script',
    {},
    fs.readFileSync(
      path.resolve(__dirname, `./inlined-scripts/${file}`),
      'utf-8'
    )
  ]
}

<<<<<<< HEAD
export default defineConfig({
  title: 'Vite 官方中文文档',
  description: '下一代前端工具链',
  lang: 'zh-CN',
=======
const config = defineConfig({
  title: `Vite${additionalTitle}`,
  description: 'Next Generation Frontend Tooling',
>>>>>>> 71ce737810d515ededd7e1ca0a59a5b48c339958
  cleanUrls: true,
  sitemap: {
    hostname: 'https://cn.vite.dev',
  },
  head: [
    [
      'link',
      { rel: 'icon', type: 'image/svg+xml', href: '/logo-without-border.svg' },
    ],
    [
      'link',
      { rel: 'alternate', type: 'application/rss+xml', href: '/blog.rss' }
    ],
    ['link', { rel: 'preconnect', href: 'https://fonts.googleapis.com' }],
    inlineScript('banner.js'),
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
        defer: ''
      }
    ]
  ],

  locales: {
    root: { label: '简体中文' },
    en: { label: 'English', link: 'https://vite.dev' },
    ja: { label: '日本語', link: 'https://ja.vite.dev' },
    es: { label: 'Español', link: 'https://es.vite.dev' },
    pt: { label: 'Português', link: 'https://pt.vite.dev' },
    ko: { label: '한국어', link: 'https://ko.vite.dev' },
    de: { label: 'Deutsch', link: 'https://de.vite.dev' },
    fa: { label: 'فارسی', link: 'https://fa.vite.dev' }
  },

  themeConfig: {
    variant: 'vite',
    logo: '/logo.svg',

    banner: {
      id: 'vite+',
      text: 'Announcing Vite+ | The Unified Toolchain for the Web',
      url: 'https://voidzero.dev/posts/announcing-vite-plus?utm_source=vite&utm_content=top_banner',
    },

    editLink: {
      pattern: 'https://github.com/vitejs/docs-cn/edit/main/:path',
      text: '为此页提供修改建议'
    },

    outline: {
      label: '本页目录',
      level: [2, 3]
    },

    socialLinks: [
      { icon: 'bluesky', link: 'https://bsky.app/profile/vite.dev' },
      { icon: 'mastodon', link: 'https://elk.zone/m.webtoo.ls/@vite' },
      { icon: 'x', link: 'https://x.com/vite_js' },
      { icon: 'discord', link: 'https://chat.vite.dev' },
      { icon: 'github', link: 'https://github.com/vitejs/vite' }
    ],

    search: {
      provider: 'local',
      options: {
        translations: {
          button: {
            buttonText: '搜索',
            buttonAriaLabel: '搜索'
          },
          modal: {
            footer: {
              selectText: '选择',
              navigateText: '切换',
              closeText: '关闭'
            }
          }
        }
      }
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
<<<<<<< HEAD
      message: `Released under the MIT License. (${commitRef})`,
      copyright: 'Copyright © 2019-present VoidZero Inc. & Vite Contributors'
=======
      copyright: `© 2025 VoidZero Inc. and Vite contributors. (${commitRef})`,
      nav: [
        {
          title: 'Vite',
          items: [
            { text: 'Guide', link: '/guide/' },
            { text: 'Config', link: '/config/' },
            { text: 'Plugins', link: '/plugins/' },
          ],
        },
        {
          title: 'Resources',
          items: [
            { text: 'Team', link: '/team' },
            { text: 'Blog', link: '/blog' },
            {
              text: 'Releases',
              link: 'https://github.com/vitejs/vite/releases',
            },
          ],
        },
        {
          title: 'Versions',
          items: versionLinks,
        },
      ],
      social: [
        { icon: 'github', link: 'https://github.com/vitejs/vite' },
        { icon: 'discord', link: 'https://chat.vite.dev' },
        { icon: 'bluesky', link: 'https://bsky.app/profile/vite.dev' },
        { icon: 'x', link: 'https://x.com/vite_js' },
      ],
>>>>>>> 71ce737810d515ededd7e1ca0a59a5b48c339958
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
            text: '纪录片',
            link: 'https://www.youtube.com/watch?v=bmWQqAKLgT4'
          },
          {
            items: [
              {
                text: 'Bluesky',
                link: 'https://bsky.app/profile/vite.dev'
              },
              {
                text: 'Mastodon',
                link: 'https://elk.zone/m.webtoo.ls/@vite'
              },
              {
                text: 'X',
                link: 'https://x.com/vite_js'
              },
              {
                text: 'Discord 聊天室',
                link: 'https://chat.vite.dev'
              },
              {
                text: 'Awesome Vite',
                link: 'https://github.com/vitejs/awesome-vite'
              },
              {
                text: 'ViteConf',
                link: 'https://viteconf.org'
              },
              {
                text: 'Dev.to 社区',
                link: 'https://dev.to/t/vite'
              }
            ]
          }
        ]
      },
      {
        text: `v${viteVersion}`,
        items: [
          {
            text: '更新日志',
            link: 'https://github.com/vitejs/vite/blob/main/packages/vite/CHANGELOG.md'
          },
          {
            text: '贡献指南',
            link: 'https://github.com/vitejs/vite/blob/main/CONTRIBUTING.md'
          },
          {
            items: versionLinks
          }
        ]
      }
    ],

    sidebar: {
      '/guide/': [
        {
          text: '介绍',
          items: [
            {
              text: '开始',
              link: '/guide/'
            },
            {
              text: '理念',
              link: '/guide/philosophy'
            },
            {
              text: '为什么选 Vite',
              link: '/guide/why'
            }
          ]
        },
        {
          text: '指引',
          items: [
            {
              text: '功能',
              link: '/guide/features'
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
              link: '/guide/troubleshooting'
            },
            {
              text: '性能',
              link: '/guide/performance'
            },
            {
              text: `从 v${viteMajorVersion - 1} 迁移`,
              link: '/guide/migration'
            },
            {
              text: '破坏性变更',
              link: '/changes/'
            }
          ]
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
        },
        {
          text: '环境 API',
          items: [
            {
              text: '介绍',
              link: '/guide/api-environment'
            },
            {
              text: '环境实例',
              link: '/guide/api-environment-instances'
            },
            {
              text: '插件',
              link: '/guide/api-environment-plugins'
            },
            {
              text: '框架',
              link: '/guide/api-environment-frameworks'
            },
            {
              text: '运行时',
              link: '/guide/api-environment-runtimes'
            }
          ]
        }
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
              link: '/config/worker-options'
            }
          ]
        }
      ],
      '/changes/': [
        {
          text: '破坏性变更',
          link: '/changes/'
        },
        {
          text: '现在',
          items: []
        },
        {
          text: '未来',
          items: [
            {
              text: '钩子函数中的 this.environment',
              link: '/changes/this-environment-in-hooks'
            },
            {
              text: 'HMR hotUpdate 插件钩子',
              link: '/changes/hotupdate-hook'
            },
            {
              text: '迁移到基于环境的API',
              link: '/changes/per-environment-apis'
            },
            {
              text: '使用 ModuleRunner API 进行服务端渲染',
              link: '/changes/ssr-using-modulerunner'
            },
            {
              text: '构建过程中的共享插件',
              link: '/changes/shared-plugins-during-build'
            }
          ]
        },
        {
          text: '过去',
          items: []
        }
      ]
    }
  },
  transformHead(ctx) {
    const path = ctx.page.replace(/(^|\/)index\.md$/, '$1').replace(/\.md$/, '')

    if (path !== '404') {
      const canonicalUrl = path ? `${ogUrl}/${path}` : ogUrl
      ctx.head.push(
        ['link', { rel: 'canonical', href: canonicalUrl }],
        ['meta', { property: 'og:title', content: ctx.pageData.title }],
      )
    }

    // For the landing page, move the google font links to the top for better performance
    if (path === '') {
      const googleFontLinks: HeadConfig[] = []
      for (let i = 0; i < ctx.head.length; i++) {
        const tag = ctx.head[i]
        if (
          tag[0] === 'link' &&
          (tag[1]?.href?.includes('fonts.googleapis.com') ||
            tag[1]?.href?.includes('fonts.gstatic.com'))
        ) {
          ctx.head.splice(i, 1)
          googleFontLinks.push(tag)
          i--
        }
      }
      ctx.head.unshift(...googleFontLinks)
    }
  },
  markdown: {
    // languages used for twoslash and jsdocs in twoslash
    languages: ['ts', 'js', 'json'],
    codeTransformers: [
      transformerTwoslash() as any,
      // add `style:*` support
      {
        root(hast) {
          const meta = this.options.meta?.__raw
            ?.split(' ')
            .find((m) => m.startsWith('style:'))
          if (meta) {
            const style = meta.slice('style:'.length)
            const rootPre = hast.children.find(
              (n): n is typeof n & { type: 'element'; tagName: 'pre' } =>
                n.type === 'element' && n.tagName === 'pre',
            )
            if (rootPre) {
              rootPre.properties.style += '; ' + style
            }
          }
        },
      },
    ],
    config(md) {
      md.use(groupIconMdPlugin, {
        titleBar: {
          includeSnippet: true
        }
      })
      md.use(markdownItImageSize, {
        publicDir: path.resolve(import.meta.dirname, '../public')
      })
    }
  },
  vite: {
    plugins: [
      // @ts-ignore
      groupIconVitePlugin({
        customIcon: {
          firebase: 'vscode-icons:file-type-firebase',
<<<<<<< HEAD
          '.gitlab-ci.yml': 'vscode-icons:file-type-gitlab'
        }
      })
    ],
    optimizeDeps: {
      include: [
        '@shikijs/vitepress-twoslash/client',
        'gsap',
        'gsap/dist/ScrollTrigger',
        'gsap/dist/MotionPathPlugin'
      ]
=======
          '.gitlab-ci.yml': 'vscode-icons:file-type-gitlab',
          'vite.config': localIconLoader(
            import.meta.url,
            '../public/logo-without-border.svg',
          ),
        },
      }),
      llmstxt({
        ignoreFiles: ['blog/*', 'blog.md', 'index.md', 'team.md'],
        description: 'The Build Tool for the Web',
        details: `\
- 💡 Instant Server Start
- ⚡️ Lightning Fast HMR
- 🛠️ Rich Features
- 📦 Optimized Build
- 🔩 Universal Plugin Interface
- 🔑 Fully Typed APIs

Vite is a new breed of frontend build tooling that significantly improves the frontend development experience. It consists of two major parts:

- A dev server that serves your source files over [native ES modules](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules), with [rich built-in features](https://vite.dev/guide/features.md) and astonishingly fast [Hot Module Replacement (HMR)](https://vite.dev/guide/features.md#hot-module-replacement).

- A [build command](https://vite.dev/guide/build.md) that bundles your code with [Rollup](https://rollupjs.org), pre-configured to output highly optimized static assets for production.

In addition, Vite is highly extensible via its [Plugin API](https://vite.dev/guide/api-plugin.md) and [JavaScript API](https://vite.dev/guide/api-javascript.md) with full typing support.`,
      }),
    ],
    optimizeDeps: {
      include: ['@shikijs/vitepress-twoslash/client'],
>>>>>>> 71ce737810d515ededd7e1ca0a59a5b48c339958
    },
    define: {
      __VITE_VERSION__: JSON.stringify(viteVersion)
    }
  },
  buildEnd
})

export default extendConfig(config)
