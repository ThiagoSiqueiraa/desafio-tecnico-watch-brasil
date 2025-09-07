<script setup lang="ts">
import AddNewMemberInProject from '@/components/projects/AddNewMemberInProject.vue'
import type ProjectGateway from '@/gateway/ProjectGateway'
import { useAuthStore } from '@/stores/auth'
import Swal from 'sweetalert2'
import { ref, computed, onMounted, inject } from 'vue'

const projectGateway = inject('projectGateway') as ProjectGateway

const members: any = ref([])

const headers = [
  { text: 'Nome', value: 'name' },
  { text: 'Email', value: 'email' },

  { text: 'Ações', value: 'actions', sortable: false },
]

function removeMember(member: any) {
  console.log(member)
  Swal.fire({
    title: 'Tem certeza?',
    text: 'Deseja realmente remover este membro?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Sim, remover',
    cancelButtonText: 'Cancelar',
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    customClass: {
      confirmButton: 'my-custom-button-text',
      cancelButton: 'my-custom-button-text',
    },
  }).then((result) => {
    if (result.isConfirmed) {
    }
  })
}

const showAddNewMember = ref(false)
function handleClose() {
  showAddNewMember.value = false
}
async function handleSubmit(event: { email: string }) {
  try {
    await projectGateway.addMember(
      useAuthStore().user!.currentProject!.id,
      event.email,
      useAuthStore().token,
    )
    members.value = await projectGateway.listMembers(
      useAuthStore().user!.currentProject!.id,
      useAuthStore().token,
    )
    showAddNewMember.value = false
  } catch (e: any) {
    console.log(e)
    Swal.fire({
      icon: 'error',
      title: 'Erro ao adicionar membro',
      text: e?.response?.data?.message || 'Tente novamente mais tarde',
      confirmButtonColor: '#3085d6',
      confirmButtonText: 'OK',
      customClass: {
          confirmButton: 'my-custom-button-text',
      },
    })
  }
  console.log('Salvar novo membro:', event)
}
function openAddMemberModal() {
  showAddNewMember.value = true
}

onMounted(async () => {
  members.value = await projectGateway.listMembers(
    useAuthStore().user!.currentProject!.id,
    useAuthStore().token,
  )
})
</script>

<template>
  <AddNewMemberInProject
    :modelValue="showAddNewMember"
    @close="handleClose()"
    @save="handleSubmit($event)"
  />
  <div class="pa-4">
    <header class="d-flex align-center mb-4">
      <h1 class="mb-4">Gerenciamento de Membros</h1>
      <!-- botão para adicionar membro -->
      <v-btn color="primary" variant="outlined" class="mb-4 ml-auto" @click="openAddMemberModal"
        >Adicionar Membro</v-btn
      >
    </header>
    <v-row>
      <v-col cols="12">
        <v-data-table :headers="headers" :items="members" class="elevation-1">
          <template #item.actions="{ item }">
            <v-icon v-tooltip="'Remover membro'" @click="removeMember(item)">mdi-delete</v-icon>
          </template>
        </v-data-table>
      </v-col>
    </v-row>
  </div>
</template>

<style scoped></style>
