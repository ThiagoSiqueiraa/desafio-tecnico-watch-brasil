<template>
  <v-dialog v-model="dialog" max-width="400">
    <template #activator="{ props }"></template>
    <v-card>
      <v-card-title>Novo projeto</v-card-title>
      <v-card-text>
        <form @submit.prevent="submitForm">
          <v-text-field
            v-model="title"
            label="Título do projeto"
            placeholder="Digite o título"
            required
            variant="outlined"
          ></v-text-field>
          <div class="actions">
              <v-btn text  class="mt-4 mr-2" @click="close">Cancelar</v-btn>
              <v-btn color="primary" class="mt-4" @click="submitForm">Criar</v-btn>
          </div>
        </form>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref, watch  } from 'vue'

const emit = defineEmits(['close', 'save'])
const props = defineProps({
  modelValue: Boolean,
})

const dialog = ref(props.modelValue)
const title = ref('')

watch(
  () => props.modelValue,
  (val) => {
    dialog.value = val
  },
)

watch(dialog, (val) => {
  if (!val) emit('close')
})

function close() {
  dialog.value = false
}

function submitForm() {
  emit('save', { title: title.value })
  title.value = ''
  close()
}
</script>

<style scoped>
.actions {
  margin-top: 1rem;
  display: flex;
  gap: 1rem;
  justify-content: space-between;
}
</style>
