import { TicketCategory, TicketStatus, type Ticket } from '../types/api'

export type StatusCount = {
  status: TicketStatus
  count: number
}

export type CategoryCount = {
  category: TicketCategory
  count: number
}

export const ticketStatuses = Object.values(TicketStatus)
  .filter((value): value is TicketStatus => typeof value === 'number')

export const ticketCategories = Object.values(TicketCategory)
  .filter((value): value is TicketCategory => typeof value === 'number')

export const countTicketsByStatus = (tickets: Ticket[]): StatusCount[] => {
  return ticketStatuses.map((status) => ({
    status,
    count: tickets.filter((ticket) => ticket.status === status).length,
  }))
}

export const countTicketsByCategory = (tickets: Ticket[]): CategoryCount[] => {
  return ticketCategories.map((category) => ({
    category,
    count: tickets.filter((ticket) => ticket.category === category).length,
  }))
}

export const countResolvedOrClosedTickets = (tickets: Ticket[]) => {
  return tickets.filter((ticket) => {
    return ticket.status === TicketStatus.Resolved || ticket.status === TicketStatus.Closed
  }).length
}

export const calculateCompletionRate = (tickets: Ticket[]) => {
  if (!tickets.length) return 0

  return Math.round((countResolvedOrClosedTickets(tickets) / tickets.length) * 100)
}
