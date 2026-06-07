<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useTheme } from 'vuetify'

const preferencesStore = usePreferencesStore()
const { uiTheme } = storeToRefs(preferencesStore)
const theme = useTheme()

watch(
  uiTheme,
  (nextTheme) => {
    theme.global.name.value = nextTheme
  },
  { immediate: true },
)
</script>

<template>
  <v-app>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </v-app>
</template>
