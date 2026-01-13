import { h } from 'vue'
import TwoslashFloatingVue from '@shikijs/vitepress-twoslash/client'
import '@shikijs/vitepress-twoslash/style.css'
import 'virtual:group-icons.css'
import Theme from '@voidzero-dev/vitepress-theme/src/vite'
import './styles.css'

// components
import SvgImage from './components/SvgImage.vue'
import WwAds from './components/WwAds.vue'
import './custom.css'
import YouTubeVideo from './components/YouTubeVideo.vue'
import NonInheritBadge from './components/NonInheritBadge.vue'
import AsideSponsors from './components/AsideSponsors.vue'

export default {
  Layout() {
<<<<<<< HEAD
    return h(DefaultTheme.Layout, null, {
      'aside-outline-after': () => h(WwAds),
      'layout-top': () => h(SponsorBanner),
      'aside-ads-before': () => h(AsideSponsors)
=======
    return h((Theme as any).Layout, null, {
      'aside-ads-before': () => h(AsideSponsors),
>>>>>>> 7f01a8e976d17c5107c79e80c3c6847f589ab7fa
    })
  },
  enhanceApp(ctx: any) {
    const { app } = ctx

    app.component('SvgImage', SvgImage)
    app.component('YouTubeVideo', YouTubeVideo)
    app.component('NonInheritBadge', NonInheritBadge)
    app.use(TwoslashFloatingVue)
<<<<<<< HEAD
  }
} satisfies Theme
=======

    Theme.enhanceApp(ctx)
  },
}
>>>>>>> 7f01a8e976d17c5107c79e80c3c6847f589ab7fa
