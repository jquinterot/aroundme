import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import type { Review, User } from '@prisma/client';
import { handleApiError, errorResponse } from '@/lib/api-utils';
import { calculateAverageRating } from '@/lib/repositories/placeRepository';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const reviews = await prisma.review.findMany({
      where: { placeId: id },
      include: { user: { select: { id: true, name: true } } },
      orderBy: { createdAt: 'desc' },
    });

    const formattedReviews = reviews.map((review: Review & { user: Pick<User, 'name'> }) => ({
      id: review.id,
      userId: review.userId,
      userName: review.user.name,
      placeId: review.placeId,
      rating: review.rating,
      comment: review.comment,
      createdAt: review.createdAt.toISOString(),
    }));

    return NextResponse.json({ success: true, data: formattedReviews });
  } catch (error) {
    return handleApiError(error, 'GET /api/places/[id]/reviews');
  }
}

async function updatePlaceRating(placeId: string, reviewCount?: number) {
  const placeReviews = await prisma.review.findMany({
    where: { placeId },
    select: { rating: true },
  });

  const avgRating = calculateAverageRating(placeReviews.map((r) => r.rating));

  await prisma.place.update({
    where: { id: placeId },
    data: {
      rating: avgRating,
      ...(reviewCount !== undefined && { reviewCount }),
    },
  });
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: placeId } = await params;

  try {
    const user = await getSession();
    
    if (!user) {
      return errorResponse('You must be logged in to leave a review', 401, 'UNAUTHORIZED');
    }

    const { rating, comment } = await request.json();

    if (!rating || rating < 1 || rating > 5) {
      return errorResponse('Rating must be a number between 1 and 5', 400, 'INVALID_RATING');
    }

    if (comment !== undefined && typeof comment !== 'string') {
      return errorResponse('Comment must be a string', 400, 'INVALID_COMMENT');
    }

    const existingReview = await prisma.review.findFirst({
      where: { userId: user.id, placeId },
    });

    if (existingReview) {
      return errorResponse('You have already reviewed this place', 400, 'REVIEW_EXISTS');
    }

    const review = await prisma.review.create({
      data: {
        rating,
        comment: comment || '',
        userId: user.id,
        placeId,
      },
    });

    await updatePlaceRating(placeId);

    return NextResponse.json({
      success: true,
      data: {
        id: review.id,
        rating: review.rating,
        comment: review.comment,
        userName: user.name,
        createdAt: review.createdAt.toISOString(),
      },
    });
  } catch (error) {
    return handleApiError(error, 'POST /api/places/[id]/reviews');
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: placeId } = await params;

  try {
    const user = await getSession();
    
    if (!user) {
      return errorResponse('You must be logged in to update a review', 401, 'UNAUTHORIZED');
    }

    const { reviewId, rating, comment } = await request.json();

    if (!reviewId) {
      return errorResponse('Review ID is required', 400, 'MISSING_REVIEW_ID');
    }

    if (typeof reviewId !== 'string') {
      return errorResponse('Review ID must be a string', 400, 'INVALID_REVIEW_ID');
    }

    if (!rating || rating < 1 || rating > 5) {
      return errorResponse('Rating must be a number between 1 and 5', 400, 'INVALID_RATING');
    }

    if (comment !== undefined && typeof comment !== 'string') {
      return errorResponse('Comment must be a string', 400, 'INVALID_COMMENT');
    }

    const existingReview = await prisma.review.findUnique({
      where: { id: reviewId },
    });

    if (!existingReview) {
      return errorResponse('Review not found', 404, 'REVIEW_NOT_FOUND');
    }

    if (existingReview.userId !== user.id) {
      return errorResponse('You can only edit your own reviews', 403, 'FORBIDDEN');
    }

    const review = await prisma.review.update({
      where: { id: reviewId },
      data: {
        rating,
        comment: comment || '',
      },
    });

    await updatePlaceRating(placeId);

    return NextResponse.json({
      success: true,
      data: {
        id: review.id,
        rating: review.rating,
        comment: review.comment,
        createdAt: review.updatedAt.toISOString(),
      },
    });
  } catch (error) {
    return handleApiError(error, 'PATCH /api/places/[id]/reviews');
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: placeId } = await params;

  try {
    const user = await getSession();
    
    if (!user) {
      return errorResponse('You must be logged in to delete a review', 401, 'UNAUTHORIZED');
    }

    const { searchParams } = new URL(request.url);
    const reviewId = searchParams.get('reviewId');

    if (!reviewId) {
      return errorResponse('Review ID is required', 400, 'MISSING_REVIEW_ID');
    }

    if (typeof reviewId !== 'string') {
      return errorResponse('Review ID must be a string', 400, 'INVALID_REVIEW_ID');
    }

    const existingReview = await prisma.review.findUnique({
      where: { id: reviewId },
    });

    if (!existingReview) {
      return errorResponse('Review not found', 404, 'REVIEW_NOT_FOUND');
    }

    if (existingReview.userId !== user.id) {
      return errorResponse('You can only delete your own reviews', 403, 'FORBIDDEN');
    }

    await prisma.review.delete({
      where: { id: reviewId },
    });

    await updatePlaceRating(placeId);

    return NextResponse.json({ success: true });
  } catch (error) {
    return handleApiError(error, 'DELETE /api/places/[id]/reviews');
  }
}
