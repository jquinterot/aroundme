import type { IEmailService } from '@/types/interfaces';

export class EmailService implements IEmailService {
  async send(params: {
    template: string;
    userId: string;
    data: Record<string, string>;
  }): Promise<boolean> {
    const { sendEmail } = await import('@/lib/email');
    return sendEmail({
      template: params.template as 'rsvp_confirmation' | 'event_reminder' | 'weekly_digest' | 'new_follower' | 'event_published' | 'ticket_confirmation' | 'waitlist_available' | 'event_update',
      userId: params.userId,
      data: params.data,
    });
  }
}
