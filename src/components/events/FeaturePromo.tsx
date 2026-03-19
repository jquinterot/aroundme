'use client';

interface FeaturePromoProps {
  isFeatured: boolean;
  featuredTier?: 'basic' | 'premium' | 'none';
  featuredUntil?: string;
  onFeatureBasic: () => void;
  onFeaturePremium: () => void;
  onRemoveFeature: () => void;
  isPending: boolean;
}

export function FeaturePromo({ 
  isFeatured, 
  featuredTier, 
  featuredUntil, 
  onFeatureBasic, 
  onFeaturePremium, 
  onRemoveFeature,
  isPending 
}: FeaturePromoProps) {
  return (
    <div className="mt-6 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg p-4 border border-yellow-200">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-xl">⭐</span>
        <h3 className="font-semibold text-gray-900">Boost Your Event</h3>
      </div>
      {!isFeatured ? (
        <div className="space-y-3">
          <p className="text-sm text-gray-600">Get more visibility by featuring your event at the top of listings.</p>
          <div className="flex gap-3">
            <button
              onClick={onFeatureBasic}
              disabled={isPending}
              className="flex-1 bg-white border border-yellow-400 text-yellow-700 py-2 px-4 rounded-lg font-medium hover:bg-yellow-50 transition-colors disabled:opacity-50"
            >
              <div className="flex items-center justify-center gap-2">
                <span>🌟</span>
                <div>
                  <p className="text-sm font-semibold">Basic</p>
                  <p className="text-xs">7 days · $45,000 COP</p>
                </div>
              </div>
            </button>
            <button
              onClick={onFeaturePremium}
              disabled={isPending}
              className="flex-1 bg-gradient-to-r from-yellow-400 to-orange-500 text-white py-2 px-4 rounded-lg font-medium hover:from-yellow-500 hover:to-orange-600 transition-colors disabled:opacity-50"
            >
              <div className="flex items-center justify-center gap-2">
                <span>👑</span>
                <div>
                  <p className="text-sm font-semibold">Premium</p>
                  <p className="text-xs">30 days · $110,000 COP</p>
                </div>
              </div>
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="flex items-center justify-between bg-white rounded-lg p-3">
            <div className="flex items-center gap-2">
              <span className="text-2xl">{featuredTier === 'premium' ? '👑' : '🌟'}</span>
              <div>
                <p className="font-medium text-gray-900">
                  {featuredTier === 'premium' ? 'Premium' : 'Basic'} Featured
                </p>
                <p className="text-xs text-gray-500">
                  Expires: {featuredUntil ? new Date(featuredUntil).toLocaleDateString('es-CO') : 'N/A'}
                </p>
              </div>
            </div>
            <button
              onClick={onRemoveFeature}
              disabled={isPending}
              className="text-sm text-red-600 hover:text-red-700 disabled:opacity-50"
            >
              Remove
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
