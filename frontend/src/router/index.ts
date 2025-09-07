import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '../views/login/Index.vue'
import RegisterView from '../views/register/Index.vue'
import DashboardView from '../views/dashboard/Index.vue'
import ManageTaskView from '../views/tasks/List.vue'
import TeamView from '../views/team/Index.vue'
import { useAuthStore } from '@/stores/auth'

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
      meta: { guestOnly: true },
    },
    {
      path: '/register',
      name: 'register',
      component: RegisterView,
    },
    {
      path: '/manage-tasks',
      name: 'manage-tasks',
      component: ManageTaskView,
      meta: { requiresAuth: true },
    },
    { path: '/team', name: 'team', component: TeamView, meta: { requiresAuth: true } },
  ],
})

router.beforeEach((to, from, next) => {
  const auth = useAuthStore()
  if (to.meta?.guestOnly && auth.isAuthenticated) return next('/')
  if (to.meta?.requiresAuth && !auth.isAuthenticated) return next('/login')
  return next()
})

export default router
