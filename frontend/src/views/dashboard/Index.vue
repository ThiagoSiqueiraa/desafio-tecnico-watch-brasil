<script lang="ts" setup>
import ReportPill from '@/components/reports/ReportPill.vue'
import Sidebar from '../../components/sidebar/Sidebar.vue'
</script>

<template>
  <div class="d-flex">
    <ReportPill title="Tarefas pendentes" :value="3" color="grey" width="33%" class="me-4" />
    <ReportPill title="Tarefas em andamento" :value="3" color="primary" width="33%" class="me-4" />
    <ReportPill title="Tarefas concluídas" :value="3" color="green" width="33%" class="me-4" />
  </div>
</template>
