import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import vuetify from './plugins/vuetify'
import ProjectGateway from './gateway/ProjectGateway'

const app = createApp(App)
app.use(vuetify)
app.use(router)
app.provide('projectGateway', new ProjectGateway())
app.mount('#app')
