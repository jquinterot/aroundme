import Stripe from 'stripe';

let _stripe: Stripe | null = null;

export function getStripe(): Stripe {
  if (!_stripe) {
    if (!process.env.STRIPE_SECRET_KEY) {
      throw new Error('STRIPE_SECRET_KEY is not set');
    }
    _stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2026-02-25.clover',
    });
  }
  return _stripe;
}

export const stripe = {
  get checkout() { return getStripe().checkout; },
  get webhooks() { return getStripe().webhooks; },
  get accounts() { return getStripe().accounts; },
  get transfers() { return getStripe().transfers; },
  get balance() { return getStripe().balance; },
};

export const STRIPE_PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '';

export const PLATFORM_FEE_PERCENT = 0.10; // 10% platform fee

export function calculateFees(totalAmount: number): { platformFee: number; payoutAmount: number } {
  const platformFee = Math.round(totalAmount * PLATFORM_FEE_PERCENT);
  const payoutAmount = totalAmount - platformFee;
  return { platformFee, payoutAmount };
}
