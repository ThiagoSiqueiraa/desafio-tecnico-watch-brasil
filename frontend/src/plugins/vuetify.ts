// plugins/vuetify.ts
import 'vuetify/styles'

// Vuetify
import 'vuetify/styles'
import '@mdi/font/css/materialdesignicons.css'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import { VDateInput } from 'vuetify/labs/VDateInput'

export default createVuetify({
  components: { ...components, VDateInput },
  directives,
  theme: {
    defaultTheme: 'myCustomTheme',
    themes: {
      myCustomTheme: {
        dark: false, // ou true se quiser dark mode
        colors: {
          primary: '#1867C0', // azul padrão do Vuetify
          secondary: '#5CBBF6',
          error: '#FF5252',
          success: '#4CAF50',
          warning: '#FB8C00',
        },
      },
    },
  },
  icons: {
    defaultSet: 'mdi',
  },
})
