<script lang="ts" setup>
import menuItens from './menuItens'
import AddNewProjectModal from '../projects/AddNewProjectModal.vue'
import { inject, onMounted, ref } from 'vue'
import ProjectGateway, { type Project } from '@/gateway/ProjectGateway'
import { useAuthStore } from '@/stores/auth'
const projectGateway = inject('projectGateway') as ProjectGateway

const showAddNewProject = ref(false)
const user = useAuthStore().user
const menu = menuItens
const projects = ref<Project[]>([])
function changeProject() {
  alert('Trocar de projeto')
}

function addProject() {
  showAddNewProject.value = true
}

function handleClose() {
  showAddNewProject.value = false
}

async function handleSubmit(event: { title: string }) {
  // Lógica para salvar o novo projeto
  console.log('Salvar novo projeto:', event)
  const project = await projectGateway.create(event.title, useAuthStore().token)
  projects.value.push(project)
  showAddNewProject.value = false
}

function getPossibleProjects() {
  return projects.value.filter((p) => p.id !== user?.currentProject?.id) as Project[]
}

onMounted(async () => {
  const response = await projectGateway.list(useAuthStore().token, useAuthStore().user!.id)
  projects.value = response
})
</script>

<template>
  <AddNewProjectModal
    :modelValue="showAddNewProject"
    @close="handleClose()"
    @save="handleSubmit($event)"
  />
  <v-navigation-drawer app permanent width="280">
    <v-list>
      <v-list-item
        prepend-avatar="https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png?20150327203541"
        :subtitle="user?.email"
        :title="user?.name"
      />
    </v-list>

    <v-divider />

    <v-list-item
      prepend-icon="mdi-folder"
      title="Voce está em"
      :subtitle="user?.currentProject?.name"
      rounded="lg"
    >
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
              <v-list-item-title>{{ project.name }}</v-list-item-title>
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

    <v-list nav density="compact">
      <v-list-item
        v-for="(item, index) in menu"
        :key="index"
        :prepend-icon="item.icon"
        :title="item.title"
        :to="item.route"
      />
    </v-list>
  </v-navigation-drawer>
</template>
