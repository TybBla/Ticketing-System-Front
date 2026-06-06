import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import { vFocus } from '~/directives/focus' // Import naszej dyrektywy

export default defineNuxtPlugin((nuxtApp) => {
  const vuetify = createVuetify({
    components,
    directives,
    theme: {
      defaultTheme: 'helpdeskLight',
      themes: {
        helpdeskLight: {
          dark: false,
          colors: {
            primary: '#1f4e79',
            secondary: '#4d6a79',
            accent: '#c47f17',
            success: '#2f7d4f',
            warning: '#b7791f',
            error: '#b64a4a',
            info: '#3d6f8d',
            background: '#dfe4ea',
            surface: '#f3f5f8',
            'surface-bright': '#fafbfd',
            'surface-light': '#eef1f5',
            'surface-variant': '#d8dee6',
            'on-surface': '#1f2933',
            'on-background': '#1f2933',
          },
        },
      },
    },
    defaults: {
      VCard: {
        rounded: 'lg',
        elevation: 0,
      },
      VSheet: {
        rounded: 'lg',
        elevation: 0,
      },
      VBtn: {
        rounded: 'lg',
      },
      VTextField: {
        color: 'primary',
      },
      VTextarea: {
        color: 'primary',
      },
      VSelect: {
        color: 'primary',
      },
    },
  })

  nuxtApp.vueApp.use(vuetify)
  
  // Rejestracja globalna dyrektywy v-focus
  nuxtApp.vueApp.directive('focus', vFocus)
})
