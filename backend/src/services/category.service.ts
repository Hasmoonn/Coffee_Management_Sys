import { prisma } from '../config/database'

export const getAllCategories = async () => {
  return await prisma.category.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: 'asc' },
  })
}

export const createCategory = async (data: any) => {
  return await prisma.category.create({
    data,
  })
}

export const updateCategory = async (id: string, data: any) => {
  return await prisma.category.update({
    where: { id },
    data,
  })
}

export const deleteCategory = async (id: string) => {
  await prisma.category.delete({
    where: { id },
  })
}
