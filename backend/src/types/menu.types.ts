export interface MenuItemCreateInput {
  name: string
  description: string
  price: number
  categoryId: string
  imageUrl?: string
  calories?: number
  preparationTime?: number
  isAvailable?: boolean
  isFeatured?: boolean
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
  isAvailable?: boolean
  isFeatured?: boolean
  customizations?: Record<string, any>
}
