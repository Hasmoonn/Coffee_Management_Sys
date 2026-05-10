import app from './src/app'
import { env } from './src/config/env'
import { prisma } from './src/config/database'

const PORT = env.PORT || 4000

const server = app.listen(PORT, () => {
  console.log(`
  Server running on:
  http://localhost:${PORT}

  Environment: ${env.NODE_ENV}
  `)
})

// Graceful shutdown
const shutdown = async () => {
  console.log('Shutting down server...')

  server.close(async () => {
    await prisma.$disconnect()
    process.exit(0)
  })
}

process.on('SIGINT', shutdown)
process.on('SIGTERM', shutdown)

process.on('uncaughtException', async (error) => {
  console.error('Uncaught Exception:', error)
  await prisma.$disconnect()
  process.exit(1)
})

process.on('unhandledRejection', async (error) => {
  console.error('Unhandled Rejection:', error)
  await prisma.$disconnect()
  process.exit(1)
})