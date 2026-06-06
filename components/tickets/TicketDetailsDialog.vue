<script setup lang="ts">
import type { Ticket } from '~/types/api'
import { TicketStatus } from '~/types/api'

defineProps<{
  ticket: Ticket | null
}>()

const isOpen = defineModel<boolean>({ default: false })

const labels = useHelpdeskLabels()
const { t } = useAppI18n()
</script>

<template>
  <ClientOnly>
    <Teleport to="body">
      <v-dialog v-model="isOpen" max-width="720">
        <v-card v-if="ticket" rounded="lg">
          <v-card-item>
            <template #prepend>
              <v-avatar color="primary" variant="tonal">
                <v-icon icon="mdi-ticket-confirmation-outline" />
              </v-avatar>
            </template>

            <v-card-title class="text-h5 font-weight-bold">
              {{ ticket.title }}
            </v-card-title>
            <v-card-subtitle>
              {{ labels.ticketCategories[ticket.category] }} · {{ new Date(ticket.createdAt).toLocaleString('pl-PL') }}
            </v-card-subtitle>
          </v-card-item>

          <v-card-text>
            <div class="d-flex flex-wrap ga-2 mb-5">
              <v-chip :color="labels.ticketStatusColors[ticket.status]" variant="tonal">
                {{ labels.ticketStatuses[ticket.status] }}
              </v-chip>
              <v-chip v-if="ticket.isArchived" color="grey" variant="tonal">
                {{ t('tickets.archived') }}
              </v-chip>
            </div>

            <v-row>
              <v-col cols="12" md="7">
                <div class="text-overline text-medium-emphasis mb-1">
                  {{ t('tickets.description') }}
                </div>
                <p class="ticket-description">
                  {{ ticket.description }}
                </p>
              </v-col>
              <v-col cols="12" md="5">
                <v-sheet rounded="lg" border class="pa-4">
                  <div class="text-overline text-medium-emphasis mb-3">
                    {{ t('tickets.author') }}
                  </div>
                  <div class="font-weight-medium">
                    {{ ticket.creatorEmail || t('tickets.dataMissing') }}
                  </div>
                  <div class="text-body-2 text-medium-emphasis">
                    {{ ticket.creatorContactInfo || t('tickets.contactMissing') }}
                  </div>
                </v-sheet>
              </v-col>
            </v-row>
          </v-card-text>

          <v-card-actions>
            <v-spacer />
            <v-btn variant="tonal" @click="isOpen = false">
              {{ t('app.close') }}
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </Teleport>
  </ClientOnly>
</template>

<style scoped>
.ticket-description {
  white-space: pre-wrap;
  line-height: 1.7;
}
</style>
