import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '../views/login/Index.vue'
import RegisterView from '../views/register/Index.vue'
import DashboardView from '../views/dashboard/Index.vue'
import CreateTaskView from '../views/tasks/Create.vue'
import ManageTaskView from '../views/tasks/List.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'dashboard',
      component: DashboardView,
      meta: { requiresAuth: true },
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView,
    },
    {
      path: '/register',
      name: 'register',
      component: RegisterView,
    },
    {
      path: '/create-task',
      name: 'create-task',
      component: CreateTaskView
    },
    {
      path: '/manage-tasks',
      name: 'manage-tasks',
      component: ManageTaskView,
      meta: { requiresAuth: true },
    }
  ],
})

router.beforeEach((to, from, next) => {
    const isAuthenticated = true;

    if (to.meta.requiresAuth && !isAuthenticated) {
        next('/login'); // Redireciona para a página de login se não estiver autenticado
    } else {
        next(); // Permite a navegação
    }
})

export default router
