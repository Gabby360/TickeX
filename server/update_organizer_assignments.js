require('dotenv').config();
const { PrismaClient } = require('./src/generated/prisma');
const bcrypt = require('bcryptjs');
const { Pool } = require('pg');
const { PrismaPg } = require('@prisma/adapter-pg');

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  const password = await bcrypt.hash('password123', 10);

  // 1. Ensure Agblevor Gabriel organizer user exists
  let gabriel = await prisma.user.findFirst({
    where: { name: { contains: "Gabriel", mode: "insensitive" } }
  });

  if (!gabriel) {
    gabriel = await prisma.user.create({
      data: {
        email: 'gabriel@milessystems.com',
        name: 'Agblevor Gabriel',
        password,
        role: 'ORGANIZER',
      }
    });
  } else {
    gabriel = await prisma.user.update({
      where: { id: gabriel.id },
      data: { name: 'Agblevor Gabriel', role: 'ORGANIZER' }
    });
  }

  // 2. Update events organizerId in PostgreSQL database
  // AfriKreate -> Isaac Darko Asante
  // StartupLens -> Dennis Asiedu
  // All other events -> Agblevor Gabriel

  const events = await prisma.event.findMany({
    include: { organizer: true }
  });

  for (const event of events) {
    const title = event.title;
    if (title.includes("AfriKreate")) {
      // Keep Isaac
      console.log(`📌 Keeping Isaac as organizer for: ${title}`);
    } else if (title.includes("StartupLens")) {
      // Keep Dennis
      console.log(`📌 Keeping Dennis as organizer for: ${title}`);
    } else {
      // Reassign to Agblevor Gabriel
      await prisma.event.update({
        where: { id: event.id },
        data: { organizerId: gabriel.id }
      });
      console.log(`✅ Set Agblevor Gabriel as organizer for: ${title}`);
    }
  }

  console.log('🎉 All event organizers updated successfully in PostgreSQL database!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
