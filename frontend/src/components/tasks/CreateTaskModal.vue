<script setup lang="ts">
import { inject, onMounted, ref, watch } from 'vue'
import type TasksGateway from '@/gateway/TasksGateway'
import { useAuthStore } from '@/stores/auth'
import Swal from 'sweetalert2'

type Member = {
  name: string
  email: string
  id: number
}

const tasksGateway = inject('tasksGateway') as TasksGateway
const title = ref('')
const priority = ref('')
const dueDate = ref<Date | null>(null)
const newChecklistItem = ref('')
const description = ref('')
const tasks = ref<{ title: string; completed?: boolean }[]>([])
const members = ref<Member[]>([])
const emit = defineEmits(['close', 'save', 'onSuccess'])
const isEditing = ref<boolean>(false)
const { status, modelValue, taskId } = defineProps(['status', 'modelValue', 'taskId'])
const statusState = ref(status || 'pending')
const showDialog = ref(modelValue)
const priorityItems = [
  {
    value: 'low',
    label: 'Baixa',
  },
  {
    value: 'medium',
    label: 'Média',
  },
  {
    value: 'high',
    label: 'Alta',
  },
]

const submit = async () => {
  try {
    const taskData = {
      title: title.value,
      description: description.value,
      priority: priority.value,
      dueDate: dueDate.value,
      checklist: tasks.value,
      members: members.value,
      status: statusState.value,
    }
    console.log('Dados da tarefa:', taskData)

    if (isEditing && taskId) {
      await tasksGateway.update(taskId, taskData, useAuthStore().token)
      Swal.fire({
        icon: 'success',
        title: 'Tarefa atualizada com sucesso!',
        confirmButtonColor: '#3085d6',
        confirmButtonText: 'OK',
        customClass: {
          confirmButton: 'my-custom-button-text',
          cancelButton: 'my-custom-button-text',
        },
      })
    } else {
      await tasksGateway.create({ ...taskData, status: statusState.value }, useAuthStore().token)
    }

    showDialog.value = false
    emit('onSuccess')
  } catch (e: any) {
    console.log(e)
    const messageError = e.response.data.message || 'Erro ao salvar a tarefa'
    Swal.fire({
      icon: 'error',
      title: 'Erro ao salvar a tarefa',
      text: messageError,
      confirmButtonColor: '#3085d6',
      confirmButtonText: 'OK',
      customClass: {
        confirmButton: 'my-custom-button-text',
      },
    })
  }
}

function resetForm() {
  title.value = ''
  description.value = ''
  priority.value = ''
  dueDate.value = null
  tasks.value = []
  members.value = []
}

function addChecklistItem() {
  const title = newChecklistItem.value.trim()
  if (!title) return
  tasks.value.push({ title })
  newChecklistItem.value = ''
}

function removeItem(index: number) {
  tasks.value.splice(index, 1)
}

watch(showDialog, (val) => {
  if (!val) emit('close')
})

onMounted(async () => {
  if (taskId) {
    // Fetch task details and populate form for editing
    const task = await tasksGateway.getById(taskId, useAuthStore().token)
    title.value = task.title
    description.value = task.description
    priority.value = task.priority
    dueDate.value = task.dueDate ? new Date(task.dueDate) : null
    tasks.value = task.checklist || []
    members.value = task.members || []
    showDialog.value = true
    isEditing.value = true
  }
})
</script>

<template>
  <v-dialog v-model="showDialog" max-width="700">
    <template #default>
      <v-card>
        <v-card-title>{{ isEditing ? 'Editar' : 'Criar' }} tarefa</v-card-title>

        <v-card-text>
          <v-form ref="form" v-slot="{ validate }">
            <v-row>
              <v-col cols="12">
                <v-text-field
                  v-model="title"
                  label="Título da tarefa"
                  :rules="[(v) => !!v || 'Título é obrigatório']"
                  required
                  density="compact"
                  variant="outlined"
                />
              </v-col>
              <v-col cols="12">
                <v-textarea
                  v-model="description"
                  label="Descrição"
                  :rules="[(v) => !!v || 'Descrição é obrigatória']"
                  required
                  density="compact"
                  variant="outlined"
                />
              </v-col>
              <v-col cols="4">
                <v-select
                  v-model="priority"
                  placeholder="Selecione a prioridade da tarefa"
                  :items="priorityItems"
                  item-title="label"
                  item-value="value"
                  label="Prioridade"
                  required
                  density="compact"
                  variant="outlined"
                />
              </v-col>
              <v-col cols="8">
                <div class="d-flex align-center ga-4">
                  <v-date-input
                    v-model="dueDate"
                    label="Vencimento"
                    variant="outlined"
                    density="compact"
                    hide-details="auto"
                    clearable
                    append-inner-icon="mdi-calendar"
                    prepend-icon=""
                    input-format="DD/MM/YYYY"
                    locale="pt-BR"
                    :min="new Date()"
                  />
                </div>
              </v-col>
              <v-col cols="12">
                <div class="mb-2 font-weight-bold">Status:</div>
                <v-radio-group v-model="statusState" row>
                  <v-radio label="Pendente" value="pending" />
                  <v-radio label="Em andamento" value="in_progress" />
                  <v-radio label="Concluído" value="completed" />
                </v-radio-group>
              </v-col>
              <v-col cols="12">
                <v-list>
                  <v-list-item
                    v-for="(task, index) in tasks"
                    :key="index"
                    class="mb-3 bg-grey-lighten-4"
                    rounded
                  >
                    <v-list-item-content>
                      <v-list-item-title class="d-flex align-center">
                        <span v-if="isEditing">
                          <v-checkbox
                            v-model="task.completed"
                            density="compact"
                            hide-details
                            :label="''"
                            class="mr-2"
                          />
                        </span>
                        <span>{{ index + 1 }} {{ task.title }} </span>
                        <v-icon @click="() => removeItem(index)" class="text-red-lighten-1 ml-auto"
                          >mdi-delete</v-icon
                        >
                      </v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                </v-list>
                <v-text-field
                  v-model="newChecklistItem"
                  label="Checklist"
                  placeholder="Adicionar item"
                  density="compact"
                  variant="outlined"
                >
                  <template #append-inner>
                    <v-icon @click="addChecklistItem">mdi-plus</v-icon>
                  </template>
                </v-text-field>

                <small
                  >Para alterar a situação dos itens da checklist, é necessário salvar a
                  tarefa.</small
                >
              </v-col>
            </v-row>
            <div class="d-flex justify-space-between">
              <v-btn text @click="showDialog = false" class="mt-4 mr-2">Cancelar</v-btn>
              <v-btn color="primary" class="mt-4" @click="submit">{{
                isEditing ? 'Salvar' : 'Criar'
              }}</v-btn>
            </div>
          </v-form>
        </v-card-text>
      </v-card>
    </template>
  </v-dialog>
</template>
