import { prisma } from '@/lib/prisma';
import type { Place, PlaceCategory } from '@/types';

export interface CreatePlaceData {
  name: string;
  description: string;
  category: PlaceCategory;
  cityId: string;
  address: string;
  lat?: number;
  lng?: number;
  website?: string;
  instagram?: string;
  features?: string;
  imageUrl?: string;
  userId?: string;
}

export interface PlaceFilters {
  category?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export function calculateAverageRating(ratings: number[]): number {
  if (ratings.length === 0) return 0;
  const sum = ratings.reduce((acc, rating) => acc + rating, 0);
  return Math.round((sum / ratings.length) * 10) / 10;
}

export async function createPlace(data: CreatePlaceData) {
  return prisma.place.create({
    data: {
      name: data.name.trim(),
      description: data.description.trim(),
      category: data.category,
      cityId: data.cityId,
      address: data.address.trim(),
      lat: data.lat,
      lng: data.lng,
      website: data.website,
      instagram: data.instagram,
      features: data.features,
      imageUrl: data.imageUrl,
      ownerId: data.userId,
      isClaimed: !!data.userId,
      isVerified: false,
    },
  });
}

export async function getPlaceById(id: string) {
  return prisma.place.findUnique({
    where: { id },
    include: {
      city: true,
      reviews: {
        include: {
          user: {
            select: { id: true, name: true, avatarUrl: true },
          },
        },
        orderBy: { createdAt: 'desc' },
      },
    },
  });
}

export async function getPlacesByCity(cityId: string, filters?: PlaceFilters) {
  const where: Record<string, unknown> = {
    cityId,
  };

  if (filters?.category && filters.category !== 'all') {
    where.category = filters.category;
  }

  if (filters?.search) {
    where.OR = [
      { name: { contains: filters.search, mode: 'insensitive' } },
      { description: { contains: filters.search, mode: 'insensitive' } },
    ];
  }

  const page = filters?.page || 1;
  const limit = filters?.limit || 20;
  const skip = (page - 1) * limit;

  const [places, total] = await Promise.all([
    prisma.place.findMany({
      where,
      include: {
        city: true,
        _count: {
          select: { reviews: true },
        },
      },
      orderBy: { rating: 'desc' },
      take: limit,
      skip,
    }),
    prisma.place.count({ where }),
  ]);

  return {
    places,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
}

export async function updatePlace(id: string, data: Partial<Place>) {
  return prisma.place.update({
    where: { id },
    data,
  });
}

export async function claimPlace(placeId: string, userId: string) {
  return prisma.place.update({
    where: { id: placeId },
    data: {
      ownerId: userId,
      isClaimed: true,
    },
  });
}

export async function addReview(placeId: string, userId: string, rating: number, comment: string) {
  const review = await prisma.review.create({
    data: {
      placeId,
      userId,
      rating,
      comment,
    },
  });

  const allReviews = await prisma.review.findMany({
    where: { placeId },
    select: { rating: true },
  });

  const avgRating = calculateAverageRating(allReviews.map((r) => r.rating));

  await prisma.place.update({
    where: { id: placeId },
    data: {
      rating: avgRating,
      reviewCount: allReviews.length,
    },
  });

  return review;
}
