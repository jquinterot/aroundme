import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { getStripe, calculateFees, PLATFORM_FEE_PERCENT } from '@/lib/stripe';
import Stripe from 'stripe';

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    
    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Please login to purchase tickets' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { items, email, name } = body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { success: false, error: 'No items in cart' },
        { status: 400 }
      );
    }

    if (!email || !name) {
      return NextResponse.json(
        { success: false, error: 'Email and name are required' },
        { status: 400 }
      );
    }

    const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = [];
    let totalAmount = 0;
    const orderItems: { ticketTypeId: string; quantity: number; priceAtTime: number }[] = [];
    let organizerUserId: string | null = null;
    let organizerStripeAccountId: string | null = null;
    let organizerPlatformFee = PLATFORM_FEE_PERCENT;

    for (const item of items) {
      const ticketType = await prisma.ticketType.findUnique({
        where: { id: item.ticketTypeId },
        include: { event: { include: { user: true } } },
      });

      if (!ticketType) {
        return NextResponse.json(
          { success: false, error: `Ticket type not found: ${item.ticketTypeId}` },
          { status: 404 }
        );
      }

      if (!ticketType.isActive) {
        return NextResponse.json(
          { success: false, error: `Ticket type "${ticketType.name}" is no longer available` },
          { status: 400 }
        );
      }

      if (ticketType.quantity - ticketType.sold < item.quantity) {
        return NextResponse.json(
          { success: false, error: `Not enough tickets for "${ticketType.name}". Only ${ticketType.quantity - ticketType.sold} left.` },
          { status: 400 }
        );
      }

      if (ticketType.saleStart && new Date() < ticketType.saleStart) {
        return NextResponse.json(
          { success: false, error: `Sales for "${ticketType.name}" have not started yet` },
          { status: 400 }
        );
      }

      if (ticketType.saleEnd && new Date() > ticketType.saleEnd) {
        return NextResponse.json(
          { success: false, error: `Sales for "${ticketType.name}" have ended` },
          { status: 400 }
        );
      }

      if (item.quantity > ticketType.maxPerUser) {
        return NextResponse.json(
          { success: false, error: `Maximum ${ticketType.maxPerUser} tickets per person for "${ticketType.name}"` },
          { status: 400 }
        );
      }

      if (!organizerUserId && ticketType.event.userId) {
        organizerUserId = ticketType.event.userId;
        
        const organizer = await prisma.user.findUnique({
          where: { id: organizerUserId },
          select: { stripeAccountId: true, stripeOnboardingComplete: true, platformFeePercent: true },
        });
        
        if (organizer?.stripeAccountId && organizer?.stripeOnboardingComplete) {
          organizerStripeAccountId = organizer.stripeAccountId;
          organizerPlatformFee = organizer.platformFeePercent || PLATFORM_FEE_PERCENT;
        }
      }

      const priceInCents = Math.round(ticketType.price * 100);
      lineItems.push({
        price_data: {
          currency: 'cop',
          product_data: {
            name: `${ticketType.event.title} - ${ticketType.name}`,
            description: ticketType.description || undefined,
          },
          unit_amount: priceInCents,
        },
        quantity: item.quantity,
      });

      totalAmount += ticketType.price * item.quantity;
      orderItems.push({
        ticketTypeId: item.ticketTypeId,
        quantity: item.quantity,
        priceAtTime: ticketType.price,
      });
    }

    const { platformFee, payoutAmount } = calculateFees(totalAmount);

    const order = await prisma.order.create({
      data: {
        userId: session.id,
        status: 'pending',
        total: totalAmount,
        currency: 'COP',
        email,
        name,
        platformFee,
        payoutAmount,
        payoutStatus: organizerStripeAccountId ? 'pending' : 'no_account',
        items: {
          create: orderItems,
        },
      },
    });

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const stripeInstance = getStripe();
    
    const checkoutParams: Stripe.Checkout.SessionCreateParams = {
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${appUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}&order_id=${order.id}`,
      cancel_url: `${appUrl}/checkout/cancel?order_id=${order.id}`,
      customer_email: email,
      metadata: {
        orderId: order.id,
        organizerUserId: organizerUserId || '',
        organizerStripeAccountId: organizerStripeAccountId || '',
        payoutAmount: Math.round(payoutAmount * 100).toString(),
        platformFee: Math.round(platformFee * 100).toString(),
      },
      payment_intent_data: {
        application_fee_amount: Math.round(platformFee * 100),
        transfer_data: organizerStripeAccountId ? {
          destination: organizerStripeAccountId,
        } : undefined,
      },
    };

    const stripeSession = await stripeInstance.checkout.sessions.create(checkoutParams);

    await prisma.order.update({
      where: { id: order.id },
      data: { stripeSessionId: stripeSession.id },
    });

    return NextResponse.json({
      success: true,
      data: {
        sessionId: stripeSession.id,
        url: stripeSession.url,
        breakdown: {
          total: totalAmount,
          platformFee,
          payoutAmount,
          platformFeePercent: organizerPlatformFee * 100,
        },
      },
    });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}
