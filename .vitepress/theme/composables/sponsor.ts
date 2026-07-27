import { onMounted, ref } from 'vue'
import type { Sponsor, SponsorTier } from '@voidzero-dev/vitepress-theme'

interface Sponsors {
  main: Sponsor[]
  partnership: Sponsor[]
  platinum: Sponsor[]
  gold: Sponsor[]
}

// shared data across instances so we load only once.
const data = ref<SponsorTier[]>()

export function useSponsor() {
  onMounted(async () => {
    if (data.value) return

    const result = await fetch('https://sponsors.vite.dev/sponsors.json')
    const sponsors: Sponsors = await result.json()

    data.value = [
      {
        tier: 'Brought to you by',
        size: 'big',
        items: sponsors.main,
      },
      {
        tier: '特别赞助商',
        size: 'big',
        items: sponsors.partnership,
      },
      {
        tier: '铂金赞助商',
        size: 'big',
        items: sponsors.platinum,
      },
      {
        tier: '金牌赞助商',
        size: 'medium',
        items: sponsors.gold,
      },
    ]
  })

  return data
}