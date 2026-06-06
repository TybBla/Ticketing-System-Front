import { refDebounced } from '@vueuse/core'
import type { Ticket } from '~/types/api'
import { TicketCategory, TicketStatus } from '~/types/api'
import { getApiErrorMessage } from '~/utils/apiError'

export const useTickets = () => {
  const authStore = useAuthStore()
  const { apiFetch } = useApi()
  const labels = useHelpdeskLabels()
  const { t } = useAppI18n()

  const tickets = ref<Ticket[]>([])
  const analyticsTickets = ref<Ticket[]>([])
  const isLoading = ref(false)
  const errorMessage = ref('')
  const search = ref('')
  const debouncedSearch = refDebounced(search, 250)
  const includeArchived = ref(false)

  const statusOptions = Object.entries(labels.ticketStatuses).map(([value, title]) => ({
    title,
    value: Number(value),
  }))

  const filteredTickets = computed(() => {
    const term = debouncedSearch.value.trim().toLowerCase()
    if (!term) return tickets.value

    return tickets.value.filter((ticket) => {
      return [
        ticket.title,
        ticket.description,
        ticket.creatorEmail,
        labels.ticketCategories[ticket.category],
        labels.ticketStatuses[ticket.status],
      ].some((value) => value?.toLowerCase().includes(term))
    })
  })

  const activeTicketsCount = computed(() => analyticsTickets.value.filter((ticket) => !ticket.isArchived).length)
  const closedTicketsCount = computed(() => analyticsTickets.value.filter((ticket) => ticket.status === TicketStatus.Closed).length)
  const newTicketsCount = computed(() => analyticsTickets.value.filter((ticket) => ticket.status === TicketStatus.New).length)

  const fetchTickets = async () => {
    if (!authStore.isAdmin) return

    isLoading.value = true
    errorMessage.value = ''

    try {
      if (includeArchived.value) {
        const fetchedTickets = await apiFetch<Ticket[]>('/api/Tickets?includeArchived=true')
        tickets.value = fetchedTickets
        analyticsTickets.value = fetchedTickets
      } else {
        const [visibleTickets, allTickets] = await Promise.all([
          apiFetch<Ticket[]>('/api/Tickets?includeArchived=false'),
          apiFetch<Ticket[]>('/api/Tickets?includeArchived=true'),
        ])
        tickets.value = visibleTickets
        analyticsTickets.value = allTickets
      }
    } catch (error) {
      errorMessage.value = getApiErrorMessage(error, t('tickets.fetchError'))
    } finally {
      isLoading.value = false
    }
  }

  const updateTicketStatus = async (ticket: Ticket, status: TicketStatus) => {
    errorMessage.value = ''

    try {
      await apiFetch(`/api/Tickets/${ticket.id}/status`, {
        method: 'PATCH',
        body: { status },
      })
      await fetchTickets()
      return true
    } catch (error) {
      errorMessage.value = getApiErrorMessage(error, t('tickets.updateStatusError'))
      return false
    }
  }

  return {
    tickets,
    analyticsTickets,
    isLoading,
    errorMessage,
    search,
    includeArchived,
    statusLabels: labels.ticketStatuses,
    categoryLabels: labels.ticketCategories,
    statusOptions,
    filteredTickets,
    activeTicketsCount,
    closedTicketsCount,
    newTicketsCount,
    fetchTickets,
    updateTicketStatus,
  }
}
