// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
	ssr: false,
	compatibilityDate: '2025-05-15',
	devtools: { enabled: true },
	// configure for static site generation and github pages deployment
	nitro: {
		prerender: {
			routes: ['/sitemap.xml']
		}
	},
	// trailing slash configuration for github pages
	experimental: {
		payloadExtraction: false
	},
	// base url configuration for github pages deployment
	app: {
		baseURL: process.env.NUXT_APP_BASE_URL || '/',
		head: {
			title: 'better met interface',
			meta: [
				{ charset: 'utf-8' }, // nuxt does it out of the box, but ok
				{ name: 'viewport', content: 'width=device-width, initial-scale=1' }, // nuxt does it out of the box, but ok
				{ name: 'description', content: 'explore met gallery in a better way' },
				{ name: 'keywords', content: 'museum, art, ancient, artifacts, met museum' },
				{ property: 'og:title', content: 'MET Gallery' },
				{ property: 'og:description', content: 'better interface for Met Museum' },
				// { property: 'og:image', content: '/og-image.jpg' },
				// { name: 'twitter:card', content: 'summary_large_image' }
			],
			link: [
				{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
				{ rel: 'apple-touch-icon', href: '/apple-touch-icon.png' }
			]
		},
		pageTransition: { name: 'page', mode: 'out-in' }
	},
	// router configuration for github pages
	router: {
		options: {
			hashMode: false
		}
	},
	modules: ['@nuxt/eslint',
		'@nuxt/fonts',
		'@nuxt/image',
		'@nuxtjs/fontaine',
		'@nuxtjs/color-mode',
		'@pinia/nuxt'],
	css: ['~/assets/css/styles.css', 'normalize.css'],
	colorMode: {
		preference: 'system', // default value of $colorMode.preference
		fallback: 'light', // fallback value if not system preference found
		hid: 'nuxt-color-mode-script',
		globalName: '__NUXT_COLOR_MODE__',
		componentName: 'ColorScheme',
		classPrefix: '',
		classSuffix: '',
		storage: 'localStorage', // or 'sessionStorage' or 'cookie'
		storageKey: 'nuxt-color-mode'
	}
})
