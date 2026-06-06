<script setup lang="ts">
definePageMeta({
  middleware: 'admin',
})

const monitoringStore = useMonitoringStore()
const { t } = useAppI18n()

const headers = computed(() => [
  { title: t('monitoring.level'), key: 'level' },
  { title: t('monitoring.message'), key: 'message' },
  { title: t('monitoring.source'), key: 'source' },
  { title: t('monitoring.date'), key: 'createdAt' },
])

const formatDate = (value: string) => new Date(value).toLocaleString()

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
          color="error"
          variant="tonal"
          prepend-icon="mdi-delete-outline"
          @click="monitoringStore.clear"
        >
          {{ t('monitoring.clear') }}
        </v-btn>
      </template>
    </UiPageHeader>

    <v-sheet rounded="lg" border>
      <v-table>
        <thead>
          <tr>
            <th v-for="header in headers" :key="header.key">
              {{ header.title }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="monitoringStore.events.length === 0">
            <td colspan="4" class="text-center text-medium-emphasis py-8">
              {{ t('monitoring.empty') }}
            </td>
          </tr>
          <tr v-for="event in monitoringStore.events" :key="event.id">
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
.diagnostics-details {
  max-width: 720px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
