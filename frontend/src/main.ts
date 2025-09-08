import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import vuetify from './plugins/vuetify'
import ProjectGateway from './gateway/ProjectGateway'
import UsersGateway from './gateway/UsersGateway'
import AuthGateway from './gateway/AuthGateway'
import TasksGateway from './gateway/TasksGateway'
import ReportsGateway from './gateway/ReportsGateway'
import { createPinia } from 'pinia'

const app = createApp(App)
const pinia = createPinia()
app.use(pinia)
app.use(vuetify)
app.use(router)
app.provide('usersGateway', new UsersGateway())
app.provide('projectGateway', new ProjectGateway())
app.provide('authGateway', new AuthGateway())
app.provide('tasksGateway', new TasksGateway())
app.provide('reportsGateway', new ReportsGateway())
app.mount('#app')
