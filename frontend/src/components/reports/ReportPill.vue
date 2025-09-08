<!-- src/components/reports/ReportPill.vue -->
<script setup lang="ts">
const props = defineProps<{
  title: string
  value: number | string
  color?: string
  elevation?: number
  rounded?: string | number
  loading?: boolean
  clickable?: boolean
}>()

const emit = defineEmits<{ (e: 'click'): void }>()
</script>

<template>
  <v-card
    :rounded="rounded ?? 'xl'"
    class="mx-auto my-4"
    max-width="420"
    :ripple="clickable"
    @click="clickable && emit('click')"
    :aria-label="`${value} ${title}`"
  >
    <v-card-text class="d-flex align-center">
      <v-avatar :color="color ?? 'primary'" size="36" class="me-3">
        <v-skeleton-loader v-if="loading" type="text" width="14" />
        <span v-else class="text-white font-weight-bold">{{ value }}</span>
      </v-avatar>

      <div class="text-h6 font-weight-medium">
        <v-skeleton-loader v-if="loading" type="text" width="180" />
        <span v-else>{{ title }}</span>
      </div>
    </v-card-text>
  </v-card>
</template>

<style scoped>
.text-white {
  color: white;
}
</style>
