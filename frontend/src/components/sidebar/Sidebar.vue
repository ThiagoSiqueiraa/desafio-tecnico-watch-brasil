<script lang="ts" setup>
import menuItens from './menuItens'
const menu = menuItens

function changeProject() {
  alert('Trocar de projeto')
}

function addProject() {
  alert('Adicionar novo projeto')
}

let actualProject = 'Projeto X'

function getPossibleProjects() {
  return ['Projeto X', 'Projeto Y', 'Projeto Z'].filter((p) => p !== actualProject)
}
</script>

<template>
  <v-navigation-drawer app permanent width="280">
    <v-list>
      <v-list-item
        prepend-avatar="https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png?20150327203541"
        subtitle="<e-mail do usuário>"
        title="<nome do usuário>"
      />
    </v-list>

    <v-divider />

    <v-list-item prepend-icon="mdi-folder" title="Voce está em" subtitle="Projeto X" rounded="lg">
      <template #append>
        <v-menu>
          <template #activator="{ props }">
            <v-btn icon variant="text" size="small" v-bind="props">
              <v-icon>mdi-chevron-down</v-icon>
            </v-btn>
          </template>
          <v-list>
            <v-list-item
              v-for="(project, idx) in getPossibleProjects()"
              :key="idx"
              @click="changeProject()"
            >
              <v-list-item-title>{{ project }}</v-list-item-title>
            </v-list-item>
            <v-divider />
            <v-list-item>
              <v-btn variant="outlined" height="40" @click="addProject()">
                Criar novo projeto
              </v-btn>
            </v-list-item>
          </v-list>
        </v-menu>
      </template>
    </v-list-item>

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
