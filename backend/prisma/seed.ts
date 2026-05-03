import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Create categories
  const espresso = await prisma.category.create({
    data: {
      name: 'Espresso',
      slug: 'espresso',
      description: 'Rich and concentrated coffee beverages',
      sortOrder: 1,
    },
  })

  const cappuccino = await prisma.category.create({
    data: {
      name: 'Cappuccino',
      slug: 'cappuccino',
      description: 'Smooth milk-based coffee drinks',
      sortOrder: 2,
    },
  })

  const pastries = await prisma.category.create({
    data: {
      name: 'Pastries',
      slug: 'pastries',
      description: 'Fresh baked goods',
      sortOrder: 3,
    },
  })

  // Create menu items
  await prisma.menuItem.create({
    data: {
      name: 'Classic Espresso',
      description: 'Single shot of pure espresso',
      price: 2.5,
      categoryId: espresso.id,
      imageUrl: '/images/espresso.jpg',
      calories: 5,
      preparationTime: 2,
      isFeatured: true,
    },
  })

  await prisma.menuItem.create({
    data: {
      name: 'Double Espresso',
      description: 'Double shot of rich espresso',
      price: 3.5,
      categoryId: espresso.id,
      imageUrl: '/images/double-espresso.jpg',
      calories: 10,
      preparationTime: 2,
    },
  })

  await prisma.menuItem.create({
    data: {
      name: 'Cappuccino',
      description: 'Espresso with steamed milk and foam',
      price: 4.0,
      categoryId: cappuccino.id,
      imageUrl: '/images/cappuccino.jpg',
      calories: 120,
      preparationTime: 3,
      isFeatured: true,
    },
  })

  await prisma.menuItem.create({
    data: {
      name: 'Latte',
      description: 'Smooth espresso with steamed milk',
      price: 4.5,
      categoryId: cappuccino.id,
      imageUrl: '/images/latte.jpg',
      calories: 150,
      preparationTime: 3,
    },
  })

  await prisma.menuItem.create({
    data: {
      name: 'Croissant',
      description: 'Buttery, flaky pastry',
      price: 3.0,
      categoryId: pastries.id,
      imageUrl: '/images/croissant.jpg',
      calories: 270,
      preparationTime: 1,
    },
  })

  // Create tables
  for (let i = 1; i <= 10; i++) {
    await prisma.table.create({
      data: {
        tableNumber: i,
        capacity: i <= 5 ? 2 : 4,
        isAvailable: true,
      },
    })
  }

  console.log('✅ Database seeded successfully!')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error('❌ Error seeding database:', e)
    await prisma.$disconnect()
    process.exit(1)
  })
