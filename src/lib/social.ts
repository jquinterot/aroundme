import { prisma } from '@/lib/prisma';
import { createNotification } from './notifications';

export async function followUser(followerId: string, followingId: string) {
  if (followerId === followingId) {
    throw new Error('No puedes seguirte a ti mismo');
  }

  const existing = await prisma.follow.findUnique({
    where: {
      followerId_followingId: {
        followerId,
        followingId,
      },
    },
  });

  if (existing) {
    throw new Error('Ya sigues a este usuario');
  }

  const follow = await prisma.follow.create({
    data: {
      followerId,
      followingId,
    },
    include: {
      following: {
        select: { id: true, name: true },
      },
    },
  });

  await prisma.user.update({
    where: { id: followerId },
    data: { followingCount: { increment: 1 } },
  });

  await prisma.user.update({
    where: { id: followingId },
    data: { followerCount: { increment: 1 } },
  });

  await createActivity({
    userId: followerId,
    type: 'follow',
    targetUserId: followingId,
  });

  await createNotification({
    userId: followingId,
    type: 'new_follower',
    title: 'Nuevo Seguidor',
    message: `${follow.following.name} comenzó a seguirte`,
    link: `/profile/${followerId}`,
  });

  return follow;
}

export async function unfollowUser(followerId: string, followingId: string) {
  const follow = await prisma.follow.findUnique({
    where: {
      followerId_followingId: {
        followerId,
        followingId,
      },
    },
  });

  if (!follow) {
    throw new Error('No sigues a este usuario');
  }

  await prisma.follow.delete({
    where: { id: follow.id },
  });

  await prisma.user.update({
    where: { id: followerId },
    data: { followingCount: { decrement: 1 } },
  });

  await prisma.user.update({
    where: { id: followingId },
    data: { followerCount: { decrement: 1 } },
  });

  return { success: true };
}

export async function isFollowing(followerId: string, followingId: string): Promise<boolean> {
  const follow = await prisma.follow.findUnique({
    where: {
      followerId_followingId: {
        followerId,
        followingId,
      },
    },
  });
  return !!follow;
}

export async function getFollowers(userId: string, page: number = 1, limit: number = 20) {
  const [followers, total] = await Promise.all([
    prisma.follow.findMany({
      where: { followingId: userId },
      include: {
        follower: {
          select: {
            id: true,
            name: true,
            avatarUrl: true,
            isVerified: true,
            followerCount: true,
            eventCount: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
      skip: (page - 1) * limit,
    }),
    prisma.follow.count({ where: { followingId: userId } }),
  ]);

  return {
    users: followers.map(f => f.follower),
    total,
    page,
    pages: Math.ceil(total / limit),
  };
}

export async function getFollowing(userId: string, page: number = 1, limit: number = 20) {
  const [following, total] = await Promise.all([
    prisma.follow.findMany({
      where: { followerId: userId },
      include: {
        following: {
          select: {
            id: true,
            name: true,
            avatarUrl: true,
            isVerified: true,
            followerCount: true,
            eventCount: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
      skip: (page - 1) * limit,
    }),
    prisma.follow.count({ where: { followerId: userId } }),
  ]);

  return {
    users: following.map(f => f.following),
    total,
    page,
    pages: Math.ceil(total / limit),
  };
}

export async function createActivity(data: {
  userId: string;
  type: string;
  eventId?: string;
  placeId?: string;
  targetUserId?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  metadata?: Record<string, any>;
}) {
  const activity = await prisma.activity.create({
    data: {
      userId: data.userId,
      type: data.type,
      eventId: data.eventId,
      placeId: data.placeId,
      targetUserId: data.targetUserId,
      metadata: data.metadata ? JSON.stringify(data.metadata) : null,
    },
  });

  return activity;
}

export async function getActivityFeed(
  userId?: string,
  followingOnly: boolean = false,
  citySlug?: string,
  page: number = 1,
  limit: number = 20
) {
  const where: Record<string, unknown> = {};

  if (followingOnly && userId) {
    const following = await prisma.follow.findMany({
      where: { followerId: userId },
      select: { followingId: true },
    });
    where.userId = { in: following.map(f => f.followingId) };
  }

  if (citySlug) {
    const city = await prisma.city.findUnique({ where: { slug: citySlug } });
    if (city) {
      where.event = { cityId: city.id };
    }
  }

  const [activities, total] = await Promise.all([
    prisma.activity.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            avatarUrl: true,
            isVerified: true,
          },
        },
        event: {
          select: {
            id: true,
            title: true,
            imageUrl: true,
            dateStart: true,
            venueName: true,
            city: { select: { name: true } },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
      skip: (page - 1) * limit,
    }),
    prisma.activity.count({ where }),
  ]);

  return {
    activities: activities.map(a => ({
      ...a,
      metadata: a.metadata ? JSON.parse(a.metadata) : null,
    })),
    total,
    page,
    pages: Math.ceil(total / limit),
  };
}

export async function getUserProfile(userId: string, viewerId?: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      avatarUrl: true,
      bio: true,
      website: true,
      instagram: true,
      role: true,
      isVerified: true,
      followerCount: true,
      followingCount: true,
      eventCount: true,
      createdAt: true,
      city: {
        select: { name: true, slug: true },
      },
      events: {
        where: { status: 'approved' },
        orderBy: { dateStart: 'desc' },
        take: 10,
        select: {
          id: true,
          title: true,
          imageUrl: true,
          dateStart: true,
          status: true,
        },
      },
      reviews: {
        orderBy: { createdAt: 'desc' },
        take: 5,
        include: {
          place: {
            select: { id: true, name: true },
          },
        },
      },
    },
  });

  if (!user) return null;

  let isFollowing = false;
  let isOwnProfile = false;

  if (viewerId) {
    isOwnProfile = viewerId === userId;
    if (!isOwnProfile) {
      const follow = await prisma.follow.findUnique({
        where: {
          followerId_followingId: {
            followerId: viewerId,
            followingId: userId,
          },
        },
      });
      isFollowing = !!follow;
    }
  }

  return {
    ...user,
    isFollowing,
    isOwnProfile,
  };
}

export async function updateUserProfile(
  userId: string,
  data: {
    name?: string;
    bio?: string;
    avatarUrl?: string;
    website?: string;
    instagram?: string;
    cityId?: string;
  }
) {
  const user = await prisma.user.update({
    where: { id: userId },
    data: {
      name: data.name,
      bio: data.bio,
      avatarUrl: data.avatarUrl,
      website: data.website,
      instagram: data.instagram,
      cityId: data.cityId,
    },
    select: {
      id: true,
      name: true,
      avatarUrl: true,
      bio: true,
      website: true,
      instagram: true,
      cityId: true,
    },
  });

  return user;
}
