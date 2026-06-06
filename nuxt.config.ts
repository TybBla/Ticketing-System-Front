export default defineNuxtConfig({
  ssr: false,

  compatibilityDate: '2026-06-06',

  app: {
    head: {
      title: 'Ticketing system',
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Panel obsługi zgłoszeń' },
      ],
    },
    pageTransition: {
      name: 'page',
      mode: 'out-in',
    },
    layoutTransition: {
      name: 'layout',
      mode: 'out-in',
    },
  },

  runtimeConfig: {
    apiBaseUrl: process.env.NUXT_API_BASE_URL || 'http://127.0.0.1:5000',
    notificationHubBaseUrl: process.env.NUXT_NOTIFICATION_HUB_BASE_URL || 'http://127.0.0.1:5001',
    public: {
      notificationHubPath: '/notifications',
    },
  },

  nitro: {
    devProxy: {
      '/notifications': {
        target: `${process.env.NUXT_NOTIFICATION_HUB_BASE_URL || 'http://127.0.0.1:5001'}/notifications`,
        changeOrigin: true,
        ws: true,
      },
    },
  },

  modules: ['@pinia/nuxt'],

  css: [
    '~/assets/main.css',
    'vuetify/lib/styles/main.sass',
    '@mdi/font/css/materialdesignicons.min.css',
  ],

  build: {
    transpile: ['vuetify'],
  },
})
