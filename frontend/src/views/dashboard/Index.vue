<script lang="ts" setup>
import ReportPill from '@/components/reports/ReportPill.vue'
import Sidebar from '../../components/sidebar/Sidebar.vue'
</script>

<template>
  <v-container fluid class="pa-4">
    <v-row >
      <v-col cols="12" md="4">
        <ReportPill
          title="Tarefas pendentes"
          :value="3"
          color="grey"
          rounded="false"
        />
      </v-col>

      <v-col cols="12" md="4">
        <ReportPill
          title="Tarefas em andamento"
          :value="3"
          color="primary"
          rounded="false"
        />
      </v-col>

      <v-col cols="12" md="4">
        <ReportPill
          title="Tarefas concluídas"
          :value="3"
          color="green"
          rounded="false"
        />
      </v-col>

      <!-- 4º item vai automaticamente para a 2ª linha -->
      <v-col cols="12" md="4">
        <ReportPill
          title="Tarefas atrasadas"
          :value="3"
          color="teal"
          rounded="false"
        />
      </v-col>
            <v-col cols="12" md="4">
        <ReportPill
          title="Tarefas no prazo"
          :value="3"
          color="teal"
          rounded="false"
        />
      </v-col>
    </v-row>
  </v-container>
</template>
