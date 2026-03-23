import { PrismaClient } from '../src/generated/prisma/client';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';
import path from 'path';

const dbPath = path.join(process.cwd(), 'dev.db');
const adapter = new PrismaBetterSqlite3({ url: dbPath });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('🔧 Adding mock activities...');

  // Get Bogotá city
  const bogota = await prisma.city.findUnique({
    where: { slug: 'bogota' },
  });

  if (!bogota) {
    console.error('❌ Bogotá city not found. Run seed first.');
    return;
  }

  // Check if activities already exist
  const existingActivities = await prisma.activity.count();
  if (existingActivities > 0) {
    console.log(`⚠️  ${existingActivities} activities already exist. Skipping.`);
    return;
  }

  // Create mock activities
  const activities = await Promise.all([
    prisma.activity.create({
      data: {
        title: 'Salsa Class for Beginners',
        description: 'Learn the basics of salsa dancing! No partner needed. Our experienced instructors will teach you fundamental steps, rhythm, and basic turns. Perfect for tourists and locals looking to experience Colombian culture through dance.',
        category: 'class',
        subcategory: 'salsa',
        cityId: bogota.id,
        providerName: 'Rodrigo Salsa Academy',
        providerContact: '+57 300 123 4567',
        address: 'Calle 72 #10-45, Zona G, Bogotá',
        lat: 4.6572,
        lng: -74.0592,
        schedule: 'Every Tuesday and Thursday',
        scheduleDays: JSON.stringify(['tuesday', 'thursday']),
        scheduleTime: '19:00',
        duration: '1.5 hours',
        capacity: 20,
        price: 35000,
        currency: 'COP',
        isFree: false,
        imageUrl: 'https://images.unsplash.com/photo-1504609813442-a8924e83f76e?w=800',
        includes: JSON.stringify(['Dance shoes rental', 'Lesson materials', 'Water']),
        skillLevel: 'beginner',
        status: 'active',
      },
    }),
    prisma.activity.create({
      data: {
        title: 'Coffee Farm Tour & Tasting',
        description: 'Experience the complete Colombian coffee journey! Visit a local coffee farm, learn about cultivation and processing, and enjoy a professional coffee cupping session. Includes transportation from Bogotá and traditional lunch.',
        category: 'tour',
        subcategory: 'coffee',
        cityId: bogota.id,
        providerName: 'Colombia Coffee Experiences',
        providerContact: '+57 310 987 6543',
        address: 'Zipaquirá, Cundinamarca (1 hour from Bogotá)',
        lat: 4.9281,
        lng: -74.0287,
        schedule: 'Every Saturday',
        scheduleDays: JSON.stringify(['saturday']),
        scheduleTime: '08:00',
        duration: 'Full day (8 hours)',
        capacity: 12,
        price: 185000,
        currency: 'COP',
        isFree: false,
        imageUrl: 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=800',
        includes: JSON.stringify(['Transportation', 'Lunch', 'Coffee tasting', 'Farm tour']),
        skillLevel: 'all_levels',
        status: 'active',
      },
    }),
    prisma.activity.create({
      data: {
        title: 'Live Jazz Night - Fridays',
        description: 'Enjoy live jazz every Friday at our rooftop venue! Featuring rotating local and international artists. Full bar available with craft cocktails and Colombian wines. Arrive early for best seats.',
        category: 'entertainment',
        subcategory: 'live-music',
        cityId: bogota.id,
        providerName: 'Jazz Club La Casa',
        providerContact: '+57 1 456 7890',
        address: 'Carrera 11 #86-30, Zona Rosa, Bogotá',
        lat: 4.6645,
        lng: -74.0555,
        schedule: 'Every Friday',
        scheduleDays: JSON.stringify(['friday']),
        scheduleTime: '21:00',
        duration: '3 hours',
        capacity: 60,
        price: 50000,
        currency: 'COP',
        isFree: false,
        imageUrl: 'https://images.unsplash.com/photo-1415201364774-f6f0bb35f28f?w=800',
        includes: JSON.stringify(['Live music', 'Entrance fee']),
        skillLevel: 'all_levels',
        status: 'active',
      },
    }),
  ]);

  console.log(`✅ Created ${activities.length} activities:`);
  activities.forEach((a) => {
    console.log(`   - ${a.title} (${a.category}) - $${a.price.toLocaleString()} COP`);
  });
  console.log('🎉 Done!');
}

main()
  .catch((e) => {
    console.error('❌ Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
