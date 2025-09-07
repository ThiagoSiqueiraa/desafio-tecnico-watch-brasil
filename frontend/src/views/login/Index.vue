<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'
import Swal from 'sweetalert2'
import { ref } from 'vue'
const email = ref<string>('')
const password = ref<string>('')

async function login() {
  try {
    const auth = useAuthStore()
    await auth.login(email.value, password.value)
    window.location.href = '/'
  } catch (e: any) {
    Swal.fire({
      icon: 'error',
      title: 'Erro ao fazer login',
      text: e?.response?.data?.message || 'Tente novamente mais tarde',
      confirmButtonColor: '#3085d6',
      confirmButtonText: 'OK',
      customClass: {
        confirmButton: 'my-custom-button-text',
      },
    })
  }
}
</script>

<template>
  <v-container fluid class="d-flex align-center justify-center" style="height: 100vh">
    <v-row class="justify-center">
      <v-col cols="12" sm="8" md="4">
        <v-card class="elevation-12">
          <v-toolbar dark color="primary">
            <v-toolbar-title>Bem vindo!</v-toolbar-title>
          </v-toolbar>
          <v-card-text>
            <form ref="form" @submit.prevent="login()">
              <v-text-field
                v-model="email"
                name="email"
                label="E-mail"
                type="text"
                placeholder="Insira o seu e-mail."
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

              <v-btn type="submit" class="w-100" color="primary" value="log in">Login</v-btn>
              <small class="text-center d-block w-100 mt-4">
                Não possui conta?
                <RouterLink to="/register">Cadastre-se</RouterLink>
              </small>
            </form>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
