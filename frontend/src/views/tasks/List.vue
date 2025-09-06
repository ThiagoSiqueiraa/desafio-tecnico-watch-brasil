<script setup lang="ts">
import TaskCard from '@/components/tasks/TaskCard.vue'
</script>

<template>
  <div class="wrapper-tasks">
    <div class="column">
      <div class="column-header">
        <h3>Pendente</h3>
      </div>

      <div class="column-cards">
        <TaskCard priority="low_priority" />
        <TaskCard priority="medium_priority" />
        <TaskCard priority="high_priority" />
        <TaskCard priority="medium_priority" />
        <TaskCard />
        <TaskCard />
        <TaskCard />
      </div>

      <div class="column-footer">
        <v-btn block prepend-icon="mdi-plus" variant="text">Adicionar uma tarefa</v-btn>
      </div>
    </div>

    <div class="column">
      <div class="column-header"><h3>Em andamento</h3></div>
      <div class="column-cards"><TaskCard /><TaskCard /><TaskCard /></div>
      <div class="column-footer">
        <v-btn block prepend-icon="mdi-plus" variant="text">Adicionar uma tarefa</v-btn>
      </div>
    </div>

    <div class="column">
      <div class="column-header"><h3>Concluído</h3></div>
      <div class="column-cards">
        <TaskCard />
        <TaskCard />
        <TaskCard />
        <TaskCard />
        <TaskCard />
      </div>
      <div class="column-footer">
        <v-btn block prepend-icon="mdi-plus" variant="text">Adicionar uma tarefa</v-btn>
      </div>
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
  min-height: 0;
}

.column {
  display: flex;
  flex-direction: column;
  min-height: 0;
  border: 1px solid #2b3b2b;
  border-radius: 12px;
  color: #e8efe8;
  overflow: hidden;
}

.column-header {
  position: sticky;
  top: 0;
  z-index: 1;
  padding: 12px 12px 8px;
  background: rgba(96, 96, 96, 0.95);
  backdrop-filter: saturate(120%) blur(2px);
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: white;
  border-top: 1px solid #223322;
}

.column-cards {
  min-height: 0;
  overflow-y: auto;
  padding: 10px;
  background-color: #fbfbfb;
}

.column-footer {
  position: sticky;
  bottom: 0;
  background: rgba(96, 96, 96, 0.95);
  padding: 6px;
  border-top: 1px solid #223322;
  color: white;
}

.column :deep(.v-card) {
  width: 100% !important;
  box-sizing: border-box;
}
</style>
