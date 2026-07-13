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

  // 1. Organizer Account
  await prisma.user.upsert({
    where: { email: 'organizer@tickex.com' },
    update: { role: 'ORGANIZER', password },
    create: {
      email: 'organizer@tickex.com',
      name: 'Accra Events Co (Organizer)',
      password,
      role: 'ORGANIZER',
    },
  });

  // 2. Admin Account
  await prisma.user.upsert({
    where: { email: 'admin@tickex.com' },
    update: { role: 'ADMIN', password },
    create: {
      email: 'admin@tickex.com',
      name: 'TickeX System Admin',
      password,
      role: 'ADMIN',
    },
  });

  // 3. Regular User Account
  await prisma.user.upsert({
    where: { email: 'user@tickex.com' },
    update: { role: 'USER', password },
    create: {
      email: 'user@tickex.com',
      name: 'John Doe (Attendee)',
      password,
      role: 'USER',
    },
  });

  console.log('✅ Accounts Seeded Successfully:');
  console.log('-------------------------------------------');
  console.log('🎟️  ORGANIZER : organizer@tickex.com  | pass: password123');
  console.log('🛡️  ADMIN     : admin@tickex.com      | pass: password123');
  console.log('👤  USER      : user@tickex.com       | pass: password123');
  console.log('-------------------------------------------');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
