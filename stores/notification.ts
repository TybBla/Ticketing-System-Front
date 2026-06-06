import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { TicketCreatedEvent } from '~/types/api'

export const useNotificationStore = defineStore('notification', () => {
  const { t } = useAppI18n()
  const refreshTicketsTrigger = ref(0)
  const lastMessage = ref<string | null>(null)
  const latestTicket = ref<TicketCreatedEvent | null>(null)
  const isToastVisible = ref(false)

  const triggerTicketsRefresh = (message?: string, ticket?: TicketCreatedEvent) => {
    refreshTicketsTrigger.value += 1
    lastMessage.value = message || null
    latestTicket.value = ticket || null
  }

  const showTicketCreated = (ticket: TicketCreatedEvent) => {
    triggerTicketsRefresh(t('notifications.newTicket', {
      title: ticket.title,
      email: ticket.creatorEmail,
    }), ticket)
    isToastVisible.value = true
  }

  const hideToast = () => {
    isToastVisible.value = false
  }

  return {
    refreshTicketsTrigger,
    lastMessage,
    latestTicket,
    isToastVisible,
    triggerTicketsRefresh,
    showTicketCreated,
    hideToast,
  }
})
