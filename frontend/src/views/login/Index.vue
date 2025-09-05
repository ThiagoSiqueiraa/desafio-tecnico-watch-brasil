<script setup lang="ts">
import { ref } from 'vue'

const username = ref<string>('')
const password = ref<string>('')

function login() {
  console.log('Username:', username.value)
  console.log('Password:', password.value)
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
                v-model="username"
                name="username"
                label="Usuário"
                type="text"
                placeholder="Insira o seu usuário."
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
              <small class="text-center d-block w-100 mt-4"
                >Não possui conta? <a href="#">Cadastre-se</a></small
              >
            </form>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
