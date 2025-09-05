<script lang="ts" setup>
import menuItens from './menuItens'
const menu = menuItens
</script>

<template>
  <v-card>
    <v-layout>
      <v-navigation-drawer permanent>
        <v-list>
          <v-list-item
            prepend-avatar="https://randomuser.me/api/portraits/women/85.jpg"
            subtitle="<e-mail do usuário>"
            title="<nome do usuário>"
          ></v-list-item>
        </v-list>

        <v-divider></v-divider>

        <v-list nav>
          <v-list-item
            v-for="(item, index) in menu"
            :key="index"
            :prepend-icon="item.icon"
            :title="item.title"
            :to="item.route"
          ></v-list-item>
        </v-list>

      </v-navigation-drawer>

      <v-main style="height: 100vh">
        <div>oii</div>
      </v-main>
    </v-layout>
  </v-card>
</template>
