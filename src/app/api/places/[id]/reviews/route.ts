import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import type { Review, User } from '@prisma/client';

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
    console.error('Error fetching reviews:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch reviews' }, { status: 500 });
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: placeId } = await params;

  try {
    const user = await getSession();
    
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'You must be logged in to leave a review' },
        { status: 401 }
      );
    }

    const { rating, comment } = await request.json();

    if (!rating || rating < 1 || rating > 5) {
      return NextResponse.json(
        { success: false, error: 'Rating must be between 1 and 5' },
        { status: 400 }
      );
    }

    const existingReview = await prisma.review.findFirst({
      where: { userId: user.id, placeId },
    });

    if (existingReview) {
      return NextResponse.json(
        { success: false, error: 'You have already reviewed this place' },
        { status: 400 }
      );
    }

    const review = await prisma.review.create({
      data: {
        rating,
        comment: comment || '',
        userId: user.id,
        placeId,
      },
    });

    const placeReviews = await prisma.review.findMany({
      where: { placeId },
      select: { rating: true },
    });

    const avgRating = placeReviews.reduce((sum, r) => sum + r.rating, 0) / placeReviews.length;

    await prisma.place.update({
      where: { id: placeId },
      data: {
        rating: Math.round(avgRating * 10) / 10,
        reviewCount: placeReviews.length,
      },
    });

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
    console.error('Error creating review:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create review' },
      { status: 500 }
    );
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
      return NextResponse.json(
        { success: false, error: 'You must be logged in' },
        { status: 401 }
      );
    }

    const { reviewId, rating, comment } = await request.json();

    if (!reviewId) {
      return NextResponse.json(
        { success: false, error: 'Review ID is required' },
        { status: 400 }
      );
    }

    if (!rating || rating < 1 || rating > 5) {
      return NextResponse.json(
        { success: false, error: 'Rating must be between 1 and 5' },
        { status: 400 }
      );
    }

    const existingReview = await prisma.review.findUnique({
      where: { id: reviewId },
    });

    if (!existingReview) {
      return NextResponse.json(
        { success: false, error: 'Review not found' },
        { status: 404 }
      );
    }

    if (existingReview.userId !== user.id) {
      return NextResponse.json(
        { success: false, error: 'You can only edit your own reviews' },
        { status: 403 }
      );
    }

    const review = await prisma.review.update({
      where: { id: reviewId },
      data: {
        rating,
        comment: comment || '',
      },
    });

    const placeReviews = await prisma.review.findMany({
      where: { placeId },
      select: { rating: true },
    });

    const avgRating = placeReviews.reduce((sum, r) => sum + r.rating, 0) / placeReviews.length;

    await prisma.place.update({
      where: { id: placeId },
      data: {
        rating: Math.round(avgRating * 10) / 10,
      },
    });

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
    console.error('Error updating review:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update review' },
      { status: 500 }
    );
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
      return NextResponse.json(
        { success: false, error: 'You must be logged in' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const reviewId = searchParams.get('reviewId');

    if (!reviewId) {
      return NextResponse.json(
        { success: false, error: 'Review ID is required' },
        { status: 400 }
      );
    }

    const existingReview = await prisma.review.findUnique({
      where: { id: reviewId },
    });

    if (!existingReview) {
      return NextResponse.json(
        { success: false, error: 'Review not found' },
        { status: 404 }
      );
    }

    if (existingReview.userId !== user.id) {
      return NextResponse.json(
        { success: false, error: 'You can only delete your own reviews' },
        { status: 403 }
      );
    }

    await prisma.review.delete({
      where: { id: reviewId },
    });

    const placeReviews = await prisma.review.findMany({
      where: { placeId },
      select: { rating: true },
    });

    const avgRating = placeReviews.length > 0
      ? placeReviews.reduce((sum, r) => sum + r.rating, 0) / placeReviews.length
      : 0;

    await prisma.place.update({
      where: { id: placeId },
      data: {
        rating: Math.round(avgRating * 10) / 10,
        reviewCount: placeReviews.length,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting review:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete review' },
      { status: 500 }
    );
  }
}
