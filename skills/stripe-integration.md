---
name: stripe-integration
description: Build Stripe payment flows including checkout, webhooks, and Connect payouts. Use for payment-related features.
---

This skill guides Stripe payment integration in the AroundMe application.

## Stripe Setup

Environment variables:
```env
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

## API Routes

- `src/app/api/stripe/` - Payment endpoints
- `src/app/checkout/` - Checkout pages

## Checkout Flow

### 1. Create Checkout Session

```typescript
// POST /api/stripe/checkout
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(request: NextRequest) {
  const { eventId, ticketTypeId, quantity } = await request.json();
  const session = await getSession();
  
  const event = await prisma.event.findUnique({
    where: { id: eventId },
    include: { ticketTypes: true },
  });
  
  const ticketType = event.ticketTypes.find(t => t.id === ticketTypeId);
  
  const checkoutSession = await stripe.checkout.sessions.create({
    mode: 'payment',
    customer_email: session?.email,
    line_items: [{
      price_data: {
        currency: 'cop',
        product_data: {
          name: `${event.title} - ${ticketType.name}`,
          description: event.description.substring(0, 200),
        },
        unit_amount: Math.round(ticketType.price * 100), // Cents
      },
      quantity,
    }],
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/checkout/cancel`,
    metadata: {
      eventId,
      ticketTypeId,
      userId: session?.id || 'guest',
    },
  });
  
  return successResponse({ url: checkoutSession.url });
}
```

### 2. Handle Webhook

```typescript
// POST /api/stripe/webhook
export async function POST(request: NextRequest) {
  const body = await request.text();
  const sig = request.headers.get('stripe-signature')!;
  
  let event: Stripe.Event;
  
  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    return errorResponse('Webhook signature verification failed', 400);
  }
  
  switch (event.type) {
    case 'checkout.session.completed':
      await handleCheckoutCompleted(event.data.object);
      break;
    case 'charge.refunded':
      await handleRefund(event.data.object);
      break;
  }
  
  return successResponse({ received: true });
}

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  const { eventId, ticketTypeId, userId } = session.metadata!;
  
  // Create order
  const order = await prisma.order.create({
    data: {
      userId,
      eventId,
      totalAmount: session.amount_total! / 100,
      stripePaymentId: session.payment_intent as string,
      status: 'completed',
      items: {
        create: {
          ticketTypeId,
          quantity: 1,
          unitPrice: session.amount_total! / 100,
        },
      },
    },
  });
  
  // Update ticket inventory
  await prisma.ticketType.update({
    where: { id: ticketTypeId },
    data: { soldCount: { increment: 1 } },
  });
}
```

## Stripe Connect (Organizer Payouts)

### Create Connected Account

```typescript
const account = await stripe.accounts.create({
  type: 'express',
  email: user.email,
  metadata: { userId: user.id },
});

// Generate onboarding link
const accountLink = await stripe.accountLinks.create({
  account: account.id,
  refresh_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/earnings`,
  return_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/earnings`,
  type: 'account_onboarding',
});
```

### Transfer to Connected Account

```typescript
const transfer = await stripe.transfers.create({
  amount: Math.round(amount * 100 * 0.9), // 90% to organizer
  currency: 'cop',
  destination: connectedAccountId,
});
```

## Client-Side Checkout

```typescript
// components/TicketPurchase.tsx
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

async function handlePurchase(ticketTypeId: string, quantity: number) {
  const response = await fetch('/api/stripe/checkout', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ eventId, ticketTypeId, quantity }),
  });
  
  const { url } = await response.json();
  window.location.href = url;
}
```

## Free Events (Skip Stripe)

```typescript
// For free events, create order directly without Stripe
if (event.isFree) {
  await prisma.order.create({
    data: {
      userId: session.id,
      eventId,
      totalAmount: 0,
      status: 'completed',
      items: {
        create: {
          ticketTypeId,
          quantity,
          unitPrice: 0,
        },
      },
    },
  });
  
  return successResponse({ redirect: `/event/${eventId}?registered=true` });
}
```

## Currency Handling

All prices in COP (Colombian Pesos):
- Database stores full amount (e.g., 50000)
- Stripe needs cents (e.g., 5000000)
- Display with formatting: `$50,000 COP`

```typescript
// To cents for Stripe
const cents = Math.round(price * 100);

// From cents for display
const formatted = new Intl.NumberFormat('es-CO', {
  style: 'currency',
  currency: 'COP',
  minimumFractionDigits: 0,
}).format(price);
```

## Checklist

- [ ] Webhook handles `checkout.session.completed`
- [ ] Webhook handles `charge.refunded`
- [ ] Ticket inventory updated on purchase
- [ ] Order created with correct status
- [ ] Free events skip Stripe
- [ ] Prices stored in COP
- [ ] Connected accounts for organizers
- [ ] Transfer percentages configured
