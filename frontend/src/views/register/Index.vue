<script setup lang="ts">
import type UsersGateway from '@/gateway/UsersGateway'
import { inject, ref } from 'vue'

const name = ref<string>('')
const password = ref<string>('')
const email = ref<string>('')
const usersGateway = inject('usersGateway') as UsersGateway
const snackbar = ref(false)
const snackbarMsg = ref('')
const snackbarColor = ref('')

async function signup() {
  try {
    const user = await usersGateway.create({
      name: name.value,
      email: email.value,
      password: password.value,
    })
    snackbarMsg.value = 'Usuário cadastrado com sucesso!'
    snackbarColor.value = 'success'
  } catch (error: any) {
    snackbarMsg.value = error.response?.data?.message || 'Erro no cadastro'
    snackbarColor.value = 'error'
  } finally {
    snackbar.value = true

    name.value = ''
    email.value = ''
    password.value = ''
  }

  // Aqui você pode adicionar a lógica para enviar os dados para o backend
}
</script>

<template>
  <v-snackbar location="top right" v-model="snackbar" :color="snackbarColor" timeout="4000">
    {{ snackbarMsg }}
  </v-snackbar>
  <v-container fluid class="d-flex align-center justify-center" style="height: 100vh">
    <v-row class="justify-center">
      <v-col cols="12" sm="8" md="4">
        <v-card class="elevation-12">
          <v-toolbar dark color="primary">
            <v-toolbar-title>Cadastre-se!</v-toolbar-title>
          </v-toolbar>
          <v-card-text>
            <form ref="form" @submit.prevent="signup()">
              <v-text-field
                v-model="email"
                name="email"
                label="E-mail"
                type="email"
                placeholder="Insira o seu e-mail."
                variant="outlined"
                required
              ></v-text-field>
              <v-text-field
                v-model="name"
                name="name"
                label="Nome"
                type="text"
                placeholder="Insira o seu nome."
                variant="outlined"
                required
              ></v-text-field>
              <v-text-field
                v-model="password"
                name="password"
                label="Senha"
                type="password"
                placeholder="Insira a sua senha."
                variant="outlined"
                required
              ></v-text-field>

              <v-btn type="submit" class="w-100" color="primary" value="register"
                >Cadastre-se</v-btn
              >
            </form>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
