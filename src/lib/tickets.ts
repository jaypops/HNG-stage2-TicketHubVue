export interface Ticket {
  id: string
  title: string
  description: string
  status: 'open' | 'in_progress' | 'closed'
  priority: 'low' | 'medium' | 'high'
  createdAt: string
  updatedAt: string
}

export interface TicketStats {
  total: number
  open: number
  inProgress: number
  closed: number
}

const STORAGE_KEY = 'tickets'

export const getTickets = (): Ticket[] => {
  const tickets = localStorage.getItem(STORAGE_KEY)
  return tickets ? JSON.parse(tickets) : []
}

const saveTickets = (tickets: Ticket[]): void => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tickets))
}

export const createTicket = (
  title: string,
  description: string,
  priority: 'low' | 'medium' | 'high' = 'medium'
): Ticket => {
  const tickets = getTickets()
  const newTicket: Ticket = {
    id: Math.random().toString(36).substr(2, 9),
    title,
    description,
    status: 'open',
    priority,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
  tickets.push(newTicket)
  saveTickets(tickets)
  return newTicket
}

export const updateTicket = (
  id: string,
  updates: Partial<Omit<Ticket, 'id' | 'createdAt'>>
): Ticket | null => {
  const tickets = getTickets()
  const index = tickets.findIndex((t) => t.id === id)
  if (index === -1) return null

  const updatedTicket: Ticket = {
    ...tickets[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  }
  
  tickets[index] = updatedTicket
  saveTickets(tickets)
  return updatedTicket
}

export const deleteTicket = (id: string): boolean => {
  const tickets = getTickets()
  const filteredTickets = tickets.filter((t) => t.id !== id)
  if (filteredTickets.length === tickets.length) return false
  saveTickets(filteredTickets)
  return true
}

export const getTicketStats = (): TicketStats => {
  const tickets = getTickets()
  return {
    total: tickets.length,
    open: tickets.filter((t) => t.status === 'open').length,
    inProgress: tickets.filter((t) => t.status === 'in_progress').length,
    closed: tickets.filter((t) => t.status === 'closed').length,
  }
}