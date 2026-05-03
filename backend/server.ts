import app from './src/app'
import { env } from './src/config/env'
import { prisma } from './src/config/database'

const PORT = env.PORT || 5000

const server = app.listen(PORT, () => {
  console.log(`
  Server: http://localhost:${PORT}
  Environment: ${env.NODE_ENV}
  Secure: CORS enabled
  
  Ready to accept requests!
  `)
})

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('\nGracefully shutting down...')
  server.close(async () => {
    await prisma.$disconnect()
    console.log('Server closed')
    process.exit(0)
  })
})

process.on('SIGTERM', async () => {
  console.log('\nGracefully shutting down...')
  server.close(async () => {
    await prisma.$disconnect()
    console.log('Server closed')
    process.exit(0)
  })
})

// Handle uncaught exceptions
process.on('uncaughtException', async (error) => {
  console.error('Uncaught Exception:', error)
  server.close(async () => {
    await prisma.$disconnect()
    process.exit(1)
  })
})

// Handle unhandled rejections
process.on('unhandledRejection', async (error) => {
  console.error('Unhandled Rejection:', error)
  server.close(async () => {
    await prisma.$disconnect()
    process.exit(1)
  })
})
