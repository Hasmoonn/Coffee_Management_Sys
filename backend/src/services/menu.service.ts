import { prisma } from '../config/database'
import { MenuItemCreateInput, MenuItemUpdateInput } from '../types/menu.types'

const normalizeMenuItem = (item: any) => {
  if (!item) return item;
  if (item.imageUrl && (item.imageUrl.includes('\\uploads\\') || item.imageUrl.includes('/uploads/'))) {
    const filename = item.imageUrl.split(/[\\/]/).pop();
    return { ...item, imageUrl: `/uploads/${filename}` };
  }
  return item;
}

export const getAllMenuItems = async (query: any) => {
  const page = parseInt(query.page) || 1
  const limit = parseInt(query.limit) || 10
  const skip = (page - 1) * limit
  const categoryId = query.categoryId

  const where = categoryId
    ? { categoryId, isAvailable: true }
    : { isAvailable: true }

  // Batch queries for better performance
  const [items, total] = await Promise.all([
    prisma.menuItem.findMany({
      where,
      skip,
      take: limit,
      select: {
        id: true,
        name: true,
        description: true,
        price: true,
        imageUrl: true,
        isAvailable: true,
        isFeatured: true,
        isSeasonal: true,
        calories: true,
        preparationTime: true,
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.menuItem.count({ where }),
  ])

  return {
    data: items.map(normalizeMenuItem),
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  }
}

export const getMenuByCategory = async (slug: string) => {
  // Combine both queries into one to reduce database calls
  const category = await prisma.category.findUnique({
    where: { slug },
    select: {
      id: true,
      name: true,
      slug: true,
      description: true,
      imageUrl: true,
    },
  })

  if (!category) {
    throw new Error('Category not found')
  }

  const items = await prisma.menuItem.findMany({
    where: {
      categoryId: category.id,
      isAvailable: true,
    },
    select: {
      id: true,
      name: true,
      description: true,
      price: true,
      imageUrl: true,
      isAvailable: true,
      isFeatured: true,
      isSeasonal: true,
      calories: true,
      preparationTime: true,
    },
    orderBy: { createdAt: 'desc' },
  })

  return {
    category,
    items: items.map(normalizeMenuItem),
  }
}

export const getMenuItemById = async (id: string) => {
  const item = await prisma.menuItem.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      description: true,
      price: true,
      imageUrl: true,
      isAvailable: true,
      isFeatured: true,
      isSeasonal: true,
      calories: true,
      preparationTime: true,
      customizations: true,
      category: {
        select: {
          id: true,
          name: true,
          slug: true,
        },
      },
    },
  })

  if (!item) {
    throw new Error('Menu item not found')
  }

  return normalizeMenuItem(item)
}

export const getFeaturedItems = async () => {
  const items = await prisma.menuItem.findMany({
    where: {
      isFeatured: true,
      isAvailable: true,
    },
    select: {
      id: true,
      name: true,
      description: true,
      price: true,
      imageUrl: true,
      isAvailable: true,
      isFeatured: true,
      isSeasonal: true,
      calories: true,
      preparationTime: true,
      category: {
        select: {
          id: true,
          name: true,
          slug: true,
        },
      },
    },
  })

  return items.map(normalizeMenuItem)
}

export const createMenuItem = async (data: MenuItemCreateInput) => {
  const item = await prisma.menuItem.create({
    data: {
      name: data.name,
      description: data.description,
      price: data.price,
      categoryId: data.categoryId,
      imageUrl: data.imageUrl || '',
      calories: data.calories,
      preparationTime: data.preparationTime || 5,
      isAvailable: data.isAvailable ?? true,
      isFeatured: data.isFeatured ?? false,
      customizations: data.customizations,
    },
    include: { category: true },
  })

  return item
}

export const updateMenuItem = async (
  id: string,
  data: MenuItemUpdateInput
) => {
  const item = await prisma.menuItem.update({
    where: { id },
    data,
    include: { category: true },
  })

  return item
}

export const deleteMenuItem = async (id: string) => {
  await prisma.menuItem.delete({
    where: { id },
  })
}

export const toggleAvailability = async (id: string) => {
  const item = await prisma.menuItem.findUnique({
    where: { id },
  })

  if (!item) {
    throw new Error('Menu item not found')
  }

  const updatedItem = await prisma.menuItem.update({
    where: { id },
    data: { isAvailable: !item.isAvailable },
    include: { category: true },
  })

  return updatedItem
}
