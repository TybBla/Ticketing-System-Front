<script setup lang="ts">
defineProps<{
  label: string
  value: string | number
  icon: string
  color?: string
}>()
</script>

<template>
  <v-sheet rounded="lg" border class="metric-card">
    <v-avatar :color="color || 'primary'" variant="tonal" size="44">
      <v-icon :icon="icon" />
    </v-avatar>
    <div>
      <div class="text-caption text-medium-emphasis">
        {{ label }}
      </div>
      <div class="text-h4 font-weight-bold">
        {{ value }}
      </div>
    </div>
  </v-sheet>
</template>

<style scoped>
.metric-card {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px;
  min-height: 92px;
}
</style>
