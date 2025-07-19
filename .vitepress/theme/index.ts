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
import './styles/custom-layout.css' // Import the new custom layout CSS
import googleAnalytics from 'vitepress-plugin-google-analytics'


export default {
  extends: DefaultTheme,
  Layout() {
    return h(DefaultTheme.Layout, null, {
      'aside-outline-after': () => h(WwAds),
      // 'aside-ads-before': () => h(AsideSponsors),
    })
  },
  enhanceApp({ app }) {
    googleAnalytics({
      id: 'G-F1N4D1JTS8', // Replace with your GoogleAnalytics ID, which should start with the 'G-'
    })
    app.component('SvgImage', SvgImage)
    app.component('ReleaseTag', ReleaseTag)
    app.component('YouTubePlayer', YouTubePlayer)
    app.component('DifficultyIndicator', DifficultyIndicator)
    app.component('ToolComparisonMatrix', ToolComparisonMatrix)
    app.use(TwoslashFloatingVue)
  },
} satisfies Theme

