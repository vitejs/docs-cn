import { h } from 'vue'
import type { Theme } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import matomo from "vitepress-plugin-matomo";
import TwoslashFloatingVue from '@shikijs/vitepress-twoslash/client'
import '@shikijs/vitepress-twoslash/style.css'
import './styles/vars.css'
import './styles/landing.css'
// import AsideSponsors from './components/AsideSponsors.vue'
import SvgImage from './components/SvgImage.vue'
import WwAds from './components/WwAds.vue'
import ReleaseTag from './components/ReleaseTag.vue'
import './custom.css'
import 'virtual:group-icons.css'
import YouTubePlayer from '../customComponents/youtube-player.vue'
import DifficultyIndicator from '../customComponents/DifficultyIndicator.vue'
import ToolComparisonMatrix from '../customComponents/ToolComparisonMatrix.vue'

export default {
  extends: DefaultTheme,
  Layout() {
    return h(DefaultTheme.Layout, null, {
      'aside-outline-after': () => h(WwAds),
      // 'aside-ads-before': () => h(AsideSponsors),
    })
  },
  enhanceApp({ app }) {
    app.component('SvgImage', SvgImage)
    app.component('ReleaseTag', ReleaseTag)
    app.component('YouTubePlayer', YouTubePlayer)
    app.component('DifficultyIndicator', DifficultyIndicator)
    app.component('ToolComparisonMatrix', ToolComparisonMatrix)
    app.use(TwoslashFloatingVue)
  },
} satisfies Theme

