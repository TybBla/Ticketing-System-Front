export enum Role {
  Admin = 0,
  Employee = 1,
}

export enum TicketCategory {
  Hardware = 0,
  Software = 1,
}

export enum TicketStatus {
  New = 0,
  InProgress = 1,
  Resolved = 2,
  Closed = 3,
}

export interface LoginResponse {
  token?: string
  requires2FA?: boolean
  requires2FASetup?: boolean
  preAuthToken?: string
  secretKey?: string
  message?: string
}

export interface Ticket {
  id: string
  title: string
  description: string
  status: TicketStatus
  category: TicketCategory
  isArchived: boolean
  createdAt: string
  creatorEmail?: string
  creatorContactInfo?: string | null
}

export interface TicketCreatedEvent {
  ticketId: string
  title: string
  creatorEmail: string
}

export interface UserAccount {
  id: string
  email: string
  role: Role
  twoFactorEnabled: boolean
  contactInfo?: string | null
}

export interface CreateUserRequest {
  email: string
  password: string
  role: Role
  contactInfo?: string | null
}

export interface ApiMessage {
  message?: string
}
