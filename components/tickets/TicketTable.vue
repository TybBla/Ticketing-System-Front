<script setup lang="ts">
import type { Ticket } from '~/types/api'
import { TicketStatus } from '~/types/api'

defineProps<{
  tickets: Ticket[]
  isLoading?: boolean
  statusOptions: Array<{ title: string, value: number }>
}>()

const emit = defineEmits<{
  'update-status': [ticket: Ticket, status: TicketStatus]
  select: [ticket: Ticket]
}>()

const labels = useHelpdeskLabels()
const { t } = useAppI18n()
</script>

<template>
  <v-table>
    <thead>
      <tr>
        <th>{{ t('tickets.title') }}</th>
        <th>{{ t('tickets.category') }}</th>
        <th>{{ t('tickets.status') }}</th>
        <th>{{ t('tickets.author') }}</th>
        <th>{{ t('tickets.date') }}</th>
        <th class="text-right">{{ t('tickets.actions') }}</th>
      </tr>
    </thead>
    <tbody>
      <tr v-if="!isLoading && tickets.length === 0">
        <td colspan="6" class="text-center text-medium-emphasis py-8">
          <slot name="empty">
            {{ t('tickets.noTickets') }}
          </slot>
        </td>
      </tr>
      <tr v-for="ticket in tickets" :key="ticket.id">
        <td>
          <div class="font-weight-medium">
            {{ ticket.title }}
          </div>
          <div class="text-caption text-medium-emphasis ticket-description">
            {{ ticket.description }}
          </div>
        </td>
        <td>{{ labels.ticketCategories[ticket.category] }}</td>
        <td>
          <v-select
            :model-value="ticket.status"
            :items="statusOptions"
            item-title="title"
            item-value="value"
            variant="outlined"
            density="compact"
            hide-details
            class="status-select"
            @update:model-value="emit('update-status', ticket, $event)"
          />
          <div class="text-caption text-medium-emphasis mt-1">
            {{ labels.ticketStatuses[ticket.status] }}
          </div>
        </td>
        <td>
          <div>{{ ticket.creatorEmail || t('tickets.dataMissing') }}</div>
          <div class="text-caption text-medium-emphasis">
            {{ ticket.creatorContactInfo || t('tickets.noContact') }}
          </div>
        </td>
        <td>{{ new Date(ticket.createdAt).toLocaleDateString('pl-PL') }}</td>
        <td class="text-right">
          <v-btn
            icon="mdi-eye-outline"
            variant="text"
            color="primary"
            :aria-label="t('tickets.detailsAction')"
            @click="emit('select', ticket)"
          />
        </td>
      </tr>
    </tbody>
  </v-table>
</template>

<style scoped>
.status-select {
  min-width: 160px;
}

.ticket-description {
  max-width: 440px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
