import Theme from 'vitepress/theme'
import { h } from 'vue'
import SponsorsSidebar from './SponsorsSidebar.vue'
import './custom.css'

export default {
  ...Theme,
  Layout() {
    return h(Theme.Layout, null, {
      'sidebar-bottom': () =>
<<<<<<< HEAD
        h('div', { class: 'sponsors sidebar' }, [
          h(
            'a',
            {
              href: 'https://github.com/sponsors/yyx990803',
              target: '_blank',
              rel: 'noopener'
            },
            [h('span', 'Sponsors')]
          ),
          ...sponsors.map(({ href, src, name, id }) =>
            h(
              'a',
              {
                href,
                target: '_blank',
                rel: 'noopener',
                'aria-label': 'sponsor-img'
              },
              [h('img', { src, alt: name, id: `sponsor-${id}` })]
            )
          )
        ]),
      'page-top-ads': () =>
        h('div', { id: 'wwads-container' }, [
          h('div', {
            class: 'wwads-cn wwads-vertical',
            'data-id': 111,
            style: {
              maxWidth: '150px'
            }
          })
        ])
=======
        h('div', { class: 'sponsors sidebar' }, [h(SponsorsSidebar)])
>>>>>>> 3ce3830653dcbdedcc1bdbd6d35f34bc908ce9fc
    })
  }
}
