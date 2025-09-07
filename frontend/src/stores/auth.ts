// src/stores/auth.ts
import { defineStore } from 'pinia'
import { ref, computed, inject, watch } from 'vue'
import type { UserAuthenticated } from '@/gateway/AuthGateway'
import AuthGateway from '@/gateway/AuthGateway';

type User = { id: number; name: string; email: string; role?: string }

const TOKEN_KEY = 'app:token'
const USER_KEY = 'app:user'

export const useAuthStore = defineStore('auth', () => {
  const token = ref<string>(localStorage.getItem(TOKEN_KEY) || '')
  const user = ref<User | null>(
    localStorage.getItem(USER_KEY) ? JSON.parse(localStorage.getItem(USER_KEY)!) : null,
  )
  const loading = ref(false)
  const error = ref('')

  const isAuthenticated = computed(() => !!token.value)
  const role = computed(() => user.value?.role || 'user')

  async function login(email: string, password: string) {
    console.log('inside auth')
    loading.value = true
    error.value = ''
    try {
      const authGateway = new AuthGateway();
      const data = (await authGateway.login({ email, password })) as UserAuthenticated
      token.value = data.token
      user.value = {
        email: data.email,
        id: data.id,
        name: data.name,
      }
    } catch (err: any) {
      error.value = err?.response?.data?.message || 'Falha no login'
      throw err
    } finally {
      loading.value = false
    }
  }

  function logout() {
    token.value = ''
    user.value = null
  }

  watch(token, (t) => (t ? localStorage.setItem(TOKEN_KEY, t) : localStorage.removeItem(TOKEN_KEY)))
  watch(
    user,
    (u) =>
      u ? localStorage.setItem(USER_KEY, JSON.stringify(u)) : localStorage.removeItem(USER_KEY),
    { deep: true },
  )

  return { token, user, loading, error, isAuthenticated, role, login, logout }
})
