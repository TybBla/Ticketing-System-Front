<script setup lang="ts">
const { locale, locales, setLocale } = useAppI18n()
</script>

<template>
  <v-btn-toggle
    :model-value="locale"
    density="compact"
    variant="outlined"
    mandatory
    @update:model-value="setLocale($event)"
  >
    <v-btn
      v-for="item in locales"
      :key="item.code"
      :value="item.code"
      size="small"
    >
      {{ item.label }}
    </v-btn>
  </v-btn-toggle>
</template>
