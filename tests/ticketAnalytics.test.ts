import { describe, expect, it } from 'vitest'
import { TicketCategory, TicketStatus, type Ticket } from '../types/api'
import {
  calculateCompletionRate,
  countResolvedOrClosedTickets,
  countTicketsByCategory,
  countTicketsByStatus,
} from '../utils/ticketAnalytics'

const createTicket = (
  id: string,
  status: TicketStatus,
  category: TicketCategory,
): Ticket => ({
  id,
  title: `Ticket ${id}`,
  description: `Description ${id}`,
  status,
  category,
  isArchived: false,
  createdAt: '2026-06-07T10:00:00.000Z',
  creatorEmail: 'user@test.com',
  creatorContactInfo: 'Biurko 42',
})

describe('ticket analytics', () => {
  const tickets = [
    createTicket('1', TicketStatus.New, TicketCategory.Software),
    createTicket('2', TicketStatus.InProgress, TicketCategory.Hardware),
    createTicket('3', TicketStatus.Resolved, TicketCategory.Software),
    createTicket('4', TicketStatus.Closed, TicketCategory.Hardware),
  ]

  it('counts tickets by status', () => {
    expect(countTicketsByStatus(tickets)).toEqual([
      { status: TicketStatus.New, count: 1 },
      { status: TicketStatus.InProgress, count: 1 },
      { status: TicketStatus.Resolved, count: 1 },
      { status: TicketStatus.Closed, count: 1 },
    ])
  })

  it('counts tickets by category', () => {
    expect(countTicketsByCategory(tickets)).toEqual([
      { category: TicketCategory.Hardware, count: 2 },
      { category: TicketCategory.Software, count: 2 },
    ])
  })

  it('calculates completion rate from resolved and closed tickets', () => {
    expect(countResolvedOrClosedTickets(tickets)).toBe(2)
    expect(calculateCompletionRate(tickets)).toBe(50)
  })

  it('returns zero completion for an empty dataset', () => {
    expect(calculateCompletionRate([])).toBe(0)
  })
})
