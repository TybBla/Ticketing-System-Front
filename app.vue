<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useTheme } from 'vuetify'

const preferencesStore = usePreferencesStore()
const { uiTheme } = storeToRefs(preferencesStore)
const theme = useTheme()

watchEffect(() => {
  theme.change(uiTheme.value)

  if (import.meta.client) {
    document.documentElement.dataset.helpdeskTheme = uiTheme.value
  }
})
</script>

<template>
  <v-app>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </v-app>
</template>
