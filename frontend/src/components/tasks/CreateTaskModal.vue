<script setup lang="ts">
import { ref } from 'vue'
import AddMemberModal from '@/components/tasks/AddMemberModal.vue'

type Member = {
  name: string
  email: string
  id: number
}

const form = ref()
const name = ref('')
const newChecklistItem = ref('')
const description = ref('')
const tasks = ref<{ title: string }[]>([])
const showDialogAddMember = ref(false)
const members = ref<Member[]>([])

const showDialog = ref(false)

const submit = () => {
  if (form.value?.validate()) {
    showDialog.value = false
  }
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

function handleConfirm(membersReceived: any) {
  members.value = membersReceived
  showDialogAddMember.value = false
}

function handleCancel() {
  showDialogAddMember.value = false
}
</script>

<template>

  <v-dialog v-model="showDialog" max-width="700">
    <template #default>
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
              <v-col cols="4">
                <v-select
                  placeholder="Selecione a prioridade da tarefa"
                  :items="['Baixa', 'Média', 'Alta']"
                  label="Prioridade"
                  required
                  density="compact"
                  variant="outlined"
                />
              </v-col>
              <v-col cols="8">
                <div class="d-flex align-center ga-4">
                  <v-date-input
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
                  <v-btn
                    @click="showDialogAddMember = true"
                    variant="outlined"
                    height="40"
                    prepend-icon="mdi-account-multiple-plus"
                    v-tooltip:bottom="'Adicionar membros à tarefa'"
                  >

                  </v-btn>
                </div>
              </v-col>
              <v-col cols="12">
                <div class="mb-2 font-weight-bold">Membros:</div>
                <v-list v-if="members.length > 0" class="d-flex flex-row">
                  <v-list-item
                    v-for="(member, index) in members"
                    :key="index"
                    class="mb-3 bg-grey-lighten-4"
                    :title="member.name"
                    rounded
                    inline
                  />
                </v-list>
                <div v-else class="text-grey">Nenhum membro adicionado.</div>
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
                      <v-list-item-title class="d-flex align-center justify-space-between">
                        <span>{{ index + 1 }} {{ task.title }} </span>
                        <v-icon @click="() => removeItem(index)" class="text-red-lighten-1"
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
              </v-col>
            </v-row>
            <div class="d-flex justify-end">
              <v-btn text @click="showDialog = false" class="mt-4 mr-2">Cancelar</v-btn>
              <v-btn color="primary" class="mt-4" @click="submit">Criar</v-btn>
            </div>
          </v-form>
        </v-card-text>
      </v-card>
    </template>
  </v-dialog>


</template>
