import { PrismaClient } from '../src/generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import bcrypt from 'bcrypt';
import 'dotenv/config';

const connectionString = process.env.DATABASE_URL!;
const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

async function main() {
  console.log('🌱 Seeding database...');

  // Create cities
  const cities = await Promise.all([
    prisma.city.create({
      data: {
        name: 'Bogotá',
        country: 'Colombia',
        slug: 'bogota',
        lat: 4.7110,
        lng: -74.0721,
        zoom: 12,
        timezone: 'America/Bogota',
        isActive: true,
      },
    }),
    prisma.city.create({
      data: {
        name: 'Pereira',
        country: 'Colombia',
        slug: 'pereira',
        lat: 4.8133,
        lng: -75.6961,
        zoom: 13,
        timezone: 'America/Bogota',
        isActive: true,
      },
    }),
    prisma.city.create({
      data: {
        name: 'Medellín',
        country: 'Colombia',
        slug: 'medellin',
        lat: 6.2442,
        lng: -75.5812,
        zoom: 12,
        timezone: 'America/Bogota',
        isActive: false,
      },
    }),
    prisma.city.create({
      data: {
        name: 'Cartagena',
        country: 'Colombia',
        slug: 'cartagena',
        lat: 10.3910,
        lng: -75.4794,
        zoom: 12,
        timezone: 'America/Bogota',
        isActive: false,
      },
    }),
  ]);

  console.log(`✅ Created ${cities.length} cities`);

  // Create admin user with bcrypt
  const adminPassword = await hashPassword('admin123');
  const admin = await prisma.user.create({
    data: {
      email: 'admin@aroundme.co',
      name: 'Admin',
      password: adminPassword,
      role: 'admin',
      isVerified: true,
    },
  });

  console.log(`✅ Created admin user: ${admin.email}`);

  // Create events
  const bogota = cities[0];
  
  const events = await Promise.all([
    prisma.event.create({
      data: {
        title: 'Rock in the Park',
        description: 'Join us for an incredible night of rock music featuring local bands at Simon Bolivar Park.',
        category: 'music',
        status: 'published',
        cityId: bogota.id,
        venueName: 'Parque Simón Bolívar',
        venueAddress: 'Av. Caracas #60-00, Bogotá',
        venueLat: 4.6588,
        venueLng: -74.0965,
        dateStart: new Date('2026-03-21T18:00:00Z'),
        dateEnd: new Date('2026-03-21T23:00:00Z'),
        isFree: true,
        imageUrl: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800',
        tags: 'rock,free,outdoor,live-music',
      },
    }),
    prisma.event.create({
      data: {
        title: 'Startup Weekend Bogotá',
        description: '54 hours to build a startup! Network with entrepreneurs, developers, and designers.',
        category: 'tech',
        status: 'published',
        cityId: bogota.id,
        venueName: 'HubBOG',
        venueAddress: 'Calle 100 #8A-37, Bogotá',
        venueLat: 4.6763,
        venueLng: -74.0459,
        dateStart: new Date('2026-03-22T18:00:00Z'),
        dateEnd: new Date('2026-03-24T21:00:00Z'),
        priceMin: 50000,
        priceMax: 150000,
        currency: 'COP',
        isFree: false,
        imageUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800',
        tags: 'startup,networking,tech,entrepreneurship',
      },
    }),
    prisma.event.create({
      data: {
        title: 'Street Food Festival',
        description: 'Experience the best of Colombian street food! Arepas, empanadas, and international cuisines.',
        category: 'food',
        status: 'published',
        cityId: bogota.id,
        venueName: 'Plaza de Bolívar',
        venueAddress: 'Carrera 7 #11-10, Bogotá',
        venueLat: 4.5981,
        venueLng: -74.0776,
        dateStart: new Date('2026-03-23T11:00:00Z'),
        dateEnd: new Date('2026-03-23T20:00:00Z'),
        isFree: true,
        imageUrl: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800',
        tags: 'food,festival,free,street-food',
      },
    }),
    prisma.event.create({
      data: {
        title: 'Yoga in the Park',
        description: 'Free outdoor yoga session for all levels. Bring your mat and water.',
        category: 'sports',
        status: 'published',
        cityId: bogota.id,
        venueName: 'Parque de la 93',
        venueAddress: 'Calle 93 #13-15, Bogotá',
        venueLat: 4.6761,
        venueLng: -74.0509,
        dateStart: new Date('2026-03-20T07:00:00Z'),
        dateEnd: new Date('2026-03-20T08:30:00Z'),
        isFree: true,
        imageUrl: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800',
        tags: 'yoga,wellness,free,outdoor',
      },
    }),
  ]);

  // Create Pereira events
  const pereira = cities[1];
  
  const pereiraEvents = await Promise.all([
    prisma.event.create({
      data: {
        title: 'Festival del Café',
        description: 'Celebrate the best Colombian coffee at our annual festival! Coffee tastings, live music, artisan crafts.',
        category: 'food',
        status: 'published',
        cityId: pereira.id,
        venueName: 'Plaza de Bolívar Pereira',
        venueAddress: 'Carrera 7 #18-28, Centro',
        venueLat: 4.8144,
        venueLng: -75.6946,
        dateStart: new Date('2026-03-22T09:00:00Z'),
        dateEnd: new Date('2026-03-22T21:00:00Z'),
        isFree: true,
        imageUrl: 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=800',
        tags: 'coffee,festival,free,family',
      },
    }),
    prisma.event.create({
      data: {
        title: 'Salsa en el Parque',
        description: 'Free outdoor salsa dance event! Beginners welcome. Free lesson at 6 PM followed by social dancing.',
        category: 'nightlife',
        status: 'published',
        cityId: pereira.id,
        venueName: 'Parque Lineal',
        venueAddress: 'Av. Circunvalar, Pereira',
        venueLat: 4.8089,
        venueLng: -75.6891,
        dateStart: new Date('2026-03-21T18:00:00Z'),
        dateEnd: new Date('2026-03-22T00:00:00Z'),
        isFree: true,
        imageUrl: 'https://images.unsplash.com/photo-1504609813442-a8924e83f76e?w=800',
        tags: 'salsa,dancing,free,outdoor',
      },
    }),
    prisma.event.create({
      data: {
        title: 'Expo Emprendedores 2026',
        description: 'Network with local entrepreneurs and discover innovative businesses from the coffee region.',
        category: 'tech',
        status: 'published',
        cityId: pereira.id,
        venueName: 'Centro de Convenciones',
        venueAddress: 'Calle 26 #10-30, Pereira',
        venueLat: 4.8138,
        venueLng: -75.6988,
        dateStart: new Date('2026-03-25T08:00:00Z'),
        dateEnd: new Date('2026-03-25T18:00:00Z'),
        isFree: true,
        imageUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800',
        tags: 'entrepreneurs,networking,tech,business',
      },
    }),
  ]);

  console.log(`✅ Created ${events.length + pereiraEvents.length} events`);

  // Create places
  const places = await Promise.all([
    prisma.place.create({
      data: {
        name: 'Café de los Artistas',
        description: 'A cozy coffee shop in the heart of Zona G with excellent Colombian coffee.',
        category: 'cafe',
        cityId: bogota.id,
        address: 'Calle 72 #5-41, Zona G, Bogotá',
        lat: 4.6567,
        lng: -74.0598,
        imageUrl: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800',
        rating: 4.7,
        reviewCount: 234,
        priceRange: '$$',
        isVerified: true,
        isClaimed: true,
        features: 'WiFi,Power outlets,Quiet music,Outdoor seating',
        tags: 'coffee,pastries,remote-work,zonas-g',
      },
    }),
    prisma.place.create({
      data: {
        name: 'La Tequila',
        description: 'Authentic Mexican cantina with the best margaritas in town.',
        category: 'bar',
        cityId: bogota.id,
        address: 'Carrera 11 #84-09, Zona Rosa, Bogotá',
        lat: 4.6639,
        lng: -74.0562,
        imageUrl: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=800',
        rating: 4.5,
        reviewCount: 189,
        priceRange: '$$',
        isVerified: true,
        isClaimed: true,
        features: 'Rooftop,Live music,Happy hour,Terrace',
        contactInstagram: '@latequila_bogota',
        tags: 'mexican,margaritas,nightlife,rooftop',
      },
    }),
    prisma.place.create({
      data: {
        name: 'Parque Simón Bolívar',
        description: "Bogotá's largest urban park. Perfect for jogging, cycling, and picnics.",
        category: 'park',
        cityId: bogota.id,
        address: 'Av. Caracas #60-00, Bogotá',
        lat: 4.6588,
        lng: -74.0965,
        imageUrl: 'https://images.unsplash.com/photo-1568515387631-8b650bbcdb90?w=800',
        rating: 4.6,
        reviewCount: 1247,
        isVerified: true,
        features: 'Jogging tracks,Lake,Playground,Sports fields',
        tags: 'park,nature,outdoor,family,free',
      },
    }),
    prisma.place.create({
      data: {
        name: 'Pan della Sera',
        description: 'Artisan bakery specializing in sourdough bread and Italian pastries.',
        category: 'cafe',
        cityId: bogota.id,
        address: 'Calle 119 #4-16, Usaquén, Bogotá',
        lat: 4.6931,
        lng: -74.0298,
        imageUrl: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800',
        rating: 4.9,
        reviewCount: 521,
        priceRange: '$',
        isVerified: true,
        isClaimed: true,
        features: 'Sourdough,Croissants,Coffee,Pastries',
        contactPhone: '+57 1 567 8901',
        contactInstagram: '@pandellasera',
        tags: 'bakery,coffee,italian,sourdough,breakfast',
      },
    }),
  ]);

  // Create Pereira places
  const pereiraPlaces = await Promise.all([
    prisma.place.create({
      data: {
        name: 'Café Río',
        description: 'Traditional coffee shop in the heart of Pereira. Famous for their aromatic coffee and Tres Leches cake.',
        category: 'cafe',
        cityId: pereira.id,
        address: 'Carrera 8 #23-15, Centro, Pereira',
        lat: 4.8133,
        lng: -75.6955,
        imageUrl: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800',
        rating: 4.8,
        reviewCount: 312,
        priceRange: '$',
        isVerified: true,
        isClaimed: true,
        features: 'WiFi,Traditional coffee,Tres Leches,Local atmosphere',
        contactPhone: '+57 6 324 5678',
        contactInstagram: '@caferiopereira',
        tags: 'coffee,traditional,breakfast,tres-leches',
      },
    }),
    prisma.place.create({
      data: {
        name: 'La Casona',
        description: 'Authentic Colombian restaurant in a restored colonial mansion. Try their bandeja paisa!',
        category: 'restaurant',
        cityId: pereira.id,
        address: 'Calle 14 #4-12, La Julita, Pereira',
        lat: 4.8167,
        lng: -75.6912,
        imageUrl: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?w=800',
        rating: 4.6,
        reviewCount: 245,
        priceRange: '$$',
        isVerified: true,
        isClaimed: true,
        features: 'Live music,Colonial architecture,Bandeja paisa,Outdoor seating',
        contactPhone: '+57 6 335 6789',
        contactInstagram: '@lacasonapereira',
        tags: 'colombian,traditional,vallenato,family',
      },
    }),
    prisma.place.create({
      data: {
        name: 'Parque Lineal Urbana',
        description: 'Beautiful linear park along the river. Perfect for jogging, cycling, or a peaceful afternoon walk.',
        category: 'park',
        cityId: pereira.id,
        address: 'Av. Circunvalar, Pereira',
        lat: 4.8089,
        lng: -75.6891,
        imageUrl: 'https://images.unsplash.com/photo-1568515387631-8b650bbcdb90?w=800',
        rating: 4.5,
        reviewCount: 189,
        isVerified: true,
        features: 'River views,Jogging tracks,Coffee kiosks,Playground',
        tags: 'park,nature,outdoor,exercise,free',
      },
    }),
    prisma.place.create({
      data: {
        name: 'Bar La Terraza',
        description: 'Popular rooftop bar with panoramic city views. Craft cocktails and excellent ceviche.',
        category: 'bar',
        cityId: pereira.id,
        address: 'Carrera 10 #26-45, El Poblado, Pereira',
        lat: 4.8112,
        lng: -75.6934,
        imageUrl: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=800',
        rating: 4.4,
        reviewCount: 156,
        priceRange: '$$',
        isVerified: true,
        isClaimed: true,
        features: 'Rooftop,City views,Craft cocktails,Ceviche',
        contactInstagram: '@laterraza_pereira',
        tags: 'bar,rooftop,cocktails,views',
      },
    }),
  ]);

  console.log(`✅ Created ${places.length + pereiraPlaces.length} places`);

  // Create activities
  const activities = await Promise.all([
    prisma.activity.create({
      data: {
        title: 'Salsa Dance Class',
        description: 'Learn salsa dancing with professional instructors in a fun group setting. Perfect for beginners and intermediate dancers.',
        category: 'class',
        cityId: bogota.id,
        providerName: 'Bogotá Dance Academy',
        providerContact: 'dance@example.com',
        schedule: 'Every Tuesday and Thursday 7pm',
        price: 50000,
        currency: 'COP',
        duration: '2 hours',
        capacity: 20,
        isFree: false,
        address: 'Calle 85 #15-30, Bogotá',
        lat: 4.6639,
        lng: -74.0562,
        imageUrl: 'https://images.unsplash.com/photo-1504609813442-a8924e83f76e?w=800',
      },
    }),
    prisma.activity.create({
      data: {
        title: 'Bogotá Historic Walking Tour',
        description: 'Explore the historic center of Bogotá with knowledgeable guides who share fascinating stories about the city\'s colonial past.',
        category: 'tour',
        cityId: bogota.id,
        providerName: 'Bogotá Tours Co',
        providerContact: 'tours@example.com',
        schedule: 'Daily at 10am and 2pm',
        price: 80000,
        currency: 'COP',
        duration: '3 hours',
        capacity: 15,
        isFree: false,
        address: 'Plaza de Bolívar, Bogotá',
        lat: 4.5981,
        lng: -74.0776,
        imageUrl: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?w=800',
      },
    }),
    prisma.activity.create({
      data: {
        title: 'Morning Yoga Session',
        description: 'Relaxing yoga session for all levels in a beautiful outdoor setting. Start your day with mindfulness and movement.',
        category: 'wellness',
        cityId: bogota.id,
        providerName: 'Zen Yoga Studio',
        providerContact: 'yoga@example.com',
        schedule: 'Every Monday, Wednesday, Friday 7am',
        price: 35000,
        currency: 'COP',
        duration: '1.5 hours',
        capacity: 10,
        isFree: false,
        address: 'Parque de la 93, Bogotá',
        lat: 4.6761,
        lng: -74.0509,
        imageUrl: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800',
      },
    }),
    prisma.activity.create({
      data: {
        title: 'Street Art Tour',
        description: 'Discover Bogotá\'s vibrant street art scene with a local artist guide. Visit the best murals in La Candelaria.',
        category: 'tour',
        cityId: bogota.id,
        providerName: 'Street Art Bogotá',
        providerContact: 'art@example.com',
        schedule: 'Tuesday, Thursday, Saturday 9am',
        price: 60000,
        currency: 'COP',
        duration: '2.5 hours',
        capacity: 12,
        isFree: false,
        address: 'La Candelaria, Bogotá',
        lat: 4.5953,
        lng: -74.0746,
        imageUrl: 'https://images.unsplash.com/photo-1561214115-f2f134cc4912?w=800',
      },
    }),
    prisma.activity.create({
      data: {
        title: 'Cooking Class: Colombian Cuisine',
        description: 'Learn to cook traditional Colombian dishes with a local chef. Includes market visit and hands-on cooking.',
        category: 'class',
        cityId: bogota.id,
        providerName: 'Sabores Colombianos',
        providerContact: 'cooking@example.com',
        schedule: 'Every Saturday 10am',
        price: 120000,
        currency: 'COP',
        duration: '4 hours',
        capacity: 8,
        isFree: false,
        address: 'Zona G, Bogotá',
        lat: 4.6567,
        lng: -74.0598,
        imageUrl: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=800',
      },
    }),
    prisma.activity.create({
      data: {
        title: 'Free Community Dance Night',
        description: 'Join us for a free community dance night featuring salsa, bachata, and merengue. All levels welcome!',
        category: 'entertainment',
        cityId: bogota.id,
        providerName: 'Bogotá Dance Community',
        providerContact: 'community@example.com',
        schedule: 'Every Friday 8pm',
        price: 0,
        currency: 'COP',
        duration: '3 hours',
        capacity: 100,
        isFree: true,
        address: 'Parque Simón Bolívar, Bogotá',
        lat: 4.6588,
        lng: -74.0965,
        imageUrl: 'https://images.unsplash.com/photo-1504609813442-a8924e83f76e?w=800',
      },
    }),
  ]);

  console.log(`✅ Created ${activities.length} activities`);

  console.log(`✅ Created ${places.length} places`);

  // Create reviews for places
  const user1Password = await hashPassword('password123');
  const user2Password = await hashPassword('password123');
  
  const users = await Promise.all([
    prisma.user.create({
      data: {
        email: 'maria@example.com',
        name: 'María García',
        password: user1Password,
        role: 'user',
      },
    }),
    prisma.user.create({
      data: {
        email: 'carlos@example.com',
        name: 'Carlos Rodríguez',
        password: user2Password,
        role: 'user',
      },
    }),
  ]);

  const reviews = await Promise.all([
    prisma.review.create({
      data: {
        rating: 5,
        comment: 'Best coffee in Zona G! The atmosphere is perfect for working.',
        userId: users[0].id,
        placeId: places[0].id,
      },
    }),
    prisma.review.create({
      data: {
        rating: 5,
        comment: 'The rooftop terrace is amazing! Best margaritas in Bogotá.',
        userId: users[1].id,
        placeId: places[1].id,
      },
    }),
  ]);

  console.log(`✅ Created ${reviews.length} reviews`);
  console.log('🎉 Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
