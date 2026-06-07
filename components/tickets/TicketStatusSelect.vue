<script setup lang="ts">
import { TicketStatus } from '~/types/api'

defineProps<{
  statusOptions: Array<{ title: string, value: number }>
}>()

const model = defineModel<TicketStatus>({ required: true })
</script>

<template>
  <v-select
    v-model="model"
    :items="statusOptions"
    item-title="title"
    item-value="value"
    variant="outlined"
    density="compact"
    hide-details
    class="status-select"
  />
</template>

<style scoped>
.status-select {
  min-width: 160px;
}
</style>
