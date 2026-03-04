import events from './data/events.json'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: ['@nuxtjs/sitemap'],
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
  runtimeConfig: {
    public: {
      apiUrl: process.env.NUXT_PUBLIC_API_URL || '',
    },
  },
  ssr: true,
  nitro: {
    preset: "static",
    prerender: {
      failOnError: true,
      routes: [
        '/',
        '/calendrier',
        '/archives',
        '/copaines',
        '/a-propos',
        ...events.filter(e => e?.slug).map(e => `/calendrier/${e.slug}`)
      ],
      ignore: [
        '/orgas'
      ]
    }
  }
})
