require('dotenv').config();
const { PrismaClient } = require('./src/generated/prisma');
const { Pool } = require('pg');
const { PrismaPg } = require('@prisma/adapter-pg');

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  const newImage = "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&q=80&w=800";

  const updated = await prisma.event.updateMany({
    where: {
      title: { contains: "Coding Challenge", mode: "insensitive" }
    },
    data: {
      image: newImage,
      location: "Impact Hub Accra, Osu"
    }
  });

  console.log(`✅ Updated ${updated.count} Coding Challenge event image & location to local Ghanaian tech hub!`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
