import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { getStripe, calculateFees, PLATFORM_FEE_PERCENT } from '@/lib/stripe';
import { handleApiError, errorResponse } from '@/lib/api-utils';
import Stripe from 'stripe';

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    
    if (!session) {
      return errorResponse('Please log in to purchase tickets.', 401, 'UNAUTHORIZED');
    }

    const body = await request.json();
    const { items, email, name } = body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return errorResponse('Your cart is empty. Please add tickets before checkout.', 400, 'EMPTY_CART');
    }

    if (!email || !name) {
      return errorResponse('Please provide your email and name for the ticket purchase.', 400, 'MISSING_INFO');
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return errorResponse('Please provide a valid email address.', 400, 'INVALID_EMAIL');
    }

    const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = [];
    let totalAmount = 0;
    const orderItems: { ticketTypeId: string; quantity: number; priceAtTime: number }[] = [];
    let organizerUserId: string | null = null;
    let organizerStripeAccountId: string | null = null;
    let organizerPlatformFee = PLATFORM_FEE_PERCENT;

    for (const item of items) {
      if (!item.ticketTypeId || !item.quantity || item.quantity < 1) {
        return errorResponse('Invalid cart item. Please review your ticket selection.', 400, 'INVALID_ITEM');
      }

      const ticketType = await prisma.ticketType.findUnique({
        where: { id: item.ticketTypeId },
        include: { event: { include: { user: true } } },
      });

      if (!ticketType) {
        return errorResponse(`This ticket type no longer exists. Please select a different ticket.`, 404, 'TICKET_NOT_FOUND');
      }

      if (!ticketType.isActive) {
        return errorResponse(`"${ticketType.name}" tickets are no longer available. Please choose another ticket type.`, 400, 'TICKET_UNAVAILABLE');
      }

      if (ticketType.quantity - ticketType.sold < item.quantity) {
        const available = ticketType.quantity - ticketType.sold;
        return errorResponse(
          `Only ${available} "${ticketType.name}" tickets available. You requested ${item.quantity}.`,
          400,
          'INSUFFICIENT_TICKETS'
        );
      }

      if (ticketType.saleStart && new Date() < ticketType.saleStart) {
        return errorResponse(
          `Sales for "${ticketType.name}" start on ${ticketType.saleStart.toLocaleDateString()}. Please check back later.`,
          400,
          'SALE_NOT_STARTED'
        );
      }

      if (ticketType.saleEnd && new Date() > ticketType.saleEnd) {
        return errorResponse(`Sales for "${ticketType.name}" have ended. This event is no longer selling tickets.`, 400, 'SALE_ENDED');
      }

      if (item.quantity > ticketType.maxPerUser) {
        return errorResponse(
          `Maximum ${ticketType.maxPerUser} "${ticketType.name}" tickets per order. Please adjust your quantity.`,
          400,
          'MAX_TICKETS_EXCEEDED'
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

    if (totalAmount <= 0) {
      return errorResponse('Invalid order total. Please review your ticket selection.', 400, 'INVALID_TOTAL');
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
      message: 'Redirecting to secure payment...',
    });
  } catch (error) {
    return handleApiError(error, 'POST /api/stripe/checkout');
  }
}
