import { prisma } from '@/lib/prisma';

interface RecommendationInput {
  userId: string;
  cityId?: string;
  limit?: number;
  categories?: string[];
}

interface RecommendationResult {
  id: string;
  eventId: string;
  title: string;
  description: string;
  category: string;
  dateStart: Date;
  venueName: string;
  venueAddress: string;
  imageUrl: string | null;
  isFree: boolean;
  priceMin: number | null;
  cityName: string;
  score: number;
  reason: string;
}

export async function getRecommendations(input: RecommendationInput): Promise<RecommendationResult[]> {
  const { userId, cityId, limit = 10, categories } = input;

  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      rsvps: {
        include: { event: true },
        take: 20,
        orderBy: { createdAt: 'desc' },
      },
      saves: {
        include: { event: true },
        take: 20,
        orderBy: { createdAt: 'desc' },
      },
      following: {
        include: { following: { include: { events: { take: 5 } } } },
      },
    },
  });

  if (!user) return [];

  const userCategories = new Set<string>();
  const userOrganizerIds = new Set<string>();

  user.rsvps.forEach(rsvp => {
    userCategories.add(rsvp.event.category);
  });
  user.saves.forEach(save => {
    userCategories.add(save.event.category);
  });
  user.following.forEach(f => {
    if (f.following.events.length > 0) {
      userOrganizerIds.add(f.following.id);
    }
  });

  const now = new Date();
  const eventWhere: any = {
    status: 'approved',
    dateStart: { gte: now },
  };

  if (cityId) {
    eventWhere.cityId = cityId;
  }

  if (categories && categories.length > 0) {
    eventWhere.category = { in: categories };
  }

  const excludeEventIds = [
    ...user.rsvps.map(r => r.eventId),
    ...user.saves.map(s => s.eventId),
  ];

  if (excludeEventIds.length > 0) {
    eventWhere.id = { notIn: excludeEventIds };
  }

  const events = await prisma.event.findMany({
    where: eventWhere,
    include: {
      city: { select: { name: true } },
      user: { select: { id: true, name: true } },
      _count: {
        select: { rsvps: true, saves: true },
      },
    },
    take: 100,
    orderBy: { dateStart: 'asc' },
  });

  const recommendations: RecommendationResult[] = events.map(event => {
    let score = 0;
    let reason = '';

    if (userCategories.has(event.category)) {
      score += 30;
      reason = 'similar_interests';
    }

    if (event._count.rsvps > 10) {
      score += 20;
      if (!reason) reason = 'popular';
    }

    if (event._count.saves > 5) {
      score += 15;
      if (!reason) reason = 'trending';
    }

    if (event.isFeatured) {
      score += 10;
      if (!reason) reason = 'featured';
    }

    if (userOrganizerIds.has(event.userId || '')) {
      score += 25;
      reason = 'followed_organizer';
    }

    const daysUntilEvent = Math.ceil((new Date(event.dateStart).getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    if (daysUntilEvent <= 7) {
      score += 10;
      if (!reason) reason = 'happening_soon';
    }

    if (event.isFree) {
      score += 5;
      if (!reason) reason = 'free_event';
    }

    if (event.cityId === user.cityId) {
      score += 15;
      if (!reason) reason = 'nearby';
    }

    return {
      id: event.id,
      eventId: event.id,
      title: event.title,
      description: event.description,
      category: event.category,
      dateStart: event.dateStart,
      venueName: event.venueName,
      venueAddress: event.venueAddress,
      imageUrl: event.imageUrl,
      isFree: event.isFree,
      priceMin: event.priceMin,
      cityName: event.city.name,
      score,
      reason,
    };
  });

  recommendations.sort((a, b) => b.score - a.score);

  return recommendations.slice(0, limit);
}

export async function generateRecommendationsForUser(userId: string): Promise<void> {
  const recommendations = await getRecommendations({ userId, limit: 50 });

  await prisma.recommendation.deleteMany({
    where: { userId },
  });

  await prisma.recommendation.createMany({
    data: recommendations.map(rec => ({
      userId,
      eventId: rec.eventId,
      score: rec.score,
      reason: rec.reason,
    })),
  });
}

export async function recordRecommendationInteraction(
  userId: string,
  eventId: string,
  action: 'view' | 'click'
): Promise<void> {
  const recommendation = await prisma.recommendation.findFirst({
    where: { userId, eventId },
  });

  if (recommendation) {
    await prisma.recommendation.update({
      where: { id: recommendation.id },
      data: {
        isClicked: action === 'click' ? true : recommendation.isClicked,
        isViewed: true,
      },
    });
  }
}

export async function getPersonalizedFeed(
  userId: string,
  citySlug: string,
  page: number = 1,
  limit: number = 20
) {
  const city = await prisma.city.findUnique({ where: { slug: citySlug } });
  if (!city) return { events: [], hasMore: false };

  const recommendations = await getRecommendations({
    userId,
    cityId: city.id,
    limit: limit * page,
  });

  const start = (page - 1) * limit;
  const events = recommendations.slice(start, start + limit);

  return {
    events,
    hasMore: recommendations.length > start + limit,
  };
}
