<script setup lang="ts">
import { ref, shallowRef, toRaw } from 'vue'

type Member = {
  name: string
  email: string
  id: number
}

const dialog = shallowRef(false)
const members = ref<Member[]>([
  {
    name: 'Thiago Siqueira',
    email: 'mock@mockemail.com',
    id: 1,
  },
  {
    name: 'Fulano de Tal',
    email: 'fulanodetal@mock.com',
    id: 2,
  },
  {
    name: 'Ciclano de Tal',
    email: 'ciclanodetal@gmail.com',
    id: 3,
  },
])
const membersSelected = ref<Member[]>([])

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  confirm: [members: Member[]]
  cancel: []
}>()

const onConfirm = () => {
  emit('confirm', toRaw(membersSelected.value))
  close()
}
const onCancel = () => {
  emit('cancel')
  close()
}
const close = () => emit('update:modelValue', false)
</script>

<template>
  <v-dialog
    :model-value="dialog"
    @update:modelValue="(v) => $emit('update:modelValue', v)"
    max-width="600"
  >
    <v-card prepend-icon="mdi-account" title="Membros da tarefa">
      <v-card-text> </v-card-text>
      <v-list v-model:selected="membersSelected" select-strategy="leaf">
        <v-list-item
          v-for="(member, index) in members"
          :key="index"
          class="mb-3 bg-grey-lighten-4"
          :title="member.name"
          :subtitle="member.email"
          :value="member"
          rounded
        >
          <template v-slot:prepend="{ isSelected, select }">
            <v-list-item-action start>
              <v-checkbox-btn
                :model-value="isSelected"
                @update:model-value="select"
              ></v-checkbox-btn>
            </v-list-item-action>
          </template>
        </v-list-item>
      </v-list>

      <v-divider></v-divider>

      <v-card-actions class="space-between">
        <v-spacer></v-spacer>

        <v-btn text="fechar" variant="plain" @click="onCancel()"></v-btn>

        <v-btn color="primary" text="adicionar" variant="tonal" @click="onConfirm()"></v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
