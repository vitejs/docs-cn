import { h } from 'vue'
import type { Theme } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import TwoslashFloatingVue from '@shikijs/vitepress-twoslash/client'
import '@shikijs/vitepress-twoslash/style.css'
import './styles/vars.css'
import './styles/landing.css'
import AsideSponsors from './components/AsideSponsors.vue'
import SvgImage from './components/SvgImage.vue'
<<<<<<< HEAD
import WwAds from './components/WwAds.vue'
import ReleaseTag from './components/ReleaseTag.vue'
import './custom.css'
=======
import YouTubeVideo from './components/YouTubeVideo.vue'
>>>>>>> db0517b83d2535549c9c929b32afa3ae005d20ed
import 'virtual:group-icons.css'

export default {
  extends: DefaultTheme,
  Layout() {
    return h(DefaultTheme.Layout, null, {
      'aside-outline-after': () => h(WwAds),
      'aside-ads-before': () => h(AsideSponsors),
    })
  },
  enhanceApp({ app }) {
    app.component('SvgImage', SvgImage)
<<<<<<< HEAD
    app.component('ReleaseTag', ReleaseTag)
=======
    app.component('YouTubeVideo', YouTubeVideo)
>>>>>>> db0517b83d2535549c9c929b32afa3ae005d20ed
    app.use(TwoslashFloatingVue)
  },
} satisfies Theme

