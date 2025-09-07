<script setup lang="ts">
import { defineProps } from 'vue'

const props = defineProps(['priority'])

function getColor() {
  switch (props.priority) {
    case 'low':
      return 'gray'
    case 'medium':
      return 'orange'
    case 'high':
      return 'red'
    default:
      return 'gray'
  }
}

function getLabel() {
  switch (props.priority) {
    case 'low':
      return 'Baixa prioridade'
    case 'medium':
      return 'Média prioridade'
    case 'high':
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
