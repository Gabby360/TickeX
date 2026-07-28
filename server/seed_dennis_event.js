require('dotenv').config();
const { PrismaClient } = require('./src/generated/prisma');
const { Pool } = require('pg');
const { PrismaPg } = require('@prisma/adapter-pg');

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  // Find or create Dennis Opoku user
  let dennis = await prisma.user.findFirst({
    where: { email: 'dennis@startuplens.com' },
  });

  if (!dennis) {
    dennis = await prisma.user.create({
      data: {
        email: 'dennis@startuplens.com',
        name: 'Dennis Asiedu',
        password: 'password123',
        role: 'ORGANIZER',
      },
    });
  }

  const dennisEvent = {
    title: "StartupLens Tech & AI Live Podcast",
    category: "Tech",
    date: new Date("2026-11-08T18:00:00Z"),
    location: "The Underbridge Hotel, East Legon, Accra",
    price: 100,
    description: "Join Dennis Asiedu and StartupLens for an immersive live podcast recording discussing artificial intelligence, deep tech, and the future of African startups at East Legon.",
    image: "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&q=80&w=800",
    featured: true,
    organizerId: dennis.id,
  };

  const existing = await prisma.event.findFirst({
    where: { title: dennisEvent.title },
  });

  if (!existing) {
    await prisma.event.create({ data: dennisEvent });
    console.log(`✅ Created event: ${dennisEvent.title}`);
  } else {
    console.log(`ℹ️ Event already exists: ${dennisEvent.title}`);
  }

  console.log('🎉 Dennis event seed completed!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
