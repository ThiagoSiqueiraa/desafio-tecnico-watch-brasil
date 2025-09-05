<script setup lang="ts">
import { ref } from 'vue'

const form = ref()
const name = ref('')
const newChecklistItem = ref('')
const description = ref('')
const tasks = ref([
  {
    title: 'Tarefa 1',
  },
  {
    title: 'Tarefa 2',
  },
])

const submit = () => {
  if (form.value?.validate()) {
  }
}

function addChecklistItem() {
  const title = newChecklistItem.value.trim()
  if (!title) return
  tasks.value.push({ title })
  newChecklistItem.value = ''
}

function removeItem(index: number) {
  alert('remover')
}
</script>

<template>
  <v-container>
    <v-card>
      <v-card-title> Criar Tarefa </v-card-title>
      <v-card-text>
        <v-form ref="form" v-slot="{ validate }">
          <v-row>
            <v-col cols="12">
              <v-text-field
                v-model="name"
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
            <v-col cols="6">
              <!-- Prioridade select -->
              <v-select
                placeholder="Selecione a prioridade da tarefa"
                :items="['Baixa', 'Média', 'Alta']"
                label="Prioridade"
                required
                density="compact"
                variant="outlined"
              >
              </v-select>
            </v-col>
            <v-col cols="6">
              <div class="d-flex align-center ga-4">
                <v-date-input
                  label="Vencimento"
                  variant="outlined"
                  density="compact"
                  hide-details="auto"
                  clearable
                  append-inner-icon="mdi-calendar"
                  prepend-icon=""
                />
                <v-btn variant="outlined" height="40" prepend-icon="mdi-account-multiple-plus">
                  Adicionar membros
                </v-btn>
              </div>
            </v-col>

            <v-col cols="12">
              <v-list-item
                v-for="(task, index) in tasks"
                :key="index"
                class="mb-3 bg-grey-lighten-4"
                rounded
              >
                <v-list-item-content>
                  <v-list-item-title class="d-flex align-center justify-space-between">
                    <span>{{ index + 1 }} {{ task.title }} </span>
                    <v-icon @click="() => removeItem(index)" class="text-red-lighten-1"
                      >mdi-delete</v-icon
                    >
                  </v-list-item-title>
                </v-list-item-content>
              </v-list-item>
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
            </v-col>
          </v-row>

          <v-btn color="primary" class="mt-4" @click="submit"> Criar </v-btn>
        </v-form>
      </v-card-text>
    </v-card>
  </v-container>
</template>
