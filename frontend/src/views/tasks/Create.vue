<script setup lang="ts">
import { ref } from 'vue'

const form = ref()
const name = ref('')
const description = ref('')

const submit = () => {
  if (form.value?.validate()) {
  }
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
            <v-col cols="4">
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
              <!-- TODO CHECKLIST -->
              <v-label> Itens </v-label>
            </v-col>
          </v-row>

          <v-btn color="primary" class="mt-4" @click="submit"> Criar </v-btn>
        </v-form>
      </v-card-text>
    </v-card>
  </v-container>
</template>
