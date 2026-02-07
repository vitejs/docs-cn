import TwoslashFloatingVue from '@shikijs/vitepress-twoslash/client'
import Theme from '@voidzero-dev/vitepress-theme/src/vite'
import { h } from 'vue'
import AsideSponsors from './components/AsideSponsors.vue'
import NonInheritBadge from './components/NonInheritBadge.vue'
import ScrimbaLink from './components/ScrimbaLink.vue'

// components
import SvgImage from './components/SvgImage.vue'
import YouTubeVideo from './components/YouTubeVideo.vue'
import '@shikijs/vitepress-twoslash/style.css'
import 'virtual:group-icons.css'
import './styles.css'
import './custom.css'

export default {
  Layout() {
    return h((Theme as any).Layout, null, {
      'aside-ads-before': () => h(AsideSponsors),
    })
  },
  enhanceApp(ctx: any) {
    const { app } = ctx

    app.component('SvgImage', SvgImage)
    app.component('YouTubeVideo', YouTubeVideo)
    app.component('NonInheritBadge', NonInheritBadge)
    app.component('ScrimbaLink', ScrimbaLink)
    app.use(TwoslashFloatingVue)

    Theme.enhanceApp(ctx)
  },
}
