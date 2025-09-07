<template>
  <div>
    <!-- cria uma lista de card que vai ser os times -->
    <header class="d-flex justify-end mb-4 mt-4 ml-4 mr-4">
      <v-btn>Criar time</v-btn>
    </header>

    <v-row>
      <v-col cols="4" v-for="team in teams" :key="team.id" class="mb-4">
        <v-card outlined>
          <v-card-title>
            {{ team.name }}
          </v-card-title>
          <v-card-text>
            <v-list>
              <v-list-item v-for="member in team.members" :key="member.id">
                <v-list-item-content>
                  <v-list-item-title>{{ member.name }}</v-list-item-title>
                  <v-list-item-subtitle>{{ member.email }}</v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
            </v-list>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

const teams = ref([
  {
    id: 1,
    name: 'Time A',
    members: [
      { id: 1, name: 'Alice', email: 'alice@example.com' },
      { id: 2, name: 'Bob', email: 'bob@example.com' },
    ],
  },
  {
    id: 2,
    name: 'Time B',
    members: [
      { id: 3, name: 'Charlie', email: 'charlie@example.com' },
      { id: 4, name: 'David', email: 'david@example.com' },
    ],
  },
  {
    id: 3,
    name: 'Time B',
    members: [
      { id: 41, name: 'Charlie', email: 'charlie@example.com' },
      { id: 1231, name: 'David', email: 'david@example.com' },
    ],
  },
])
</script>

<style scoped></style>
