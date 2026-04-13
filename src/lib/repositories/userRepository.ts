import { prisma } from '@/lib/prisma';
import type { User } from '@/types';

export interface CreateUserData {
  email: string;
  name: string;
  password: string;
  role?: 'admin' | 'organizer' | 'user';
  cityId?: string;
}

export async function createUser(data: CreateUserData) {
  return prisma.user.create({
    data: {
      email: data.email.toLowerCase(),
      name: data.name.trim(),
      password: data.password,
      role: data.role || 'user',
      cityId: data.cityId,
      isVerified: false,
    },
  });
}

export async function getUserById(id: string) {
  return prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      cityId: true,
      isVerified: true,
      avatarUrl: true,
      bio: true,
      website: true,
      instagram: true,
      followerCount: true,
      followingCount: true,
      eventCount: true,
      createdAt: true,
      city: {
        select: { id: true, name: true, slug: true },
      },
    },
  });
}

export async function getUserByEmail(email: string) {
  return prisma.user.findUnique({
    where: { email: email.toLowerCase() },
  });
}

export async function updateUser(id: string, data: Partial<User>) {
  const updateData: Record<string, unknown> = {};
  
  if (data.name !== undefined) updateData.name = data.name;
  if (data.bio !== undefined) updateData.bio = data.bio;
  if (data.avatarUrl !== undefined) updateData.avatarUrl = data.avatarUrl;
  if (data.website !== undefined) updateData.website = data.website;
  if (data.instagram !== undefined) updateData.instagram = data.instagram;
  if (data.cityId !== undefined) updateData.cityId = data.cityId;

  return prisma.user.update({
    where: { id },
    data: updateData,
    select: {
      id: true,
      email: true,
      name: true,
      avatarUrl: true,
      bio: true,
      website: true,
      instagram: true,
      cityId: true,
    },
  });
}

export async function verifyUser(id: string) {
  return prisma.user.update({
    where: { id },
    data: { isVerified: true },
  });
}

export async function updateUserPassword(id: string, hashedPassword: string) {
  return prisma.user.update({
    where: { id },
    data: { password: hashedPassword },
  });
}

export async function incrementUserStat(id: string, field: 'eventCount' | 'followerCount' | 'followingCount') {
  return prisma.user.update({
    where: { id },
    data: { [field]: { increment: 1 } },
  });
}

export async function decrementUserStat(id: string, field: 'eventCount' | 'followerCount' | 'followingCount') {
  return prisma.user.update({
    where: { id },
    data: { [field]: { decrement: 1 } },
  });
}
