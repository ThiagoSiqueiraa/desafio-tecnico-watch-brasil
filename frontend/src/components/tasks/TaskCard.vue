<script setup lang="ts">
import { ref } from 'vue'
import TagTask from './TagTask.vue'
import moment from 'moment'

//prop status

const { priority, title, startDate, dueDate, completedTasks, totalTasks } = defineProps([
  'priority',
  'title',
  'startDate',
  'dueDate',
  'completedTasks',
  'totalTasks',
])

function progress(){
  return (completedTasks / totalTasks) * 100
}
</script>

<template>
  <v-card class="mx-auto my-4" width="100%">
    <v-card-item>
      <div class="chips-wrapper">
        <TagTask :priority="priority" />
      </div>
      <v-card-title>{{ title }}</v-card-title>
    </v-card-item>

    <v-card-text>
      <div class="progess-task mt-3">
        Tarefas completadas: {{ completedTasks }} / {{ totalTasks }}
        <v-progress-linear
          :model-value="progress()"
          color="blue"
          height="9"
          aria-label="Progresso da tarefa"
        >
        </v-progress-linear>
      </div>

      <div class="date-info-wrapper">
        <div class="d-flex flex-column">
          <strong>Data de início</strong> {{ moment(startDate).format('DD/MM/YYYY') }}
        </div>
        <div class="d-flex flex-column">
          <strong>Data prevista</strong> {{ moment(dueDate).format('DD/MM/YYYY') }}
        </div>
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
