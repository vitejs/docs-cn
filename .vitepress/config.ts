import type { DefaultTheme } from 'vitepress'
import { defineConfig, createContentLoader } from 'vitepress'
import { transformerTwoslash } from '@shikijs/vitepress-twoslash'
import {
  groupIconMdPlugin,
  groupIconVitePlugin
} from 'vitepress-plugin-group-icons'
import { buildEnd } from './buildEnd.config'
import { withMermaid } from 'vitepress-plugin-mermaid'
import { joinURL, withoutTrailingSlash } from 'ufo'
import { SitemapStream } from 'sitemap'
import { createWriteStream } from 'node:fs'
import { resolve } from 'node:path'

const ogDescription = 'Learn DevSecOps through practical guides and examples'
const ogImage = 'https://devsecforge.io/icons/android-chrome-512x512.png'
const ogTitle = 'DevSecOps Documentation'
const ogUrl = 'https://devsecforge.io'

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
    // Remove the existing sitemap configuration as we're using buildEnd for it
    
    // Enable lastUpdated for <lastmod> tags in sitemap
    lastUpdated: true,
    
    // Enable clean URLs for better SEO (removes .html extension)
    cleanUrls: true,
    
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
    title: 'DevSecOps',
    description: 'DevSecOps Documentation',
    lang: 'en-EN',

    head: [
      ['link', { rel: 'icon', type: 'image/png', href: '/icons/android-chrome-192x192.png' }],
      [
        'link',
        { rel: 'alternate', type: 'application/rss+xml', title: 'DevSecOps RSS Feed', href: '/blog.rss' }
      ],
      [
        'link',
        { rel: 'alternate', type: 'application/atom+xml', title: 'DevSecOps Atom Feed', href: '/blog.atom' }
      ],
      [
        'link',
        { rel: 'alternate', type: 'application/json', title: 'DevSecOps JSON Feed', href: '/blog.json' }
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
      ['meta', { property: 'og:site_name', content: 'DevSecForge' }],
      ['meta', { name: 'twitter:card', content: 'summary' }],
      ['meta', { name: 'twitter:site', content: '@devsecforge' }],
      ['meta', { name: 'twitter:title', content: ogTitle }],
      ['meta', { name: 'twitter:description', content: ogDescription }],
      ['meta', { name: 'twitter:image', content: ogImage }],
      ['meta', { name: 'theme-color', content: '#bd34fe' }],
      [
        'script',
        {
          async: '',
          src: 'https://www.googletagmanager.com/gtag/js?id=GTM-NPBF76F8'
        }
      ],
      [
        'script',
        {},
        `window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', 'GTM-NPBF76F8');`
      ]
    ],

    themeConfig: {
      logo: '/icons/android-chrome-192x192.png',

      editLink: {
        pattern: 'https://github.com/devsecforge/docs/edit/main/:path',
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
        copyright: 'Copyright © 2024-Now - DevSecForge'
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
        { text: 'CI/CD', link: '/CICD/', activeMatch: '/CICD/' },
        { text: 'Development', link: '/Development/', activeMatch: '/Development/' },
        { text: 'Others', link: '/Others/', activeMatch: '/Others/' },
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
                    text: '📌 Docker',
                    collapsed: true,
                    items: [
                      {
                        text: 'Docker',
                        link: '/Infrastructure/Docker/Docker'
                      },
                      {
                        text: 'Docker Swarm',
                        link: '/Infrastructure/Docker/DockerSwarm'
                      },
                      {
                        text: 'Portainer',
                        link: '/Infrastructure/Docker/Portainer'
                      }
                    ]
                  },
                  {
                    text: '📌 Kubernetes',
                    collapsed: true,
                    items: [
                      {
                        text: 'Install',
                        link: '/Infrastructure/Kubernetes/Install'
                      },
                      {
                        text: 'Basic Deployment',
                        link: '/Infrastructure/Kubernetes/Basic-deploy'
                      },
                      {
                        text: 'Configuration',
                        link: '/Infrastructure/Kubernetes/Configuration'
                      }
                    ]
                  },
                  {
                    text: '📌 Terraform',
                    collapsed: true,
                    items: [
                      {
                        text: 'Install',
                        link: '/Infrastructure/Terraform/Install'
                      },
                      {
                        text: 'Configuration',
                        link: '/Infrastructure/Terraform/Configuration'
                      }
                    ]
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
                    link: '/Infrastructure/Networking/Wireguard'
                  },
                  {
                    text: 'Traefik',
                    link: '/Infrastructure/Networking/Traefik'
                  },
                  {
                    text: 'Authentik',
                    link: '/Infrastructure/Networking/Authentik'
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
        ],
        '/CICD/': [
          {
            text: 'CI/CD',
            items: [
              {
                text: 'Continuous Integration',
                collapsed: false,
                items: [
                  {
                    text: 'GitHub Actions',
                    link: '/CICD/Github-CI'
                  },
                  {
                    text: 'GitLab CI',
                    link: '/CICD/GitLab-CI'
                  }
                ]
              },
              {
                text: 'Static Code Analysis',
                collapsed: false,
                items: [
                  {
                    text: 'Semgrep',
                    link: '/CICD/Static-Analysis/Semgrep'
                  },
                  {
                    text: 'SonarQube',
                    link: '/CICD/Static-Analysis/SonarQube'
                  },
                  {
                    text: 'CodeQL',
                    link: '/CICD/Static-Analysis/CodeQL'
                  },
                  {
                    text: 'Bandit',
                    link: '/CICD/Static-Analysis/Bandit'
                  },
                  {
                    text: 'gosec',
                    link: '/CICD/Static-Analysis/gosec'
                  }
                ]
              },
              {
                text: 'Security Scanning',
                collapsed: false,
                items: [
                  {
                    text: 'Trivy Security Scanner',
                    link: '/CICD/Trivy'
                  },
                  {
                    text: 'Complete Security Scanning Tutorial',
                    link: '/CICD/Pipline-Templates'
                  }
                ]
              },
              {
                text: 'Pipeline Templates',
                collapsed: false,
                items: [
                  {
                    text: 'GitHub Actions Templates',
                    link: '/CICD/Github-Templates'
                  },
                  {
                    text: 'GitLab CI Templates',
                    link: '/CICD/GitLab-Templates'
                  }
                ]
              }
              // {
              //   text: 'Continuous Deployment',
              //   collapsed: false,
              //   items: [
              //     {
              //       text: 'Docker Registry',
              //       link: '/CICD/Docker-Registry'
              //     },
              //     {
              //       text: 'Automated Deployment',
              //       link: '/CICD/Automated-Deployment'
              //     }
              //   ]
              // }
            ]
          }
        ],
        '/Development/': [
          {
            text: 'Development',
            items: [
              {
                text: 'Languages',
                collapsed: false,
                items: [
                  {
                    text: '📌 Go',
                    collapsed: true,
                    items: [
                      {
                        text: 'Go Basics',
                        link: '/Development/Languages/Go/Go-Basics'
                      },
                      {
                        text: 'Installing Go',
                        link: '/Development/Languages/Go/Go-Install'
                      }
                    ]
                  },
                  {
                    text: '📌 Rust',
                    collapsed: true,
                    items: [
                      {
                        text: 'Rust Basics',
                        link: '/Development/Languages/Rust/Rust-Basics'
                      },
                      {
                        text: 'Installing Rust',
                        link: '/Development/Languages/Rust/Rust-Install'
                      }
                    ]
                  }
                ]
              },
              {
                text: 'Best Practices',
                collapsed: false,
                items: [
                  {
                    text: 'IDE Setup',
                    link: '/Development/VScode-Optimizations'
                  },
                  {
                    text: 'Version Control',
                    link: '/Development/AutoVersionning'
                  }
                ]
              }
            ]
          }
        ],
        '/Others/': [
          {
            text: 'Others',
            items: [
              {
                text: 'Miscellaneous',
                collapsed: false,
                items: [
                  {
                    text: 'Bot Terms of Service',
                    link: '/Others/Terms-of-Service'
                  },
                  {
                    text: 'Bot Privacy Policy',
                    link: '/Others/Privacy-Policy'
                  }
                ]
              }
            ]
          }
        ]
      }
    },
    transformPageData(pageData) {
      // Initialize head array if it doesn't exist
      pageData.frontmatter.head ??= []
      
      // Create canonical URL without .html extension for better SEO
      const canonicalUrl = joinURL(
        ogUrl,
        withoutTrailingSlash(pageData.relativePath.replace(/(index)?\.md$/, ''))
      )
      
      // Add dynamic metadata for better SEO and social sharing
      pageData.frontmatter.head.push(
        // Canonical URL
        ['link', { rel: 'canonical', href: canonicalUrl }],
        
        // OpenGraph title
        ['meta', { 
          property: 'og:title', 
          content: pageData.frontmatter.title || pageData.title || ogTitle 
        }],
        
        // Twitter title
        ['meta', { 
          name: 'twitter:title', 
          content: pageData.frontmatter.title || pageData.title || ogTitle 
        }],
        
        // OpenGraph description
        ['meta', { 
          property: 'og:description', 
          content: pageData.frontmatter.description || pageData.description || ogDescription 
        }],
        
        // Twitter description
        ['meta', { 
          name: 'twitter:description', 
          content: pageData.frontmatter.description || pageData.description || ogDescription 
        }],
        
        // OpenGraph URL for the current page
        ['meta', { property: 'og:url', content: canonicalUrl }]
      )
      
      // Add OpenGraph image if specified in frontmatter, otherwise use default
      if (pageData.frontmatter.image) {
        const imageUrl = pageData.frontmatter.image.startsWith('http') 
          ? pageData.frontmatter.image 
          : joinURL(ogUrl, pageData.frontmatter.image)
        
        pageData.frontmatter.head.push(
          ['meta', { property: 'og:image', content: imageUrl }],
          ['meta', { name: 'twitter:image', content: imageUrl }]
        )
      }
      
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
    buildEnd: async (siteConfig) => {
      // Run the existing buildEnd function if it exists
      if (typeof buildEnd === 'function') {
        await buildEnd(siteConfig);
      }
      
      // Generate sitemap
      const { outDir } = siteConfig;
      const hostname = 'https://devsecforge.io';
      const sitemap = new SitemapStream({ hostname });
      const pages = await createContentLoader('**/*.md').load();
      const writeStream = createWriteStream(resolve(outDir, 'sitemap.xml'));
      
      sitemap.pipe(writeStream);
      
      // Process each page
      pages.forEach((page) => {
        // Skip Terms of Service and Privacy Policy pages
        if (page.url.includes('/others/terms-of-service') || 
            page.url.includes('/others/privacy-policy')) {
          return;
        }
        
        // Write the URL to the sitemap
        sitemap.write({
          url: page.url
            // Strip `index.html` from URL
            .replace(/index\.html$/g, '')
            // Ensure URL starts with a slash
            .replace(/^\/?/, '/'),
          lastmod: page.frontmatter?.lastUpdated 
            ? new Date(page.frontmatter.lastUpdated).toISOString()
            : undefined
        });
      });
      
      sitemap.end();
      
      // Wait for the stream to finish
      await new Promise((resolve) => writeStream.on('finish', resolve));
      
      console.log('Sitemap generated successfully');
    },
  })
)
