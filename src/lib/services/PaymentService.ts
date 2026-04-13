import { getStripe } from '@/lib/stripe';
import type { IPaymentService } from '@/types/interfaces';
import { prisma } from '@/lib/prisma';

export class PaymentService implements IPaymentService {
  async createCheckoutSession(params: {
    items: Array<{ ticketTypeId: string; quantity: number }>;
    email: string;
    name: string;
    userId: string;
  }): Promise<{ sessionId: string; url: string }> {
    const stripe = getStripe();
    
    const lineItems = [];
    let totalAmount = 0;

    for (const item of params.items) {
      const ticketType = await prisma.ticketType.findUnique({
        where: { id: item.ticketTypeId },
        include: { event: true },
      });

      if (!ticketType) {
        throw new Error(`Ticket type ${item.ticketTypeId} not found`);
      }

      lineItems.push({
        price_data: {
          currency: 'cop',
          product_data: {
            name: `${ticketType.event.title} - ${ticketType.name}`,
          },
          unit_amount: Math.round(ticketType.price * 100),
        },
        quantity: item.quantity,
      });

      totalAmount += ticketType.price * item.quantity;
    }

    const platformFee = Math.round(totalAmount * 0.10);

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/checkout/cancel`,
      customer_email: params.email,
      metadata: {
        userId: params.userId,
      },
      payment_intent_data: {
        application_fee_amount: platformFee * 100,
      },
    });

    return {
      sessionId: session.id,
      url: session.url || '',
    };
  }

  async handleWebhook(payload: unknown): Promise<void> {
    const sig = process.env.STRIPE_WEBHOOK_SECRET;
    
    if (!sig) {
      throw new Error('STRIPE_WEBHOOK_SECRET not configured');
    }

    // Webhook handling logic would go here
    console.log('Webhook received:', payload);
  }
}
