require('dotenv').config();
const { PrismaClient } = require('./src/generated/prisma');
const { Pool } = require('pg');
const { PrismaPg } = require('@prisma/adapter-pg');

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  // Find or create organizer
  let organizer = await prisma.user.findFirst({
    where: { role: 'ORGANIZER' },
  });

  if (!organizer) {
    organizer = await prisma.user.create({
      data: {
        email: 'organizer@tickex.com',
        name: 'Isaac Darko Asante (AfriKreate)',
        password: 'password123',
        role: 'ORGANIZER',
      },
    });
  }

  const events = [
    {
      title: "AfriKreate Creative Summit",
      category: "Tech",
      date: new Date("2026-10-15T09:00:00Z"),
      location: "Mövenpick Ambassador Hotel, Accra",
      price: 200,
      description: "Join Isaac Darko Asante and West Africa's top innovators for AfriKreate Summit 2026 at Mövenpick Accra.",
      image: "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&q=80&w=800",
      featured: true,
      organizerId: organizer.id,
    },
    {
      title: "Accra Synthwave & Afrobeat Fest",
      category: "Music",
      date: new Date("2026-07-28T19:00:00Z"),
      location: "Accra International Conference Centre",
      price: 150,
      description: "Experience the electrifying fusion of synthwave soundscapes and authentic West African Afrobeat rhythms live in Accra.",
      image: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&q=80&w=800",
      featured: true,
      organizerId: organizer.id,
    },
    {
      title: "Ghana Global Tech Summit 2026",
      category: "Tech",
      date: new Date("2026-08-12T09:00:00Z"),
      location: "Labadi Beach Hotel, Accra",
      price: 0,
      description: "Connect with tech leaders, startups, and investors across Africa at the premier technology conference in Ghana.",
      image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=800",
      featured: true,
      organizerId: organizer.id,
    },
    {
      title: "Ghana Premier League Derby",
      category: "Sports",
      date: new Date("2026-08-20T16:00:00Z"),
      location: "Baba Yara Sports Stadium, Kumasi",
      price: 50,
      description: "Catch the fierce derby match live at Baba Yara Sports Stadium in Kumasi.",
      image: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&q=80&w=800",
      featured: true,
      organizerId: organizer.id,
    },
    {
      title: "Chorkor Grill & Highlife Fiesta",
      category: "Food",
      date: new Date("2026-09-05T12:00:00Z"),
      location: "Efua Sutherland Drama Studio, Accra",
      price: 80,
      description: "A celebration of Ghanaian culinary heritage, grilled delicacies, and classic Highlife music.",
      image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&q=80&w=800",
      featured: false,
      organizerId: organizer.id,
    }
  ];

  for (const item of events) {
    const existing = await prisma.event.findFirst({
      where: { title: item.title },
    });
    if (!existing) {
      await prisma.event.create({ data: item });
      console.log(`✅ Created event: ${item.title}`);
    }
  }

  console.log('🎉 Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
