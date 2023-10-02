import { h } from 'vue'
import Theme from 'vitepress/theme'
import HomeSponsors from './components/HomeSponsors.vue'
import AsideSponsors from './components/AsideSponsors.vue'
import SvgImage from './components/SvgImage.vue'
import WwAds from './components/WwAds.vue'
import './styles/vars.css'
import './custom.css'

export default {
  ...Theme,
  Layout() {
    return h(Theme.Layout, null, {
      'home-features-after': () => h(HomeSponsors),
      'aside-ads-before': () => h(AsideSponsors),
      'aside-bottom': () => h(WwAds)
    })
  },
  enhanceApp({ app }) {
    app.component('SvgImage', SvgImage)
  }
}
