import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { getStripe, PLATFORM_FEE_PERCENT } from '@/lib/stripe';
import { handleApiError } from '@/lib/api-utils';

export async function POST(_request: NextRequest) {
  try {
    const session = await getSession();
    
    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Please login to continue' },
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: session.id },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }

    const stripeInstance = getStripe();
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

    if (user.stripeAccountId && user.stripeOnboardingComplete) {
      const loginLink = await stripeInstance.accounts.createLoginLink(user.stripeAccountId);
      return NextResponse.json({
        success: true,
        data: {
          accountId: user.stripeAccountId,
          onboardingComplete: true,
          dashboardUrl: loginLink.url,
        },
      });
    }

    let accountId = user.stripeAccountId;

    if (!accountId) {
      const account = await stripeInstance.accounts.create({
        type: 'express',
        email: user.email,
        metadata: {
          userId: user.id,
          userName: user.name,
        },
        capabilities: {
          card_payments: { requested: true },
          transfers: { requested: true },
        },
      });
      
      accountId = account.id;
      
      await prisma.user.update({
        where: { id: user.id },
        data: { stripeAccountId: accountId },
      });
    }

    const accountLink = await stripeInstance.accountLinks.create({
      account: accountId,
      refresh_url: `${appUrl}/dashboard/settings?stripe_refresh=true`,
      return_url: `${appUrl}/dashboard/settings?stripe_success=true`,
      type: 'account_onboarding',
    });

    return NextResponse.json({
      success: true,
      data: {
        accountId,
        onboardingUrl: accountLink.url,
        onboardingComplete: false,
      },
    });
  } catch (error) {
    return handleApiError(error, 'Stripe Connect account creation');
  }
}

export async function GET(_request: NextRequest) {
  try {
    const session = await getSession();
    
    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Please login to continue' },
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: session.id },
      select: {
        stripeAccountId: true,
        stripeOnboardingComplete: true,
        stripeAccountBalance: true,
        platformFeePercent: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }

    if (!user.stripeAccountId) {
      return NextResponse.json({
        success: true,
        data: {
          connected: false,
          balance: 0,
          pendingBalance: 0,
          platformFeePercent: PLATFORM_FEE_PERCENT * 100,
        },
      });
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const dashboardUrl = `${appUrl}/dashboard/earnings`;

    return NextResponse.json({
      success: true,
      data: {
        connected: true,
        accountId: user.stripeAccountId,
        onboardingComplete: user.stripeOnboardingComplete,
        balance: user.stripeAccountBalance,
        pendingBalance: 0,
        platformFeePercent: (user.platformFeePercent || PLATFORM_FEE_PERCENT) * 100,
        dashboardUrl,
      },
    });
  } catch (error) {
    return handleApiError(error, 'Stripe Connect status fetch');
  }
}
