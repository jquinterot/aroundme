'use client';

import { useAuth } from '@/contexts/AuthContext';
import { TIER_FEATURES, TIER_LIMITS, UserTier, PremiumFeatures } from '@/types';

interface UsePremiumResult {
  tier: UserTier;
  features: PremiumFeatures;
  limits: typeof TIER_LIMITS.free;
  isPremium: boolean;
  isBasic: boolean;
  isFree: boolean;
  canAccess: (feature: keyof PremiumFeatures) => boolean;
  hasReachedLimit: (limitType: keyof typeof TIER_LIMITS.free) => boolean;
  upgradeMessage?: string;
}

export function usePremium(): UsePremiumResult {
  const { user } = useAuth();
  
  const tier = (user as { tier?: UserTier })?.tier || 'free';
  const features = TIER_FEATURES[tier];
  const limits = TIER_LIMITS[tier];
  
  const isPremium = tier === 'premium';
  const isBasic = tier === 'basic';
  const isFree = tier === 'free';
  
  const canAccess = (feature: keyof PremiumFeatures): boolean => {
    return features[feature];
  };
  
  const hasReachedLimit = (limitType: keyof typeof TIER_LIMITS.free): boolean => {
    const limit = limits[limitType];
    if (limit === -1) return false; // unlimited
    // For demo purposes, we'll return false for now
    // In production, you'd compare against actual usage
    return false;
  };
  
  const upgradeMessage = !isPremium 
    ? 'Upgrade to Premium to access this feature' 
    : undefined;
  
  return {
    tier,
    features,
    limits,
    isPremium,
    isBasic,
    isFree,
    canAccess,
    hasReachedLimit,
    upgradeMessage,
  };
}

interface PremiumGateProps {
  children: React.ReactNode;
  feature: keyof PremiumFeatures;
  fallback?: React.ReactNode;
  showUpgradePrompt?: boolean;
}

export function PremiumGate({ 
  children, 
  feature, 
  fallback = null,
  showUpgradePrompt = true 
}: PremiumGateProps) {
  const { canAccess } = usePremium();
  
  if (canAccess(feature)) {
    return <>{children}</>;
  }
  
  if (showUpgradePrompt && fallback) {
    return <>{fallback}</>;
  }
  
  return <>{fallback}</>;
}
