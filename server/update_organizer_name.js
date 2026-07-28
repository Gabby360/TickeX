require('dotenv').config();
const { PrismaClient } = require('./src/generated/prisma');
const { Pool } = require('pg');
const { PrismaPg } = require('@prisma/adapter-pg');

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  // Update all ORGANIZER users or user associated with events to 'Isaac Darko Asante'
  const updated = await prisma.user.updateMany({
    where: { role: 'ORGANIZER' },
    data: { name: 'Isaac Darko Asante' }
  });

  // Also update the organizer of AfriKreate event specifically
  const afriKreateEvent = await prisma.event.findFirst({
    where: { title: { contains: 'AfriKreate' } }
  });

  if (afriKreateEvent) {
    await prisma.user.update({
      where: { id: afriKreateEvent.organizerId },
      data: { name: 'Isaac Darko Asante' }
    });
  }

  console.log(`✅ Updated ${updated.count} organizer name(s) to 'Isaac Darko Asante'!`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
