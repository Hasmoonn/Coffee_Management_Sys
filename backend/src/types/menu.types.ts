export interface MenuItemCreateInput {
  name: string
  description: string
  price: number
  categoryId: string
  imageUrl?: string
  calories?: number
  preparationTime?: number
  customizations?: Record<string, any>
}

export interface MenuItemUpdateInput {
  name?: string
  description?: string
  price?: number
  categoryId?: string
  imageUrl?: string
  calories?: number
  preparationTime?: number
  customizations?: Record<string, any>
}
