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
        tier: 'In partnership with',
        size: 'big',
        items: sponsors.partnership,
      },
      {
        tier: 'Platinum Sponsors',
        size: 'big',
        items: sponsors.platinum,
      },
      {
        tier: 'Gold Sponsors',
        size: 'medium',
        items: sponsors.gold,
      },
    ]
  })

<<<<<<< HEAD
  return {
    data,
  }
}

function mapSponsors(sponsors: Sponsors): SponsorTier[] {
  return [
    {
      tier: '合作伙伴',
      size: 'big' as const,
      items: viteSponsors['special'],
    },
    {
      tier: '铂金赞助商',
      size: 'big' as const,
      items: mapImgPath(sponsors['platinum']),
    },
    {
      tier: '黄金赞助商',
      size: 'medium' as const,
      items: [...mapImgPath(sponsors['gold']), ...viteSponsors['gold']],
    },
  ]
}

const viteSponsorNames = new Set(
  Object.values(viteSponsors).flatMap((sponsors) =>
    sponsors.map((s) => s.name),
  ),
)

/**
 * Map Vue/Vite sponsors data to objects and filter out Vite-specific sponsors
 */
function mapImgPath(sponsors: Sponsor[]) {
  return sponsors
    .filter((sponsor) => !viteSponsorNames.has(sponsor.name))
    .map((sponsor) => ({
      ...sponsor,
      img: `${dataHost}/images/${sponsor.img}`,
    }))
=======
  return data
>>>>>>> 6390d286fceb2ef695da0b139071de0a87c6872f
}
