import type { DefaultTheme } from 'vitepress'
import { defineConfig } from 'vitepress'
import { transformerTwoslash } from '@shikijs/vitepress-twoslash'
import {
  groupIconMdPlugin,
  groupIconVitePlugin
} from 'vitepress-plugin-group-icons'
import { buildEnd } from './buildEnd.config'

const ogDescription = 'Next Generation Frontend Tooling'
const ogImage = 'https://vite.dev/og-image.jpg'
const ogTitle = 'Vite'
const ogUrl = 'https://vite.dev'

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
  const oldVersions: DefaultTheme.NavItemWithLink[] = [
    {
      text: 'Vite 4 Docs',
      link: 'https://v4.vite.dev'
    },
    {
      text: 'Vite 3 Docs',
      link: 'https://v3.vite.dev'
    },
    {
      text: 'Vite 2 Docs',
      link: 'https://v2.vite.dev'
    }
  ]

  switch (deployType) {
    case 'main':
    case 'local':
      return [
        {
          text: 'Vite 5 Docs (release)',
          link: 'https://vite.dev'
        },
        ...oldVersions
      ]
    case 'release':
      return oldVersions
  }
})()

export default defineConfig({
  title: 'Satcom - Docs',
  description: 'DevSecOps Documentation',
  lang: 'en-EN',

  head: [
    ['link', { rel: 'icon', type: 'image/svg+xml', href: '/logo.svg' }],
    [
      'link',
      { rel: 'alternate', type: 'application/rss+xml', href: '/blog.rss' }
    ],
    ['link', { rel: 'preconnect', href: 'https://fonts.googleapis.com' }],
    [
      'link',
      {
        rel: 'preconnect',
        href: 'https://fonts.gstatic.com',
        crossorigin: 'true'
      }
    ],
    [
      'link',
      {
        rel: 'preload',
        href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Manrope:wght@600&family=IBM+Plex+Mono:wght@400&display=swap',
        as: 'style'
      }
    ],
    [
      'link',
      {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Manrope:wght@600&family=IBM+Plex+Mono:wght@400&display=swap'
      }
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
        defer: ''
      }
    ]
  ],

  themeConfig: {
    logo: '/logo.svg',

    editLink: {
      pattern: 'https://github.com/vitejs/docs-cn/edit/main/:path',
      text: 'Suggest changes to this page'
    },

    outline: {
      label: 'On this page',
      level: [2, 3]
    },

    search: {
      provider: 'algolia',
      options: {
        appId: '7H67QR5P0A',
        apiKey: '208bb9c14574939326032b937431014b',
        indexName: 'vitejs',
        searchParameters: {
          facetFilters: ['tags:cn']
        },
        placeholder: 'Search documentation',
        translations: {
          button: {
            buttonText: 'Search',
            buttonAriaLabel: 'Search'
          },
          modal: {
            searchBox: {
              resetButtonTitle: 'Clear the query',
              resetButtonAriaLabel: 'Clear the query',
              cancelButtonText: 'Cancel',
              cancelButtonAriaLabel: 'Cancel'
            },
            startScreen: {
              recentSearchesTitle: 'Search history',
              noRecentSearchesText: 'No search history',
              saveRecentSearchButtonTitle: 'Save to search history',
              removeRecentSearchButtonTitle: 'Remove from search history',
              favoriteSearchesTitle: 'Favorites',
              removeFavoriteSearchButtonTitle: 'Remove from favorites'
            },
            errorScreen: {
              titleText: 'Unable to fetch results',
              helpText: 'You might need to check your network connection'
            },
            footer: {
              selectText: 'Select',
              navigateText: 'Navigate',
              closeText: 'Close',
              searchByText: 'Search provider'
            },
            noResultsScreen: {
              noResultsText: 'No relevant results found',
              suggestedQueryText: 'You can try querying',
              reportMissingResultsText:
                'Do you think this query should have results?',
              reportMissingResultsLinkText: 'Let us know'
            }
          }
        }
      }
    },

    docFooter: {
      prev: 'Previous page',
      next: 'Next page'
    },

    // Using WwAds for China
    // carbonAds: {
    //   code: 'CEBIEK3N',
    //   placement: 'vitejsdev',
    // },

    footer: {
      message: `Released under the MIT License. (${commitRef})`,
      copyright: 'Copyright © 2019-present VoidZero Inc. & Vite Contributors'
    },

    nav: [
      {
        component: 'ReleaseTag'
      },
      { text: 'Guide', link: '/guide/', activeMatch: '/guide/' },
      { text: 'Config', link: '/config/', activeMatch: '/config/' },
      { text: 'Plugins', link: '/plugins/', activeMatch: '/plugins/' },
      {
        text: 'Related Links',
        items: [
          { text: 'Team', link: '/team' },
          { text: 'Blog', link: '/blog' },
          { text: 'Releases', link: '/releases' },
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
                text: 'Discord Chat',
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
                text: 'Dev.to Community',
                link: 'https://dev.to/t/vite'
              },
              {
                text: 'Changelog',
                link: 'https://github.com/vitejs/vite/blob/main/packages/vite/CHANGELOG.md'
              },
              {
                text: 'Contributing Guide',
                link: 'https://github.com/vitejs/vite/blob/main/CONTRIBUTING.md'
              }
            ]
          }
        ]
      }
    ],

    sidebar: {
      '/guide/': [
        {
          text: 'Guide',
          items: [
            {
              text: 'Docker',
              link: '/guide/Docker'
            }
          ]
        }
      ],
      '/config/': [
        {
          text: 'CyberSec',
          items: [

          ]
        }
      ],
      '/changes/': [
        {
          text: 'Breaking Changes',
          link: '/changes/'
        },
        {
          text: 'Now',
          items: []
        },
        {
          text: 'Future',
          items: [
            {
              text: 'this.environment in Hook Functions',
              link: '/changes/this-environment-in-hooks'
            },
            {
              text: 'HMR hotUpdate Plugin Hook',
              link: '/changes/hotupdate-hook'
            },
            {
              text: 'Migrating to Environment-Based APIs',
              link: '/changes/per-environment-apis'
            },
            {
              text: 'Server-Side Rendering Using ModuleRunner API',
              link: '/changes/ssr-using-modulerunner'
            },
            {
              text: 'Shared Plugins During Build',
              link: '/changes/shared-plugins-during-build'
            }
          ]
        },
        {
          text: 'Past',
          items: []
        }
      ]
    }
  },
  transformPageData(pageData) {
    const canonicalUrl = `${ogUrl}/${pageData.relativePath}`
      .replace(/\/index\.md$/, '/')
      .replace(/\.md$/, '/')
    pageData.frontmatter.head ??= []
    pageData.frontmatter.head.unshift(
      ['link', { rel: 'canonical', href: canonicalUrl }],
      ['meta', { property: 'og:title', content: pageData.title }]
    )
    return pageData
  },
  markdown: {
    codeTransformers: [transformerTwoslash()],
    config(md) {
      md.use(groupIconMdPlugin)
    }
  },
  vite: {
    plugins: [
      groupIconVitePlugin({
        customIcon: {
          firebase: 'vscode-icons:file-type-firebase',
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
    }
  },
  buildEnd
})
