import events from './data/events.json'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2026-01-15',
  devtools: { enabled: true },
  app: {
    baseURL: '/',
    head: {
      title: 'Lausanne Deter',
      meta: [
        { name: 'description', content: 'Calendrier militant à Lausanne' }
      ],
      link: [
        { rel: 'icon', type: 'image/png', href: '/Logo-red-circle.png' },
      ],
    }
  },
  css: ['~/assets/css/main.css'],
  ssr: true,       
  nitro: {
    preset: "static",
    prerender: {
      routes: [
        '/',
        '/calendrier',
        '/copaines',
        '/a-propos',
        ...events.map(e => `/calendrier/${e.slug}`)
      ]     
    }
  }
})
