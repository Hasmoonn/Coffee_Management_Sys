export interface ReservationCreateInput {
  tableId: string
  date: string
  time: string
  guests: number
  occasion?: string
  specialRequests?: string
}

export interface ReservationUpdateInput {
  tableId?: string
  date?: string
  time?: string
  guests?: number
  occasion?: string
  specialRequests?: string
}
