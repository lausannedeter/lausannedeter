import events from './data/events.json'

const locales = ['fr', 'en', 'es']

const pages = [
  '',
  '/calendrier',
  '/archives',
  '/copaines',
  '/a-propos'
]

const localizedPages = locales.flatMap(locale =>
  pages.map(page => `/${locale}${page}`)
)

const localizedEvents = locales.flatMap(locale =>
  events
    .filter(e => e?.slug)
    .map(e => `/${locale}/calendrier/${e.slug}`)
)

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: ['@nuxtjs/sitemap', '@nuxtjs/i18n'],
  site: {
    url: 'https://lausannedeter.ch'
  },
  compatibilityDate: '2026-01-15',
  devtools: { enabled: true },
  app: {
    baseURL: '/',
    head: {
      title: 'Lausanne Deter',
      meta: [
        { name: 'description', content: 'Calendrier des luttes et évènements militants à Lausanne et environs' }
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      ],
    }
  },
  css: ['~/assets/css/main.css'],
  i18n: {
    locales: [
      { code: 'fr', name: 'Fr', file: 'fr.json' },
      { code: 'en', name: 'En', file: 'en.json' },
      { code: "es", name: "Es", file: "es.json" }
    ],
    defaultLocale: 'fr',
    strategy: 'prefix', // important : met le code langue dans l'URL
    langDir: 'locales/', // dossier contenant fr.json et en.json et es.json
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: 'i18n_redirected',
      redirectOn: 'root' // redirige automatiquement la racine
    }
  },
  runtimeConfig: {
    public: {
      apiUrl: process.env.NUXT_PUBLIC_API_URL || '',
      cloudinaryCloudName: process.env.NUXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
      cloudinaryUploadPreset: process.env.NUXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET,
    },
  },
  ssr: true,
  nitro: {
    preset: "static",
    prerender: {
      failOnError: true,
      routes: [
        ...localizedPages,
        ...localizedEvents
      ],
      ignore: [
        '/fr/orgas',
        '/en/orgas',
        '/es/orgas'
      ]
    }
  }
})
