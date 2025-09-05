<script setup lang="ts">
import { RouterView } from 'vue-router'
import Sidebar from './components/Sidebar/Sidebar.vue'
</script>

<template>
  <v-app>
    <template v-if="$route.name !== 'login'">
      <v-layout>
      <Sidebar />

      <v-main app>
        <RouterView />
      </v-main>
      </v-layout>
    </template>

    <!-- Tela "login" sem chrome -->
    <template v-else>
      <RouterView />
    </template>
  </v-app>
</template>
