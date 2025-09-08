<script setup lang="ts">
import { RouterView } from 'vue-router'
import Sidebar from './components/sidebar/Sidebar.vue'

const routesWithoutSidebar = ['login', 'register']
</script>

<template>
  <v-app>
    <template v-if="!routesWithoutSidebar.includes($route.name as string)">
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
