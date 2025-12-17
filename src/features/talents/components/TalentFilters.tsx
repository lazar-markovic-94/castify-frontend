import { useState } from 'react';
import { TalentSearchRequest } from '../../../core/domain/dtos';
import { TalentTier } from '../../../core/domain/enums';
import { Button } from '../../../shared/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../../../shared/components/ui/Card';

interface TalentFiltersProps {
  onFilterChange: (filters: TalentSearchRequest) => void;
}

export const TalentFilters = ({ onFilterChange }: TalentFiltersProps) => {
  const [filters, setFilters] = useState<TalentSearchRequest>({});
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);

  const handleCapabilityChange = (capability: keyof TalentSearchRequest, checked: boolean) => {
    const newFilters = {
      ...filters,
      [capability]: checked || undefined,
    };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleTierChange = (tier: TalentTier, checked: boolean) => {
    const currentTiers = filters.tiers || [];
    const newTiers = checked
      ? [...currentTiers, tier]
      : currentTiers.filter((t) => t !== tier);
    const newFilters = {
      ...filters,
      tiers: newTiers.length > 0 ? newTiers : undefined,
    };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleMinRatingChange = (rating: number) => {
    const newFilters = {
      ...filters,
      minAverageRating: rating > 0 ? rating : undefined,
    };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleMinCollaborationsChange = (value: string) => {
    const numValue = parseInt(value);
    const newFilters = {
      ...filters,
      minCompletedCollaborations: !isNaN(numValue) && numValue > 0 ? numValue : undefined,
    };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleRadiusChange = (radius: number) => {
    const newFilters = {
      ...filters,
      radiusKm: radius > 0 ? radius : undefined,
    };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by your browser');
      return;
    }

    setIsGettingLocation(true);
    setLocationError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const newFilters = {
          ...filters,
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          radiusKm: filters.radiusKm || 50, // Default to 50km if not set
        };
        setFilters(newFilters);
        onFilterChange(newFilters);
        setIsGettingLocation(false);
      },
      (error) => {
        setLocationError(
          error.code === error.PERMISSION_DENIED
            ? 'Location access denied. Please enable location permissions.'
            : 'Failed to get your location. Please try again.'
        );
        setIsGettingLocation(false);
      }
    );
  };

  const handleClearLocation = () => {
    const newFilters = {
      ...filters,
      latitude: undefined,
      longitude: undefined,
      radiusKm: undefined,
    };
    setFilters(newFilters);
    onFilterChange(newFilters);
    setLocationError(null);
  };

  const clearFilters = () => {
    setFilters({});
    onFilterChange({});
    setLocationError(null);
  };

  return (
    <Card className="lg:sticky lg:top-24 bg-white/80 backdrop-blur-sm border-0 shadow-lg">
      <CardHeader className="pb-3 sm:pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg sm:text-xl font-bold text-slate-900">Filters</CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 text-xs sm:text-sm"
          >
            Clear All
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-3 sm:space-y-4">
        <div className="space-y-3">
          <p className="text-xs font-semibold text-slate-700 uppercase tracking-wide mb-3">Capabilities</p>

          <label className="flex items-center space-x-3 cursor-pointer group p-2 rounded-lg hover:bg-blue-50/50 transition-colors">
            <input
              type="checkbox"
              checked={filters.canDoActing || false}
              onChange={(e) => handleCapabilityChange('canDoActing', e.target.checked)}
              className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-2 focus:ring-blue-500 focus:ring-offset-0 cursor-pointer"
            />
            <span className="text-sm text-slate-700 font-medium group-hover:text-slate-900">Acting</span>
          </label>

          <label className="flex items-center space-x-3 cursor-pointer group p-2 rounded-lg hover:bg-blue-50/50 transition-colors">
            <input
              type="checkbox"
              checked={filters.canDoVoiceover || false}
              onChange={(e) => handleCapabilityChange('canDoVoiceover', e.target.checked)}
              className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-2 focus:ring-blue-500 focus:ring-offset-0 cursor-pointer"
            />
            <span className="text-sm text-slate-700 font-medium group-hover:text-slate-900">Voiceover</span>
          </label>

          <label className="flex items-center space-x-3 cursor-pointer group p-2 rounded-lg hover:bg-blue-50/50 transition-colors">
            <input
              type="checkbox"
              checked={filters.canDoModeling || false}
              onChange={(e) => handleCapabilityChange('canDoModeling', e.target.checked)}
              className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-2 focus:ring-blue-500 focus:ring-offset-0 cursor-pointer"
            />
            <span className="text-sm text-slate-700 font-medium group-hover:text-slate-900">Modeling</span>
          </label>

          <label className="flex items-center space-x-3 cursor-pointer group p-2 rounded-lg hover:bg-blue-50/50 transition-colors">
            <input
              type="checkbox"
              checked={filters.canDoSinging || false}
              onChange={(e) => handleCapabilityChange('canDoSinging', e.target.checked)}
              className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-2 focus:ring-blue-500 focus:ring-offset-0 cursor-pointer"
            />
            <span className="text-sm text-slate-700 font-medium group-hover:text-slate-900">Singing</span>
          </label>

          <label className="flex items-center space-x-3 cursor-pointer group p-2 rounded-lg hover:bg-blue-50/50 transition-colors">
            <input
              type="checkbox"
              checked={filters.canDoDancing || false}
              onChange={(e) => handleCapabilityChange('canDoDancing', e.target.checked)}
              className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-2 focus:ring-blue-500 focus:ring-offset-0 cursor-pointer"
            />
            <span className="text-sm text-slate-700 font-medium group-hover:text-slate-900">Dancing</span>
          </label>

          <label className="flex items-center space-x-3 cursor-pointer group p-2 rounded-lg hover:bg-blue-50/50 transition-colors">
            <input
              type="checkbox"
              checked={filters.canDoHosting || false}
              onChange={(e) => handleCapabilityChange('canDoHosting', e.target.checked)}
              className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-2 focus:ring-blue-500 focus:ring-offset-0 cursor-pointer"
            />
            <span className="text-sm text-slate-700 font-medium group-hover:text-slate-900">Hosting</span>
          </label>
        </div>

        <div className="border-t border-slate-200 pt-4 space-y-3">
          <p className="text-xs font-semibold text-slate-700 uppercase tracking-wide mb-3">Talent Tier</p>

          <label className="flex items-center space-x-3 cursor-pointer group p-2 rounded-lg hover:bg-blue-50/50 transition-colors">
            <input
              type="checkbox"
              checked={filters.tiers?.includes(TalentTier.PREMIUM) || false}
              onChange={(e) => handleTierChange(TalentTier.PREMIUM, e.target.checked)}
              className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-2 focus:ring-blue-500 focus:ring-offset-0 cursor-pointer"
            />
            <span className="text-sm text-slate-700 font-medium group-hover:text-slate-900">Premium</span>
          </label>

          <label className="flex items-center space-x-3 cursor-pointer group p-2 rounded-lg hover:bg-blue-50/50 transition-colors">
            <input
              type="checkbox"
              checked={filters.tiers?.includes(TalentTier.GOLD) || false}
              onChange={(e) => handleTierChange(TalentTier.GOLD, e.target.checked)}
              className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-2 focus:ring-blue-500 focus:ring-offset-0 cursor-pointer"
            />
            <span className="text-sm text-slate-700 font-medium group-hover:text-slate-900">Gold</span>
          </label>

          <label className="flex items-center space-x-3 cursor-pointer group p-2 rounded-lg hover:bg-blue-50/50 transition-colors">
            <input
              type="checkbox"
              checked={filters.tiers?.includes(TalentTier.SILVER) || false}
              onChange={(e) => handleTierChange(TalentTier.SILVER, e.target.checked)}
              className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-2 focus:ring-blue-500 focus:ring-offset-0 cursor-pointer"
            />
            <span className="text-sm text-slate-700 font-medium group-hover:text-slate-900">Silver</span>
          </label>

          <label className="flex items-center space-x-3 cursor-pointer group p-2 rounded-lg hover:bg-blue-50/50 transition-colors">
            <input
              type="checkbox"
              checked={filters.tiers?.includes(TalentTier.BRONZE) || false}
              onChange={(e) => handleTierChange(TalentTier.BRONZE, e.target.checked)}
              className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-2 focus:ring-blue-500 focus:ring-offset-0 cursor-pointer"
            />
            <span className="text-sm text-slate-700 font-medium group-hover:text-slate-900">Bronze</span>
          </label>
        </div>

        <div className="border-t border-slate-200 pt-4 space-y-3">
          <p className="text-xs font-semibold text-slate-700 uppercase tracking-wide mb-3">Rating</p>
          <div className="space-y-2">
            <label className="text-sm text-slate-700 font-medium">Minimum Rating</label>
            <div className="flex items-center gap-2">
              <input
                type="range"
                min="0"
                max="5"
                step="0.5"
                value={filters.minAverageRating || 0}
                onChange={(e) => handleMinRatingChange(parseFloat(e.target.value))}
                className="flex-1 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
              <span className="text-sm font-semibold text-slate-900 w-12 text-right">
                {filters.minAverageRating ? `${filters.minAverageRating.toFixed(1)}+` : 'Any'}
              </span>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-200 pt-4 space-y-3">
          <p className="text-xs font-semibold text-slate-700 uppercase tracking-wide mb-3">Experience</p>
          <div className="space-y-2">
            <label className="text-sm text-slate-700 font-medium">Min. Completed Projects</label>
            <input
              type="number"
              min="0"
              placeholder="Any"
              value={filters.minCompletedCollaborations || ''}
              onChange={(e) => handleMinCollaborationsChange(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        <div className="border-t border-slate-200 pt-4 space-y-3">
          <p className="text-xs font-semibold text-slate-700 uppercase tracking-wide mb-3">Location</p>

          {/* Near Me Button */}
          <Button
            variant="outline"
            size="sm"
            onClick={handleGetLocation}
            disabled={isGettingLocation}
            className="w-full"
          >
            {isGettingLocation ? (
              <>
                <div className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-current border-r-transparent mr-2"></div>
                Getting location...
              </>
            ) : (
              <>
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                Near Me
              </>
            )}
          </Button>

          {/* Error Message */}
          {locationError && (
            <div className="text-xs text-red-600 bg-red-50 p-2 rounded-lg">
              {locationError}
            </div>
          )}

          {/* Current Location Display */}
          {filters.latitude && filters.longitude && (
            <div className="bg-blue-50 p-3 rounded-lg space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-blue-900">Search Location:</span>
                <button
                  onClick={handleClearLocation}
                  className="text-xs text-blue-600 hover:text-blue-700"
                >
                  Clear
                </button>
              </div>
              <div className="text-xs text-blue-700">
                <div>Lat: {filters.latitude.toFixed(6)}</div>
                <div>Lng: {filters.longitude.toFixed(6)}</div>
              </div>
            </div>
          )}

          {/* Radius Slider */}
          {filters.latitude && filters.longitude && (
            <div className="space-y-2">
              <label className="text-sm text-slate-700 font-medium">Search Radius</label>
              <div className="flex items-center gap-2">
                <input
                  type="range"
                  min="5"
                  max="500"
                  step="5"
                  value={filters.radiusKm || 50}
                  onChange={(e) => handleRadiusChange(parseFloat(e.target.value))}
                  className="flex-1 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
                <span className="text-sm font-semibold text-slate-900 w-16 text-right">
                  {filters.radiusKm || 50} km
                </span>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
