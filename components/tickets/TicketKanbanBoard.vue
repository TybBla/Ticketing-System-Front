<script setup lang="ts">
import StatusPill from '~/components/ui/StatusPill'
import type { Ticket } from '~/types/api'
import { TicketStatus } from '~/types/api'

const props = defineProps<{
  tickets: Ticket[]
  isLoading?: boolean
}>()

const emit = defineEmits<{
  'update-status': [ticket: Ticket, status: TicketStatus]
  select: [ticket: Ticket]
}>()

const labels = useHelpdeskLabels()
const { t } = useAppI18n()

const draggedTicketId = ref<string | null>(null)
const activeDropStatus = ref<TicketStatus | null>(null)

const statusColumns = computed(() => {
  return Object.values(TicketStatus)
    .filter((value): value is TicketStatus => typeof value === 'number')
    .map((status) => ({
      status,
      label: labels.ticketStatuses[status],
      color: labels.ticketStatusColors[status],
      tickets: props.tickets.filter((ticket) => ticket.status === status),
    }))
})

const startDrag = (event: DragEvent, ticket: Ticket) => {
  draggedTicketId.value = ticket.id
  event.dataTransfer?.setData('text/plain', ticket.id)
  if (event.dataTransfer) {
    event.dataTransfer.effectAllowed = 'move'
  }
}

const allowDrop = (event: DragEvent, status: TicketStatus) => {
  event.preventDefault()
  activeDropStatus.value = status
  if (event.dataTransfer) {
    event.dataTransfer.dropEffect = 'move'
  }
}

const leaveDropZone = (status: TicketStatus) => {
  if (activeDropStatus.value === status) {
    activeDropStatus.value = null
  }
}

const dropTicket = (event: DragEvent, status: TicketStatus) => {
  event.preventDefault()

  const ticketId = event.dataTransfer?.getData('text/plain') || draggedTicketId.value
  const ticket = props.tickets.find((item) => item.id === ticketId)

  draggedTicketId.value = null
  activeDropStatus.value = null

  if (!ticket || ticket.status === status) return

  emit('update-status', ticket, status)
}

const endDrag = () => {
  draggedTicketId.value = null
  activeDropStatus.value = null
}
</script>

<template>
  <v-sheet rounded="lg" border class="pa-4 mb-4 kanban-board">
    <div class="d-flex align-center justify-space-between ga-3 mb-4">
      <div>
        <h2 class="text-h6 font-weight-bold mb-1">
          {{ t('tickets.kanbanTitle') }}
        </h2>
        <p class="text-body-2 text-medium-emphasis mb-0">
          {{ t('tickets.kanbanSubtitle') }}
        </p>
      </div>
      <v-chip color="primary" variant="tonal" prepend-icon="mdi-drag">
        {{ t('tickets.dragHint') }}
      </v-chip>
    </div>

    <div class="kanban-board__columns">
      <section
        v-for="column in statusColumns"
        :key="column.status"
        class="kanban-column"
        :class="{ 'kanban-column--active': activeDropStatus === column.status }"
        @dragover="allowDrop($event, column.status)"
        @dragleave="leaveDropZone(column.status)"
        @drop="dropTicket($event, column.status)"
      >
        <header class="kanban-column__header">
          <StatusPill :label="column.label" :color="column.color" />
          <span class="text-caption font-weight-bold">{{ column.tickets.length }}</span>
        </header>

        <div class="kanban-column__body">
          <div v-if="!isLoading && column.tickets.length === 0" class="kanban-column__empty">
            {{ t('tickets.dropHere') }}
          </div>

          <button
            v-for="ticket in column.tickets"
            :key="ticket.id"
            class="kanban-card"
            type="button"
            draggable="true"
            :class="{ 'kanban-card--dragging': draggedTicketId === ticket.id }"
            @dragstart="startDrag($event, ticket)"
            @dragend="endDrag"
            @click="emit('select', ticket)"
          >
            <span class="kanban-card__title">{{ ticket.title }}</span>
            <span class="kanban-card__meta">
              {{ labels.ticketCategories[ticket.category] }} · {{ ticket.creatorEmail || t('tickets.dataMissing') }}
            </span>
          </button>
        </div>
      </section>
    </div>
  </v-sheet>
</template>

<style scoped>
.kanban-board {
  overflow: hidden;
}

.kanban-board__columns {
  display: grid;
  grid-template-columns: repeat(4, minmax(180px, 1fr));
  gap: 12px;
}

.kanban-column {
  display: grid;
  grid-template-rows: auto 1fr;
  min-height: 250px;
  border: 1px solid rgba(var(--v-theme-on-surface), 0.1);
  border-radius: 14px;
  background: rgba(var(--v-theme-surface-bright), 0.46);
  transition: border-color 160ms ease, background-color 160ms ease, transform 160ms ease;
}

.kanban-column--active {
  border-color: rgb(var(--v-theme-primary));
  background: rgba(var(--v-theme-primary), 0.08);
  transform: translateY(-2px);
}

.kanban-column__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  padding: 12px;
  border-bottom: 1px solid rgba(var(--v-theme-on-surface), 0.08);
}

.kanban-column__body {
  display: grid;
  align-content: start;
  gap: 10px;
  min-height: 190px;
  padding: 12px;
}

.kanban-column__empty {
  display: grid;
  min-height: 84px;
  place-items: center;
  border: 1px dashed rgba(var(--v-theme-on-surface), 0.24);
  border-radius: 12px;
  color: rgba(var(--v-theme-on-surface), 0.58);
  font-size: 0.85rem;
}

.kanban-card {
  display: grid;
  gap: 6px;
  width: 100%;
  min-height: 86px;
  padding: 12px;
  border: 1px solid rgba(var(--v-theme-on-surface), 0.12);
  border-radius: 12px;
  color: rgb(var(--v-theme-on-surface));
  background: rgba(var(--v-theme-surface), 0.9);
  box-shadow: 0 10px 22px rgba(15, 23, 42, 0.08);
  cursor: grab;
  text-align: left;
  transition: border-color 160ms ease, box-shadow 160ms ease, opacity 160ms ease, transform 160ms ease;
}

.kanban-card:hover {
  border-color: rgba(var(--v-theme-primary), 0.42);
  box-shadow: 0 14px 28px rgba(15, 23, 42, 0.12);
  transform: translateY(-1px);
}

.kanban-card:active {
  cursor: grabbing;
}

.kanban-card--dragging {
  opacity: 0.48;
}

.kanban-card__title {
  font-weight: 700;
  line-height: 1.3;
}

.kanban-card__meta {
  color: rgba(var(--v-theme-on-surface), 0.68);
  font-size: 0.8rem;
  line-height: 1.35;
}

@media (max-width: 1100px) {
  .kanban-board__columns {
    grid-template-columns: repeat(2, minmax(180px, 1fr));
  }
}

@media (max-width: 640px) {
  .kanban-board__columns {
    grid-template-columns: 1fr;
  }
}
</style>
