<script setup lang="ts">
import type { Ticket } from '~/types/api'
import { TicketCategory, TicketStatus } from '~/types/api'

const props = defineProps<{
  tickets: Ticket[]
}>()

const labels = useHelpdeskLabels()
const { t } = useAppI18n()

const totalTickets = computed(() => props.tickets.length)

const statusCounts = computed(() => {
  return Object.values(TicketStatus)
    .filter((value): value is TicketStatus => typeof value === 'number')
    .map((status) => ({
      status,
      label: labels.ticketStatuses[status],
      color: labels.ticketStatusColors[status],
      count: props.tickets.filter((ticket) => ticket.status === status).length,
    }))
})

const categoryCounts = computed(() => {
  return Object.values(TicketCategory)
    .filter((value): value is TicketCategory => typeof value === 'number')
    .map((category) => ({
      category,
      label: labels.ticketCategories[category],
      count: props.tickets.filter((ticket) => ticket.category === category).length,
    }))
})

const resolvedOrClosedCount = computed(() => {
  return props.tickets.filter((ticket) => {
    return ticket.status === TicketStatus.Resolved || ticket.status === TicketStatus.Closed
  }).length
})

const completionRate = computed(() => {
  if (!totalTickets.value) return 0
  return Math.round((resolvedOrClosedCount.value / totalTickets.value) * 100)
})

const widthForCount = (count: number) => {
  if (!totalTickets.value) return '0%'
  return `${Math.max(8, Math.round((count / totalTickets.value) * 100))}%`
}
</script>

<template>
  <v-row class="mb-4">
    <v-col cols="12" lg="8">
      <v-sheet rounded="lg" border class="pa-4 analytics-panel">
        <div class="d-flex align-center justify-space-between mb-4">
          <div>
            <h2 class="text-h6 font-weight-bold">
              {{ t('tickets.statusStructure') }}
            </h2>
            <p class="text-body-2 text-medium-emphasis mb-0">
              {{ t('tickets.statusStructureSubtitle') }}
            </p>
          </div>
          <v-chip color="primary" variant="tonal">
            {{ t('tickets.total', { count: totalTickets }) }}
          </v-chip>
        </div>

        <div class="status-bars">
          <div v-for="item in statusCounts" :key="item.status" class="status-row">
            <div class="status-row__label">
              <v-chip :color="item.color" size="small" variant="tonal">
                {{ item.label }}
              </v-chip>
              <span class="text-body-2 font-weight-medium">{{ item.count }}</span>
            </div>
            <div class="status-row__track">
              <div
                class="status-row__bar"
                :class="`status-row__bar--${item.color}`"
                :style="{ width: widthForCount(item.count) }"
              />
            </div>
          </div>
        </div>
      </v-sheet>
    </v-col>

    <v-col cols="12" lg="4">
      <v-sheet rounded="lg" border class="pa-4 analytics-panel">
        <h2 class="text-h6 font-weight-bold mb-1">
          {{ t('tickets.effectiveness') }}
        </h2>
        <p class="text-body-2 text-medium-emphasis mb-4">
          {{ t('tickets.effectivenessSubtitle') }}
        </p>

        <div class="completion">
          <v-progress-circular
            :model-value="completionRate"
            :size="112"
            :width="12"
            color="success"
          >
            <span class="text-h5 font-weight-bold">{{ completionRate }}%</span>
          </v-progress-circular>

          <div class="completion__legend">
            <div v-for="item in categoryCounts" :key="item.category" class="d-flex justify-space-between">
              <span class="text-body-2 text-medium-emphasis">{{ item.label }}</span>
              <strong>{{ item.count }}</strong>
            </div>
          </div>
        </div>
      </v-sheet>
    </v-col>
  </v-row>
</template>

<style scoped>
.analytics-panel {
  min-height: 220px;
}

.status-bars {
  display: grid;
  gap: 14px;
}

.status-row {
  display: grid;
  gap: 8px;
}

.status-row__label {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.status-row__track {
  width: 100%;
  height: 10px;
  overflow: hidden;
  border-radius: 999px;
  background: #eef2f7;
}

.status-row__bar {
  height: 100%;
  border-radius: inherit;
  transition: width 240ms ease;
}

.status-row__bar--warning {
  background: #f59e0b;
}

.status-row__bar--primary {
  background: #1976d2;
}

.status-row__bar--success {
  background: #16a34a;
}

.status-row__bar--grey {
  background: #64748b;
}

.completion {
  display: flex;
  align-items: center;
  gap: 24px;
}

.completion__legend {
  display: grid;
  flex: 1;
  gap: 10px;
}
</style>
