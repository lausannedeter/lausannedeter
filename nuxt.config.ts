// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  app: {
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
  css: ['~/assets/css/main.css']
})
