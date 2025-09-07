<script setup lang="ts">
import type UsersGateway from '@/gateway/UsersGateway'
import { inject, ref, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const name = ref('')
const password = ref('')
const email = ref('')
const usersGateway = inject('usersGateway') as UsersGateway

const snackbar = ref(false)
const snackbarMsg = ref('')
const snackbarColor = ref<'success' | 'error' | ''>('')
const snackbarTimeout = ref(4000)

let redirectTimer: number | undefined
const redirectDelayMs = 1800 

async function signup() {
  try {
    const user = await usersGateway.create({
      name: name.value,
      email: email.value,
      password: password.value,
    })
    snackbarMsg.value = 'Usuário cadastrado com sucesso!\nRedirecionando para o login…'
    snackbarColor.value = 'success'
    snackbarTimeout.value = 4000
    snackbar.value = true

    redirectTimer = window.setTimeout(() => {
      router.replace({ name: 'login', query: { registered: '1' } })
    }, redirectDelayMs)

    name.value = ''
    email.value = ''
    password.value = ''
  } catch (error: any) {
    snackbarMsg.value = error?.response?.data?.message || 'Erro no cadastro'
    snackbarColor.value = 'error'
    snackbarTimeout.value = 5000
    snackbar.value = true
  }
}

function goNow() {
  if (redirectTimer) clearTimeout(redirectTimer)
  router.replace({ name: 'login', query: { registered: '1' } })
}

onBeforeUnmount(() => {
  if (redirectTimer) clearTimeout(redirectTimer)
})
</script>

<template>
  <v-snackbar
    v-model="snackbar"
    :color="snackbarColor"
    location="top right"
    :timeout="snackbarTimeout"
  >
    {{ snackbarMsg }}
    <template #actions>
      <v-btn variant="text" @click="goNow">Ir agora</v-btn>
    </template>
  </v-snackbar>

  <v-container fluid class="d-flex align-center justify-center" style="height: 100vh">
    <v-row class="justify-center">
      <v-col cols="12" sm="8" md="4">
        <v-card class="elevation-12">
          <v-toolbar dark color="primary">
            <v-toolbar-title>Cadastre-se!</v-toolbar-title>
          </v-toolbar>
          <v-card-text>
            <form @submit.prevent="signup">
              <v-text-field
                v-model="email"
                name="email"
                label="E-mail"
                type="email"
                placeholder="Insira o seu e-mail."
                variant="outlined"
                required
              />
              <v-text-field
                v-model="name"
                name="name"
                label="Nome"
                type="text"
                placeholder="Insira o seu nome."
                variant="outlined"
                required
              />
              <v-text-field
                v-model="password"
                name="password"
                label="Senha"
                type="password"
                placeholder="Insira a sua senha."
                variant="outlined"
                required
              />
              <v-btn type="submit" class="w-100" color="primary">Cadastre-se</v-btn>
            </form>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
