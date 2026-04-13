import { prisma } from '@/lib/prisma';
import type { Activity, City } from '@/generated/prisma/client';
import type { Experience } from '@/types';

type ActivityWithCity = Activity & { city: City };

export class ExperienceRepository {
  async findById(id: string): Promise<Experience | null> {
    const activity = await prisma.activity.findUnique({
      where: { id },
      include: { city: true },
    });
    
    if (!activity) return null;
    
    return this.mapToExperience(activity);
  }

  async findByCity(cityId: string): Promise<Experience[]> {
    const activities = await prisma.activity.findMany({
      where: { cityId },
      include: { city: true },
    });
    
    return activities.map((activity) => this.mapToExperience(activity));
  }

  async create(data: unknown): Promise<Experience> {
    const activity = await prisma.activity.create({
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      data: data as any,
    });
    
    const activityWithCity = await prisma.activity.findUnique({
      where: { id: activity.id },
      include: { city: true },
    });
    
    return this.mapToExperience(activityWithCity!);
  }

  private mapToExperience(activity: ActivityWithCity): Experience {
    return {
      id: activity.id,
      title: activity.title,
      description: activity.description,
      category: activity.category,
      subcategory: activity.subcategory ?? null,
      city: activity.city,
      providerName: activity.providerName,
      providerContact: activity.providerContact ?? null,
      schedule: activity.schedule,
      scheduleDays: activity.scheduleDays ? JSON.parse(activity.scheduleDays) : null,
      scheduleTime: activity.scheduleTime ?? null,
      duration: activity.duration ?? null,
      capacity: activity.capacity ?? null,
      price: activity.price,
      currency: activity.currency,
      isFree: activity.isFree,
      image: activity.imageUrl ?? null,
      includes: activity.includes ? JSON.parse(activity.includes) : [],
      skillLevel: activity.skillLevel ?? null,
      status: activity.status,
      viewCount: activity.viewCount,
      bookingCount: activity.bookingCount,
      commission: 0.08,
      address: activity.address ?? null,
      lat: activity.lat ?? null,
      lng: activity.lng ?? null,
    };
  }
}
