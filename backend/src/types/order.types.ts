export interface OrderCreateInput {
  orderType: 'DINE_IN' | 'TAKE_AWAY' | 'DELIVERY'
  items: OrderItemInput[]
  deliveryAddress?: string
  specialNote?: string
}

export interface OrderItemInput {
  menuItemId: string
  quantity: number
  customization?: Record<string, any>
}
