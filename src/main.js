import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

import 'vuetify/styles'
import './assets/main.css' 
import './assets/scss/global.scss'
import '@mdi/font/css/materialdesignicons.css'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

const vuetify = createVuetify({ components, directives })

const app = createApp(App)

// Disable Vue DevTools
app.config.devtools = false

app.use(router)
app.use(vuetify)
app.mount('#app')
 