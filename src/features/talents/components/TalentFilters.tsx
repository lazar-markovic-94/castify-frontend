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

  const clearFilters = () => {
    setFilters({});
    onFilterChange({});
  };

  return (
    <Card className="sticky top-24 bg-white/80 backdrop-blur-sm border-0 shadow-lg">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-bold text-slate-900">Filters</CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
          >
            Clear All
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
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
      </CardContent>
    </Card>
  );
};
