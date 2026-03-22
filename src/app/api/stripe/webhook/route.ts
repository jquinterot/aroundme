import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { prisma } from '@/lib/prisma';
import { createNotification } from '@/lib/notifications';
import Stripe from 'stripe';

export async function POST(request: NextRequest) {
  const body = await request.text();
  const sig = request.headers.get('stripe-signature');
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!sig || !webhookSecret) {
    return NextResponse.json(
      { success: false, error: 'Missing signature or webhook secret' },
      { status: 400 }
    );
  }

    let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
  } catch (err) {
    const error = err as Error;
    console.error('Webhook signature verification failed:', error.message);
    return NextResponse.json(
      { success: false, error: 'Invalid signature' },
      { status: 400 }
    );
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        const orderId = session.metadata?.orderId;

        if (orderId) {
          const order = await prisma.order.update({
            where: { id: orderId },
            data: {
              status: 'completed',
              stripePaymentId: session.payment_intent as string,
            },
            include: {
              items: {
                include: { ticketType: { include: { event: true } } },
              },
            },
          });

          for (const item of order.items) {
            await prisma.ticketType.update({
              where: { id: item.ticketTypeId },
              data: { sold: { increment: item.quantity } },
            });

            if (item.ticketType.event.userId) {
              await createNotification({
                userId: item.ticketType.event.userId,
                type: 'ticket_purchase',
                title: 'Ticket Sold!',
                message: `${item.quantity}x ${item.ticketType.name} tickets sold for "${item.ticketType.event.title}"`,
                link: `/dashboard/tickets`,
              });
            }
          }

          await createNotification({
            userId: order.userId,
            type: 'ticket_purchase',
            title: 'Purchase Confirmed!',
            message: `Your tickets for "${order.items[0]?.ticketType.event.title}" are confirmed!`,
            link: `/dashboard/tickets/${order.id}`,
          });
        }
        break;
      }

      case 'checkout.session.expired': {
        const session = event.data.object as Stripe.Checkout.Session;
        const orderId = session.metadata?.orderId;

        if (orderId) {
          await prisma.order.update({
            where: { id: orderId },
            data: { status: 'cancelled' },
          });
        }
        break;
      }

      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        console.log('Payment failed:', paymentIntent.id);
        break;
      }
    }

    return NextResponse.json({ success: true, received: true });
  } catch (error) {
    console.error('Webhook handler error:', error);
    return NextResponse.json(
      { success: false, error: 'Webhook handler failed' },
      { status: 500 }
    );
  }
}
