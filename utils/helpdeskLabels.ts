import type { InjectionKey } from 'vue'
import { Role, TicketCategory, TicketStatus } from '~/types/api'

export interface HelpdeskLabels {
  roles: Record<Role, string>
  ticketCategories: Record<TicketCategory, string>
  ticketStatuses: Record<TicketStatus, string>
  ticketStatusColors: Record<TicketStatus, string>
}

export const helpdeskLabelsKey: InjectionKey<HelpdeskLabels> = Symbol('helpdeskLabels')

export const helpdeskLabels: HelpdeskLabels = {
  roles: {
    [Role.Admin]: 'Admin',
    [Role.Employee]: 'Pracownik',
  },
  ticketCategories: {
    [TicketCategory.Hardware]: 'Hardware',
    [TicketCategory.Software]: 'Software',
  },
  ticketStatuses: {
    [TicketStatus.New]: 'Nowe',
    [TicketStatus.InProgress]: 'W toku',
    [TicketStatus.Resolved]: 'Rozwiazane',
    [TicketStatus.Closed]: 'Zamkniete',
  },
  ticketStatusColors: {
    [TicketStatus.New]: 'warning',
    [TicketStatus.InProgress]: 'primary',
    [TicketStatus.Resolved]: 'success',
    [TicketStatus.Closed]: 'grey',
  },
}
