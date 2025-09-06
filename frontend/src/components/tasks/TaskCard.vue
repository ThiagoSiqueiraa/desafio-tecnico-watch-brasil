<script setup lang="ts">
import { ref } from 'vue'
import TagTask from './TagTask.vue'
const startDate = ref('2024-06-01')
const dueDate = ref('2024-06-10')
//prop status

const props = defineProps(['priority'])
</script>

<template>
  <v-card class="mx-auto my-4" width="100%">
    <v-card-item>
      <div class="chips-wrapper">
        <TagTask :priority="props.priority" />
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
