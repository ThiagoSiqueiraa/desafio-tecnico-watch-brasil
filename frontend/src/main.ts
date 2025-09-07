import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import vuetify from './plugins/vuetify'
import ProjectGateway from './gateway/ProjectGateway'
import UsersGateway from './gateway/UsersGateway'

const app = createApp(App)
app.use(vuetify)
app.use(router)
app.provide('usersGateway', new UsersGateway())
app.provide('projectGateway', new ProjectGateway())
app.mount('#app')
