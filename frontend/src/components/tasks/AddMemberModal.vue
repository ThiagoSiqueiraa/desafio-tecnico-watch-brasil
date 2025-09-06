<script setup lang="ts">
import { shallowRef } from 'vue'

type Member = {
  name: string
  email: string
  id: number
}

const dialog = shallowRef(false)
const members = shallowRef<Member[]>([
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
const membersSelected = shallowRef<Member[]>([])
</script>

<template>
  <v-dialog v-model="dialog" max-width="600">
    <template v-slot:activator="{ props: activatorProps }">
      <v-btn
        class="text-none font-weight-regular"
        prepend-icon="mdi-account"
        text="Edit Profile"
        variant="tonal"
        v-bind="activatorProps"
      ></v-btn>
    </template>

    <v-card prepend-icon="mdi-account" title="Membros da tarefa">
      <v-card-text> </v-card-text>
      <v-list v-model:selected="membersSelected" select-strategy="leaf">
        <v-list-item
          v-for="(member, index) in members"
          :key="index"
          class="mb-3 bg-grey-lighten-4"
          :title="member.name"
          :subtitle="member.email"
          :value="member.id"
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

      <v-card-actions>
        <v-spacer></v-spacer>

        <v-btn text="Close" variant="plain" @click="dialog = false"></v-btn>

        <v-btn color="primary" text="Save" variant="tonal" @click="dialog = false"></v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
