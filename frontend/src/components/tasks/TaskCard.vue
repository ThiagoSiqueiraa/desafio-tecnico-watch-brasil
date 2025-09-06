<script setup lang="ts">
import { ref } from 'vue'

const startDate = ref('2024-06-01')
const dueDate = ref('2024-06-10')
</script>

<template>
  <v-card class="mx-auto my-8" width="100%">
    <v-card-item>
      <div class="chips-wrapper">
        <v-chip class="mb-2" color="cyan" label> Finalizado </v-chip>
        <!-- <v-chip class="mb-2" color="purple" label> Pendente </v-chip>
        <v-chip class="mb-2" color="gray" label> Baixa prioridade </v-chip>
        <v-chip class="mb-2" color="orange" label> Média prioridade </v-chip>
        <v-chip class="mb-2" color="red" label> Alta prioridade </v-chip> -->
      </div>
      <v-card-title> Card title </v-card-title>
    </v-card-item>

    <v-card-text>


      <div class="progess-task mt-3">
        Tarefas completadas: 999 / 230020
        <v-progress-linear
          :model-value="50"
          color="blue"
          height="9"
          aria-label="Progresso da tarefa"
        >
        </v-progress-linear>
      </div>

      <div class="date-info-wrapper">
        <div class="d-flex flex-column"><strong>Data de início</strong> {{ startDate }}</div>
        <div class="d-flex flex-column"><strong>Data prevista</strong> {{ dueDate }}</div>
      </div>
    </v-card-text>
  </v-card>
</template>

<style scoped>
.date-info-wrapper {
  display: flex;
  justify-content: space-between;
  margin-top: 16px;
}

.chips-wrapper {
  display: flex;
  font-weight: bold;
  gap: 12px;
}

::v-deep .v-chip .v-chip__content {
  font-weight: bold;
}
</style>
