<script setup lang="ts">
import { defineProps } from 'vue'

const props = defineProps(['priority'])

function getColor() {
  switch (props.priority) {
    case 'low_priority':
      return 'gray'
    case 'medium_priority':
      return 'orange'
    case 'high_priority':
      return 'red'
    default:
      return 'gray'
  }
}

function getLabel() {
  switch (props.priority) {
    case 'low_priority':
      return 'Baixa prioridade'
    case 'medium_priority':
      return 'Média prioridade'
    case 'high_priority':
      return 'Alta prioridade'
    default:
      return '?'
  }
}
</script>

<template>
  <div>
    <v-chip class="mb-2" :color="getColor()" label> {{ getLabel() }} </v-chip>
  </div>
</template>
