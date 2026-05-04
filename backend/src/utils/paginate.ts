interface PaginationOptions {
  page?: number
  limit?: number
}

interface PaginatedResult<T> {
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    pages: number
  }
}

export const paginate = <T>(data: T[], total: number, options: PaginationOptions): PaginatedResult<T> => {
  const page = Math.max(1, options.page || 1)
  const limit = Math.min(100, Math.max(1, options.limit || 10))
  const pages = Math.ceil(total / limit)

  return {
    data,
    pagination: {
      page,
      limit,
      total,
      pages,
    },
  }
}

export const getPaginationOffset = (page: number = 1, limit: number = 10): number => {
  return (page - 1) * limit
}
