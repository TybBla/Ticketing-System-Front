<script setup lang="ts">
import {
  ArcElement,
  Chart as ChartJS,
  Legend,
  Tooltip,
  type ChartData,
  type ChartOptions,
} from 'chart.js'
import { Doughnut } from 'vue-chartjs'
import StatusPill from '~/components/ui/StatusPill'
import type { Ticket } from '~/types/api'
import { TicketCategory, TicketStatus } from '~/types/api'
import {
  calculateCompletionRate,
  countTicketsByCategory,
  countTicketsByStatus,
} from '~/utils/ticketAnalytics'

ChartJS.register(ArcElement, Tooltip, Legend)

const props = defineProps<{
  tickets: Ticket[]
}>()

const labels = useHelpdeskLabels()
const { t } = useAppI18n()

const totalTickets = computed(() => props.tickets.length)

const statusCounts = computed(() => {
  return countTicketsByStatus(props.tickets).map((item) => ({
    ...item,
    label: labels.ticketStatuses[item.status],
    color: labels.ticketStatusColors[item.status],
  }))
})

const categoryCounts = computed(() => {
  return countTicketsByCategory(props.tickets).map((item) => ({
    ...item,
    label: labels.ticketCategories[item.category],
  }))
})

const completionRate = computed(() => calculateCompletionRate(props.tickets))

const chartColors: Record<TicketStatus, string> = {
  [TicketStatus.New]: '#f59e0b',
  [TicketStatus.InProgress]: '#1976d2',
  [TicketStatus.Resolved]: '#16a34a',
  [TicketStatus.Closed]: '#64748b',
}

const statusChartData = computed<ChartData<'doughnut'>>(() => ({
  labels: statusCounts.value.map((item) => item.label),
  datasets: [
    {
      data: statusCounts.value.map((item) => item.count),
      backgroundColor: statusCounts.value.map((item) => chartColors[item.status]),
      borderColor: 'rgba(255, 255, 255, 0.72)',
      borderWidth: 2,
      hoverOffset: 6,
    },
  ],
}))

const statusChartOptions: ChartOptions<'doughnut'> = {
  responsive: true,
  maintainAspectRatio: false,
  cutout: '64%',
  plugins: {
    legend: {
      display: false,
    },
    tooltip: {
      callbacks: {
        label: (context) => `${context.label}: ${context.parsed}`,
      },
    },
  },
}

const widthForCount = (count: number) => {
  if (!totalTickets.value) return '0%'
  return `${Math.max(8, Math.round((count / totalTickets.value) * 100))}%`
}

const getCategoryKey = (item: { category: TicketCategory }) => item.category
const getCategoryLabel = (item: { label: string }) => item.label
const getCategoryValue = (item: { count: number }) => item.count
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
              <StatusPill :label="item.label" :color="item.color" />
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

        <div class="status-chart" aria-hidden="true">
          <Doughnut :data="statusChartData" :options="statusChartOptions" />
          <div class="status-chart__center">
            <strong>{{ totalTickets }}</strong>
            <span>{{ t('tickets.totalShort') }}</span>
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

          <UiGenericStatList
            :items="categoryCounts"
            :get-key="getCategoryKey"
            :get-label="getCategoryLabel"
            :get-value="getCategoryValue"
          />
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

.status-chart {
  position: relative;
  max-width: 220px;
  height: 170px;
  margin: 18px auto 0;
}

.status-chart__center {
  position: absolute;
  inset: 0;
  display: grid;
  place-content: center;
  pointer-events: none;
  text-align: center;
}

.status-chart__center strong {
  font-size: 1.45rem;
  line-height: 1;
}

.status-chart__center span {
  color: rgba(var(--v-theme-on-surface), 0.62);
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
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

.status-pill {
  display: inline-flex;
  align-items: center;
  min-height: 26px;
  padding: 0 12px;
  border-radius: 999px;
  font-size: 0.75rem;
  font-weight: 700;
}

.status-pill--warning {
  color: #8a4f00;
  background: #fff0d8;
}

.status-pill--primary {
  color: #174b7a;
  background: #dcecff;
}

.status-pill--success {
  color: #1f6b3b;
  background: #def5e7;
}

.status-pill--grey {
  color: #526173;
  background: #edf0f4;
}

.completion {
  display: flex;
  align-items: center;
  gap: 24px;
}
</style>
