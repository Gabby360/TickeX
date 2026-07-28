require('dotenv').config();
const { PrismaClient } = require('./src/generated/prisma');
const { Pool } = require('pg');
const { PrismaPg } = require('@prisma/adapter-pg');

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  const updated = await prisma.user.updateMany({
    where: {
      name: { contains: "Dennis", mode: "insensitive" }
    },
    data: {
      name: "Dennis Asiedu"
    }
  });

  // Also update description of StartupLens event
  const event = await prisma.event.findFirst({
    where: { title: { contains: "StartupLens" } }
  });

  if (event) {
    await prisma.event.update({
      where: { id: event.id },
      data: {
        description: "Join Dennis Asiedu and StartupLens for an immersive live podcast recording discussing artificial intelligence, deep tech, and the future of African startups at East Legon."
      }
    });
  }

  console.log(`✅ Updated ${updated.count} user record(s) to 'Dennis Asiedu'!`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
