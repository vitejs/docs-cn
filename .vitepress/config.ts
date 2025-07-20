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

// Enhanced SEO descriptions with targeted keywords
const ogDescription = 'Learn DevSecOps through practical guides, CI/CD pipelines, GitHub Actions templates, and security tools like Fail2Ban, Trivy Scanner, and more'
const ogImage = 'https://devsecforge.io/icons/android-chrome-512x512.png'
const ogTitle = 'DevSecOps Documentation - CI/CD, GitHub Actions, Security Tools'
const ogUrl = 'https://devsecforge.io'
const ogKeywords = [
  'devsecops', 'ci cd', 'ci/cd', 'github actions templates', 'fail2ban configuration', 'fail2ban config',
  'trivy scanner', 'portainer high availability', 'securecodewarrior/github-action-gosec', 'wireguard-ui',
  'bandit python security linter', 'security tools', 'security linter', 'container security', 'github actions',
  'security scanner', 'devsecops pipeline', 'security best practices', 'cybersecurity', 'docker security'
].join(', ')

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
          nodeSpacing: 100 // Increase spacing between nodes
          , rankSpacing: 100 // Increase spacing between ranks/levels
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
    description: 'Comprehensive DevSecOps documentation covering CI/CD pipelines, GitHub Actions templates, Fail2Ban configuration, Trivy scanner, and security best practices',
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
      // Add keywords meta tag for search engines
      ['meta', { name: 'keywords', content: ogKeywords }],
      // Add extra meta tags for SEO "first impressions" and top result intent
      ['meta', { name: 'google-site-verification', content: 'first-impression-top-result' }],
      ['meta', { name: 'robots', content: 'index,follow,max-snippet:-1,max-image-preview:large,max-video-preview:-1' }],
      // Add OpenGraph and Twitter meta tags for each main keyword/topic
      ['meta', { property: 'og:title', content: 'DevSecOps CI/CD & GitHub Actions Templates' }],
      ['meta', { property: 'og:title', content: 'Fail2Ban Configuration & Security Best Practices' }],
      ['meta', { property: 'og:title', content: 'Trivy Scanner for Container Security' }],
      ['meta', { property: 'og:title', content: 'Portainer High Availability Guide' }],
      ['meta', { property: 'og:title', content: 'Wireguard-UI VPN Management' }],
      ['meta', { property: 'og:title', content: 'Bandit Python Security Linter' }],
      ['meta', { property: 'og:title', content: 'Gosec SecureCodeWarrior GitHub Action' }],
      ['meta', { name: 'twitter:title', content: 'DevSecOps CI/CD & GitHub Actions Templates' }],
      ['meta', { name: 'twitter:title', content: 'Fail2Ban Configuration & Security Best Practices' }],
      ['meta', { name: 'twitter:title', content: 'Trivy Scanner for Container Security' }],
      ['meta', { name: 'twitter:title', content: 'Portainer High Availability Guide' }],
      ['meta', { name: 'twitter:title', content: 'Wireguard-UI VPN Management' }],
      ['meta', { name: 'twitter:title', content: 'Bandit Python Security Linter' }],
      ['meta', { name: 'twitter:title', content: 'Gosec SecureCodeWarrior GitHub Action' }],
      // Add FAQPage and Article structured data for Google rich results
      ['script', { type: 'application/ld+json' }, `
        {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          "mainEntity": [
            {
              "@type": "Question",
              "name": "What is DevSecOps CI/CD?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "DevSecOps CI/CD integrates security into continuous integration and deployment pipelines, ensuring code and infrastructure are secure at every stage."
              }
            },
            {
              "@type": "Question",
              "name": "How do I configure Fail2Ban for maximum security?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Fail2Ban configuration involves setting up jail rules, ban times, and log monitoring to automatically block malicious IPs and brute-force attempts."
              }
            },
            {
              "@type": "Question",
              "name": "What is Trivy Scanner and how is it used?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Trivy Scanner is an open-source tool for scanning container images, filesystems, and IaC for vulnerabilities, secrets, and misconfigurations."
              }
            },
            {
              "@type": "Question",
              "name": "How do I enable high availability in Portainer?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Portainer high availability is achieved by deploying multiple instances with a shared database and load balancer for failover and redundancy."
              }
            },
            {
              "@type": "Question",
              "name": "What is Wireguard-UI?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Wireguard-UI is a web-based management interface for Wireguard VPN, simplifying user and peer management."
              }
            },
            {
              "@type": "Question",
              "name": "How do I use Bandit Python Security Linter?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Bandit scans Python code for common security issues, such as hardcoded passwords, insecure cryptography, and injection risks."
              }
            },
            {
              "@type": "Question",
              "name": "How do I use securecodewarrior/github-action-gosec?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "The securecodewarrior/github-action-gosec integrates Go security scanning into GitHub Actions workflows, detecting vulnerabilities in Go code."
              }
            }
          ]
        }
      `],
      ['script', { type: 'application/ld+json' }, `
        {
          "@context": "https://schema.org",
          "@type": "Article",
          "headline": "DevSecOps CI/CD, GitHub Actions Templates, Fail2Ban Configuration, Trivy Scanner, Portainer High Availability, Wireguard-UI, Bandit Python Security Linter, securecodewarrior/github-action-gosec",
          "keywords": "${ogKeywords}",
          "author": { "@type": "Organization", "name": "DevSecForge" },
          "publisher": { "@type": "Organization", "name": "DevSecForge" },
          "image": "${ogImage}",
          "mainEntityOfPage": { "@type": "WebPage", "@id": "${ogUrl}" }
        }
      `],
      // ...existing code...
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
                      },
                      {
                        text: 'Cluster Setup',
                        link: '/Infrastructure/Kubernetes/Cluster-Setup'
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
              },
              {
                text: 'Container Security',
                collapsed: false,
                items: [
                  {
                    text: 'Docker Hardening',
                    link: '/CyberSec/Container-Security/Docker-Hardening'
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
                  },
                  {
                    text: 'GitHub Actions Pipelines',
                    link: '/CICD/GitHub-Actions-Pipeline'
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
                      },
                      {
                        text: 'Data Types',
                        link: '/Development/Languages/Go/Data-Types'
                      },
                      {
                        text: 'Flow Control',
                        link: '/Development/Languages/Go/Flow-Control'
                      },
                      {
                        text: 'Functions',
                        link: '/Development/Languages/Go/Functions'
                      },
                      {
                        text: 'Structs & Maps',
                        link: '/Development/Languages/Go/Structs-Maps'
                      },
                      {
                        text: 'Packages',
                        link: '/Development/Languages/Go/Packages'
                      },
                      {
                        text: 'Concurrency',
                        link: '/Development/Languages/Go/Concurrency'
                      },
                      {
                        text: 'Error Handling',
                        link: '/Development/Languages/Go/Error-Handling'
                      },
                      {
                        text: 'Methods & Interfaces',
                        link: '/Development/Languages/Go/Methods-Interfaces'
                      },
                      {
                        text: 'Testing',
                        link: '/Development/Languages/Go/Testing'
                      },
                      {
                        text: 'Web Development',
                        link: '/Development/Languages/Go/Web-Development'
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
                      },
                      {
                        text: 'Data Types',
                        link: '/Development/Languages/Rust/Rust-Types'
                      },
                      {
                        text: 'Strings',
                        link: '/Development/Languages/Rust/Rust-Strings'
                      },
                      {
                        text: 'Operators',
                        link: '/Development/Languages/Rust/Rust-Operators'
                      },
                      {
                        text: 'Flow Control',
                        link: '/Development/Languages/Rust/Rust-FlowControl'
                      },
                      {
                        text: 'Functions',
                        link: '/Development/Languages/Rust/Rust-Functions'
                      },
                      {
                        text: 'Miscellaneous',
                        link: '/Development/Languages/Rust/Rust-Misc'
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

      // Keyword aliases for SEO
      const keywordAliases: Record<string, string[]> = {
        'fail2ban': ['fail2ban configuration', 'fail2ban config'],
        'ci/cd': ['devsecops ci cd', 'ci cd', 'devsecops ci/cd'],
        'github actions': ['github actions templates'],
        'gosec': ['securecodewarrior/github-action-gosec'],
        'wireguard': ['wireguard-ui'],
        'bandit': ['bandit python security linter'],
        'trivy': ['trivy scanner'],
        'portainer': ['portainer high availability']
      }

      // Create canonical URL without .html extension for better SEO
      const canonicalUrl = joinURL(
        ogUrl,
        withoutTrailingSlash(pageData.relativePath.replace(/(index)?\.md$/, ''))
      )

      // Create page-specific keywords based on title, description, and all target keywords
      let baseKeywords = [
        ...ogKeywords.split(', '),
        ...(pageData.frontmatter.title || pageData.title || '').toLowerCase().split(' '),
        ...(pageData.frontmatter.description || pageData.description || '').toLowerCase().split(' ')
      ]
        .filter(keyword => keyword.length > 2)
        .filter((item, index, self) => self.indexOf(item) === index)

      // Add aliases for each keyword
      let pageKeywords: string[] = []
      baseKeywords.forEach(keyword => {
        pageKeywords.push(keyword)
        if (keywordAliases[keyword]) {
          pageKeywords.push(...keywordAliases[keyword])
        }
      })
      // Deduplicate and limit to 25
      pageKeywords = pageKeywords.filter((item, index, self) => self.indexOf(item) === index).slice(0, 25)
      const pageKeywordsStr = pageKeywords.join(', ')

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
        ['meta', { property: 'og:url', content: canonicalUrl }],

        // Page-specific keywords (with aliases)
        ['meta', { name: 'keywords', content: pageKeywordsStr }],
        // Add extra meta tags for SEO "first impressions" and top result intent
        ['meta', { name: 'google-site-verification', content: 'first-impression-top-result' }],
        ['meta', { name: 'robots', content: 'index,follow,max-snippet:-1,max-image-preview:large,max-video-preview:-1' }]
      )
      
      // Add structured data for the current page
      pageData.frontmatter.head.push(
        ['script', { type: 'application/ld+json' },
          `{
            "@context": "https://schema.org",
            "@type": "TechArticle",
            "headline": "${pageData.frontmatter.title || pageData.title || ogTitle}",
            "description": "${pageData.frontmatter.description || pageData.description || ogDescription}",
            "image": "${pageData.frontmatter.image || ogImage}",
            "author": {
              "@type": "Organization",
              "name": "DevSecForge"
            },
            "publisher": {
              "@type": "Organization",
              "name": "DevSecForge",
              "logo": {
                "@type": "ImageObject",
                "url": "${ogUrl}/icons/android-chrome-192x192.png"
              }
            },
            "url": "${canonicalUrl}",
            "mainEntityOfPage": {
              "@type": "WebPage",
              "@id": "${canonicalUrl}"
            },
            "dateModified": "${pageData.lastUpdated ? new Date(pageData.lastUpdated).toISOString() : new Date().toISOString()}"
          }`
        ]
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
      
      // Generate sitemap with priority and changefreq attributes for better SEO
      const { outDir } = siteConfig;
      const hostname = 'https://devsecforge.io';
      const sitemap = new SitemapStream({ hostname });
      const pages = await createContentLoader('**/*.md').load();
      const writeStream = createWriteStream(resolve(outDir, 'sitemap.xml'));
      
      sitemap.pipe(writeStream);
      
      // High-priority pages based on target keywords
      const highPriorityPatterns = [
        '/cicd/github-templates',
        '/cicd/github-ci',
        '/cicd/trivy',
        '/cybersec/fail2ban',
        '/infrastructure/docker/portainer',
        '/infrastructure/networking/wireguard',
        '/cicd/static-analysis/bandit',
        '/cicd/static-analysis/gosec'
      ];
      
      // Process each page with appropriate priority
      pages.forEach((page) => {
        // Skip Terms of Service and Privacy Policy pages
        if (page.url.includes('/others/terms-of-service') || 
            page.url.includes('/others/privacy-policy')) {
          return;
        }
        
        // Determine priority based on URL patterns
        let priority = 0.7; // Default priority
        let changefreq = 'monthly'; // Default change frequency
        
        // Check if this is a high-priority page
        const isHighPriority = highPriorityPatterns.some(pattern => 
          page.url.toLowerCase().includes(pattern.toLowerCase())
        );
        
        if (page.url === '/') {
          priority = 1.0;
          changefreq = 'daily';
        } else if (isHighPriority) {
          priority = 0.9;
          changefreq = 'weekly';
        } else if (page.url.split('/').length <= 2) {
          priority = 0.8;
          changefreq = 'weekly';
        }
        
        // Write the URL to the sitemap with enhanced SEO attributes
        sitemap.write({
          url: page.url
            // Strip `index.html` from URL
            .replace(/index\.html$/g, '')
            // Ensure URL starts with a slash
            .replace(/^\/?/, '/'),
          lastmod: page.frontmatter?.lastUpdated 
            ? new Date(page.frontmatter.lastUpdated).toISOString()
            : undefined,
          priority: priority,
          changefreq: changefreq
        });
      });
      
      sitemap.end();
      
      // Wait for the stream to finish
      await new Promise((resolve) => writeStream.on('finish', resolve));
      
      console.log('Enhanced SEO sitemap generated successfully');
    },
  })
)
