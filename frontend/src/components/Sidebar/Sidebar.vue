<script lang="ts" setup>
import menuItens from './menuItens'
const menu = menuItens
</script>

<template>
  <v-navigation-drawer app permanent width="280">
    <v-list>
      <v-list-item
        prepend-avatar="https://randomuser.me/api/portraits/women/85.jpg"
        subtitle="<e-mail do usuário>"
        title="<nome do usuário>"
      />
    </v-list>

    <v-divider />

    <v-list nav density="comfortable">
      <v-list-item
        v-for="(item, index) in menu"
        :key="index"
        :prepend-icon="item.icon"
        :title="item.title"
        :to="item.route"
        rounded="lg"
      />
    </v-list>
  </v-navigation-drawer>
</template>
