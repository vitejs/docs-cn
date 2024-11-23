import { onMounted, ref } from 'vue'

interface TechLogos {
  infrastructure: TechLogo[]
  containerization: TechLogo[]
  security: TechLogo[]
}

interface TechLogo {
  name: string
  img: string
  url: string
  hasDark?: true
}

const data = ref()

const techStack: TechLogos = {
  infrastructure: [
    {
      name: 'Docker',
      url: 'https://www.docker.com',
      img: '/images/docker.svg',
      hasDark: true
    },
    {
      name: 'Kubernetes',
      url: 'https://kubernetes.io',
      img: '/images/kubernetes.svg',
      hasDark: true
    },
    {
      name: 'Terraform',
      url: 'https://www.terraform.io',
      img: '/images/terraform.svg',
      hasDark: true
    }
  ],
  containerization: [
    {
      name: 'Traefik',
      url: 'https://traefik.io',
      img: '/images/traefik.svg',
      hasDark: true
    },
    {
      name: 'Portainer',
      url: 'https://www.portainer.io',
      img: '/images/portainer.svg',
      hasDark: true
    }
  ],
  security: [
    {
      name: 'CrowdSec',
      url: 'https://www.crowdsec.net',
      img: '/images/crowdsec.svg',
      hasDark: true
    },
    {
      name: 'Vaultwarden',
      url: 'https://github.com/dani-garcia/vaultwarden',
      img: '/images/vaultwarden.svg',
      hasDark: true
    }
  ]
}

export function useSponsor() {
  onMounted(() => {
    if (data.value) return

    data.value = [
      {
        tier: 'Infrastructure',
        size: 'big',
        items: techStack.infrastructure
      },
      {
        tier: 'Containerization',
        size: 'medium',
        items: techStack.containerization
      },
      {
        tier: 'Security',
        size: 'medium',
        items: techStack.security
      }
    ]
  })

  return {
    data
  }
}


