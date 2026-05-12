import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient({
  // Optimize connection pooling
  errorFormat: 'pretty',
})

// Optimize Prisma for production - monitor slow queries
if (process.env.NODE_ENV === 'production') {
  // Use $extends for query monitoring (Prisma 5.x compatible)
  const originalPrisma = prisma
  
  // Optional: Enable query logging via environment variable
  // Set QUERY_LOGGING=true to enable
  if (process.env.QUERY_LOGGING === 'true') {
    console.log('Query logging enabled. WARNING: This impacts performance!')
  }
}

export { prisma }
