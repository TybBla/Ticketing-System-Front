<script setup lang="ts">
definePageMeta({
  middleware: 'admin',
})

import type { MonitoringLevel } from '~/stores/monitoring'

const monitoringStore = useMonitoringStore()
const { t } = useAppI18n()
const selectedLevel = ref<MonitoringLevel | 'all'>('all')

const headers = computed(() => [
  { title: t('monitoring.level'), key: 'level' },
  { title: t('monitoring.message'), key: 'message' },
  { title: t('monitoring.source'), key: 'source' },
  { title: t('monitoring.date'), key: 'createdAt' },
])

const formatDate = (value: string) => new Date(value).toLocaleString()

const levelOptions = computed<Array<{ title: string, value: MonitoringLevel | 'all' }>>(() => [
  { title: t('monitoring.allLevels'), value: 'all' },
  { title: t('monitoring.infoCount'), value: 'info' },
  { title: t('monitoring.warningCount'), value: 'warning' },
  { title: t('monitoring.errorCount'), value: 'error' },
])

const filteredEvents = computed(() => {
  if (selectedLevel.value === 'all') {
    return monitoringStore.events
  }

  return monitoringStore.events.filter((event) => event.level === selectedLevel.value)
})

const addTestEvent = () => {
  monitoringStore.captureWarning(
    t('monitoring.testEventMessage'),
    'diagnostics.manual-test',
    t('monitoring.testEventDetails'),
  )
}

const exportLog = () => {
  if (!import.meta.client) return

  const payload = JSON.stringify(monitoringStore.events, null, 2)
  const blob = new Blob([payload], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')

  link.href = url
  link.download = `helpdesk-diagnostics-${new Date().toISOString().slice(0, 10)}.json`
  link.click()
  URL.revokeObjectURL(url)
}

onMounted(() => {
  monitoringStore.captureInfo(t('monitoring.manualInfo'), 'diagnostics.view')
})
</script>

<template>
  <v-container class="py-8">
    <UiPageHeader
      :title="t('monitoring.title')"
      :subtitle="t('monitoring.subtitle')"
      back-to="/"
    >
      <template #actions>
        <v-chip color="primary" variant="tonal">
          {{ t('monitoring.count', { count: monitoringStore.events.length }) }}
        </v-chip>
        <v-btn
          color="primary"
          variant="tonal"
          prepend-icon="mdi-file-download-outline"
          :disabled="monitoringStore.events.length === 0"
          @click="exportLog"
        >
          {{ t('monitoring.export') }}
        </v-btn>
        <v-btn
          color="warning"
          variant="tonal"
          prepend-icon="mdi-alert-plus-outline"
          @click="addTestEvent"
        >
          {{ t('monitoring.addTestEvent') }}
        </v-btn>
        <v-btn
          color="error"
          variant="tonal"
          prepend-icon="mdi-delete-outline"
          @click="monitoringStore.clear"
        >
          {{ t('monitoring.clear') }}
        </v-btn>
      </template>
    </UiPageHeader>

    <v-row class="mb-4">
      <v-col cols="12" md="4">
        <UiMetricCard
          :label="t('monitoring.infoCount')"
          :value="monitoringStore.levelCounts.info"
          icon="mdi-information-outline"
          color="primary"
        />
      </v-col>
      <v-col cols="12" md="4">
        <UiMetricCard
          :label="t('monitoring.warningCount')"
          :value="monitoringStore.levelCounts.warning"
          icon="mdi-alert-outline"
          color="warning"
        />
      </v-col>
      <v-col cols="12" md="4">
        <UiMetricCard
          :label="t('monitoring.errorCount')"
          :value="monitoringStore.levelCounts.error"
          icon="mdi-alert-circle-outline"
          color="error"
        />
      </v-col>
    </v-row>

    <v-sheet rounded="lg" border>
      <div class="diagnostics-toolbar">
        <v-select
          v-model="selectedLevel"
          :items="levelOptions"
          item-title="title"
          item-value="value"
          :label="t('monitoring.levelFilter')"
          prepend-inner-icon="mdi-filter-outline"
          variant="outlined"
          density="compact"
          hide-details
          class="diagnostics-filter"
        />
        <v-chip color="primary" variant="tonal">
          {{ t('monitoring.filteredCount', { count: filteredEvents.length }) }}
        </v-chip>
      </div>

      <v-table>
        <thead>
          <tr>
            <th v-for="header in headers" :key="header.key">
              {{ header.title }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="filteredEvents.length === 0">
            <td colspan="4" class="text-center text-medium-emphasis py-8">
              {{ t('monitoring.empty') }}
            </td>
          </tr>
          <tr v-for="event in filteredEvents" :key="event.id">
            <td>
              <v-chip
                size="small"
                :color="event.level === 'error' ? 'error' : event.level === 'warning' ? 'warning' : 'primary'"
                variant="tonal"
              >
                {{ event.level }}
              </v-chip>
            </td>
            <td>
              <div class="font-weight-medium">
                {{ event.message }}
              </div>
              <div v-if="event.details" class="text-caption text-medium-emphasis diagnostics-details">
                {{ event.details }}
              </div>
            </td>
            <td>{{ event.source }}</td>
            <td>{{ formatDate(event.createdAt) }}</td>
          </tr>
        </tbody>
      </v-table>
    </v-sheet>
  </v-container>
</template>

<style scoped>
.diagnostics-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 16px;
  border-bottom: 1px solid var(--app-card-border);
}

.diagnostics-filter {
  max-width: 280px;
}

.diagnostics-details {
  max-width: 720px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
