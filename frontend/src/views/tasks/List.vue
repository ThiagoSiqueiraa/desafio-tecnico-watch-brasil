<script setup lang="ts">
import TaskCard from '@/components/tasks/TaskCard.vue'
</script>

<template>
  <div class="wrapper-tasks">
    <div class="column">
      <h3>Pendente</h3>
      <TaskCard />
      <TaskCard />
      <TaskCard />
      <TaskCard />
      <TaskCard />
    </div>

    <div class="column">
      <h3>Em andamento</h3>
      <TaskCard />
      <TaskCard />
      <TaskCard />
    </div>

    <div class="column">
      <h3>Concluído</h3>
      <TaskCard />
      <TaskCard />
      <TaskCard />
    </div>
  </div>
</template>

<style scoped>
.wrapper-tasks {
  display: grid;
  grid-template-columns: repeat(3, 1fr); 
  gap: 16px; 
  padding: 16px;
  height: 100vh;
}

.column {
  background: #f4f4f4;
  border-radius: 8px;
  padding: 8px;
  flex-direction: column;
  height: 100vh;
  overflow-y: auto;
}
</style>
