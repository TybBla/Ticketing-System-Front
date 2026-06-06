import { inject, reactive, computed } from 'vue'
import { Role, TicketCategory, TicketStatus } from '~/types/api'
import { helpdeskLabels, helpdeskLabelsKey } from '~/utils/helpdeskLabels'

export const useHelpdeskLabels = () => {
  const providedLabels = inject(helpdeskLabelsKey, helpdeskLabels)
  const { t } = useAppI18n()

  return reactive({
    roles: computed(() => ({
      [Role.Admin]: t('roles.admin'),
      [Role.Employee]: t('roles.employee'),
    })),
    ticketCategories: computed(() => ({
      [TicketCategory.Hardware]: t('categories.hardware'),
      [TicketCategory.Software]: t('categories.software'),
    })),
    ticketStatuses: computed(() => ({
      [TicketStatus.New]: t('statuses.new'),
      [TicketStatus.InProgress]: t('statuses.inProgress'),
      [TicketStatus.Resolved]: t('statuses.resolved'),
      [TicketStatus.Closed]: t('statuses.closed'),
    })),
    ticketStatusColors: providedLabels.ticketStatusColors,
  })
}
