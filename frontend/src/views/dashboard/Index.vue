<script lang="ts" setup>
import ReportPill from '@/components/reports/ReportPill.vue'
import type ReportsGateway from '@/gateway/ReportsGateway'
import type { ReportsDTO } from '@/gateway/ReportsGateway'
import { useAuthStore } from '@/stores/auth'
import { inject, onMounted } from 'vue'
import { ref } from 'vue'

const reportsGateway = inject('reportsGateway') as ReportsGateway
const loading = ref(false)
const reportsState = ref<ReportsDTO>()
onMounted(async () => {
  try {
    loading.value = true
    const reports = await reportsGateway.get(
      useAuthStore().user!.currentProject!.id,
      useAuthStore().token,
    )
    reportsState.value = reports
  } catch (e) {
    console.log(e)
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <v-container fluid class="pa-4">
    <v-row lo>
      <v-col cols="12" md="4">
        <ReportPill
          title="Tarefas pendentes"
          :value="reportsState?.status.pending || 0"
          color="grey"
          rounded="false"
          :loading="loading"
        />
      </v-col>

      <v-col cols="12" md="4">
        <ReportPill
          title="Tarefas em andamento"
          :value="reportsState?.status.in_progress || 0"
          color="primary"
          rounded="false"
          :loading="loading"
        />
      </v-col>

      <v-col cols="12" md="4">
        <ReportPill
          title="Tarefas concluídas"
          :value="reportsState?.status.completed || 0"
          color="green"
          rounded="false"
          :loading="loading"
        />
      </v-col>

      <v-col cols="12" md="4">
        <ReportPill
          title="Tarefas atrasadas"
          :value="reportsState?.due.overdue || 0"
          color="teal"
          rounded="false"
          :loading="loading"
        />
      </v-col>
      <v-col cols="12" md="4">
        <ReportPill
          title="Tarefas no prazo"
          :value="reportsState?.due.onTime || 0"
          color="teal"
          rounded="false"
          :loading="loading"
        />
      </v-col>
    </v-row>
  </v-container>
</template>
