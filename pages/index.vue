<script setup lang="ts">
import { defineAsyncComponent } from 'vue'
import TicketDetailsDialogLoader from '~/components/tickets/TicketDetailsDialogLoader.vue'
import type { Ticket } from '~/types/api'

definePageMeta({
  middleware: 'auth',
})

const TicketDetailsDialog = defineAsyncComponent({
  loader: () => import('~/components/tickets/TicketDetailsDialog.vue'),
  loadingComponent: TicketDetailsDialogLoader,
  delay: 80,
})

const authStore = useAuthStore()
const notificationStore = useNotificationStore()
const { t } = useAppI18n()
const {
  tickets,
  analyticsTickets,
  isLoading,
  errorMessage,
  search,
  includeArchived,
  statusOptions,
  filteredTickets,
  activeTicketsCount,
  closedTicketsCount,
  newTicketsCount,
  fetchTickets,
  updateTicketStatus,
} = useTickets()

const selectedTicket = ref<Ticket | null>(null)
const isDetailsDialogOpen = ref(false)

const openTicketDetails = (ticket: Ticket) => {
  selectedTicket.value = ticket
  isDetailsDialogOpen.value = true
}

watch(includeArchived, fetchTickets)
watch(() => notificationStore.refreshTicketsTrigger, fetchTickets)

onMounted(fetchTickets)
</script>

<template>
  <v-container class="py-8">
    <template v-if="authStore.isAdmin">
      <UiPageHeader
        :title="t('tickets.dashboardTitle')"
        class="dashboard-page-header"
      >
        <template #actions>
          <v-btn
            color="primary"
            prepend-icon="mdi-plus"
            to="/tickets/create"
            size="large"
            class="dashboard-new-ticket-btn"
          >
            {{ t('tickets.newTicket') }}
          </v-btn>
        </template>
      </UiPageHeader>

      <v-row class="mb-4">
        <v-col cols="12" md="4">
          <UiMetricCard
            :label="t('tickets.active')"
            :value="activeTicketsCount"
            icon="mdi-ticket-confirmation-outline"
            color="primary"
          />
        </v-col>
        <v-col cols="12" md="4">
          <UiMetricCard
            :label="t('tickets.new')"
            :value="newTicketsCount"
            icon="mdi-alert-circle-outline"
            color="warning"
          />
        </v-col>
        <v-col cols="12" md="4">
          <UiMetricCard
            :label="t('tickets.closed')"
            :value="closedTicketsCount"
            icon="mdi-archive-check-outline"
            color="success"
          />
        </v-col>
      </v-row>

      <TicketsTicketAnalytics :tickets="analyticsTickets" />

      <TicketsTicketKanbanBoard
        :tickets="filteredTickets"
        :is-loading="isLoading"
        @update-status="updateTicketStatus"
        @select="openTicketDetails"
      />

      <v-sheet rounded="lg" border>
        <TicketsTicketFilters
          v-model="search"
          v-model:include-archived="includeArchived"
        />

        <v-alert
          v-if="errorMessage"
          type="error"
          variant="tonal"
          class="ma-4"
        >
          {{ errorMessage }}
        </v-alert>

        <v-progress-linear v-if="isLoading" indeterminate color="primary" />

        <TicketsTicketTable
          :tickets="filteredTickets"
          :is-loading="isLoading"
          :status-options="statusOptions"
          @update-status="updateTicketStatus"
          @select="openTicketDetails"
        >
          <template #empty>
            {{ t('tickets.noMatches') }}
          </template>
        </TicketsTicketTable>
      </v-sheet>

      <TicketDetailsDialog
        v-if="isDetailsDialogOpen"
        v-model="isDetailsDialogOpen"
        :ticket="selectedTicket"
      />
    </template>

    <template v-else>
      <v-row justify="center">
        <v-col cols="12" md="8" lg="6">
          <v-sheet rounded="lg" border class="pa-8 text-center">
            <v-icon icon="mdi-lifebuoy" size="56" color="primary" class="mb-4" />
            <h1 class="text-h4 font-weight-bold mb-3">
              {{ t('tickets.employeeWelcome') }}
            </h1>
            <p class="text-body-1 text-medium-emphasis mb-6">
              {{ t('tickets.employeeDescription') }}
            </p>
            <v-btn color="primary" size="large" prepend-icon="mdi-plus" to="/tickets/create">
              {{ t('tickets.createSubmit') }}
            </v-btn>
          </v-sheet>
        </v-col>
      </v-row>
    </template>
  </v-container>
</template>

<style scoped>
.dashboard-page-header {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  margin-bottom: 32px;
}

.dashboard-page-header :deep(> div:first-child) {
  grid-column: 2;
  text-align: center;
}

.dashboard-page-header :deep(.page-header__actions) {
  grid-column: 3;
  justify-self: end;
}

.dashboard-page-header :deep(h1) {
  font-size: clamp(2.15rem, 3vw, 3rem) !important;
  line-height: 1.15;
}

.dashboard-new-ticket-btn {
  min-width: 188px;
}

@media (max-width: 900px) {
  .dashboard-page-header {
    grid-template-columns: 1fr;
    justify-items: center;
    gap: 18px;
  }

  .dashboard-page-header :deep(> div:first-child),
  .dashboard-page-header :deep(.page-header__actions) {
    grid-column: 1;
    justify-self: center;
  }
}
</style>
