import type { DefaultTheme } from 'vitepress'
import { defineConfig } from 'vitepress'
import { transformerTwoslash } from '@shikijs/vitepress-twoslash'
import {
  groupIconMdPlugin,
  groupIconVitePlugin
} from 'vitepress-plugin-group-icons'
import { buildEnd } from './buildEnd.config'
import { withMermaid } from 'vitepress-plugin-mermaid'

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

export default withMermaid(
  defineConfig({
    mermaid: {
      // Theme configuration
      theme: {
        light: 'default',
        dark: 'dark'
      },

      // Global Mermaid configuration
      mermaidConfig: {
        startOnLoad: true,
        flowchart: {
          useMaxWidth: true,
          htmlLabels: true,
          curve: 'basis',
          nodeSpacing: 100, // Increase spacing between nodes
          rankSpacing: 100 // Increase spacing between ranks/levels
        },
        securityLevel: 'loose',
        viewport: {
          width: 1200,
          height: 900
        },
        interaction: {
          enabled: true, // Enable all interactions
          click: true, // Enable click events
          hover: true, // Enable hover events
          pan: true, // Enable panning
          zoomInButton: true, // Show zoom in button
          zoomOutButton: true // Show zoom out button
        },
        // Global font size settings
        fontSize: 16, // Increased base font size
        fontFamily: 'Inter',
        scale: 1.8, // Global scale factor
        maxTextSize: 12, // Maximum text size in flowcharts

        // Sequence diagram specific settings
        sequence: {
          width: 1200, // Width of sequence diagrams
          height: 800, // Height of sequence diagrams
          boxMargin: 20, // Margin around boxes
          messageMargin: 60 // Margin between messages
        }
      }
    },
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

      footer: {
        message: `Released under the MIT License. (${commitRef})`,
        copyright: 'Copyright © 2024-Now - Satcom'
      },

      nav: [
        {
          component: 'ReleaseTag'
        },
        {
          text: 'Infrastructure',
          link: '/Infrastructure/',
          activeMatch: '/Infrastructure/'
        },
        { text: 'CyberSec', link: '/CyberSec/', activeMatch: '/CyberSec/' },
        {
          text: 'Related Links',
          items: [
            {
              items: [
                {
                  text: 'Bluesky',
                  link: 'https://bsky.app/profile/vite.dev'
                }
              ]
            }
          ]
        }
      ],

      sidebar: {
        '/Infrastructure/': [
          {
            text: 'Infrastructure',
            items: [
              {
                text: 'Containerization',
                collapsed: false,
                items: [
                  {
                    text: 'Docker',
                    link: '/Infrastructure/Docker'
                  },
                  {
                    text: 'Docker Swarm',
                    link: '/Infrastructure/DockerSwarm'
                  }
                ]
              },
              {
                text: 'Applications',
                collapsed: false,
                items: [
                  {
                    text: 'Vaultwarden',
                    link: '/Infrastructure/Vaultwarden'
                  },
                  {
                    text: 'Watchtower',
                    link: '/Infrastructure/Watchtower'
                  }
                ]
              },
              {
                text: 'Networking',
                collapsed: false,
                items: [
                  {
                    text: 'Wireguard',
                    link: '/Infrastructure/Wireguard'
                  },
                  {
                    text: 'Traefik',
                    link: '/Infrastructure/Traefik'
                  }
                ]
              }
            ]
          }
        ],
        '/CyberSec/': [
          {
            text: 'CyberSec',
            items: [
              {
                text: 'Applications',
                collapsed: false,
                items: [
                  {
                    text: 'CrowdSec',
                    link: '/CyberSec/CrowdSec'
                  },
                  {
                    text: 'Fail2Ban',
                    link: '/CyberSec/Fail2Ban'
                  }
                ]
              },
              {
                text: 'Methodologies',
                collapsed: false,
                items: [
                  {
                    text: 'LinuxHardening',
                    link: '/CyberSec/LinuxHardening'
                  }
                ]
              }
            ]
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
)
