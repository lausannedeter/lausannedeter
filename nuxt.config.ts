import data from './data/events.json'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
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
  ssr: true,       
  nitro: {
    preset: "static",
    prerender: {
      routes: [
        '/',
        '/calendrier',
        '/archives',
        '/copaines',
        '/a-propos',
        ...data.events.map(e => `/calendrier/${e.slug}`)
      ]     
    }
  }
})
