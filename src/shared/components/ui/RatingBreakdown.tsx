import { TalentStatistics } from '../../../core/domain/entities';
import { RatingStars } from './RatingStars';
import { cn } from '../../lib/utils';

interface RatingBreakdownProps {
  statistics: TalentStatistics;
  className?: string;
}

export const RatingBreakdown = ({ statistics, className }: RatingBreakdownProps) => {
  const ratingCategories = [
    {
      label: 'Professionalism',
      value: statistics.ratingBreakdown.averageProfessionalism,
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
          />
        </svg>
      ),
      color: 'bg-blue-600',
    },
    {
      label: 'Quality',
      value: statistics.ratingBreakdown.averageQuality,
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
          />
        </svg>
      ),
      color: 'bg-green-600',
    },
    {
      label: 'Communication',
      value: statistics.ratingBreakdown.averageCommunication,
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
          />
        </svg>
      ),
      color: 'bg-purple-600',
    },
    {
      label: 'Timeliness',
      value: statistics.ratingBreakdown.averageTimeliness,
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
      color: 'bg-orange-600',
    },
  ];

  return (
    <div className={cn('bg-white rounded-lg p-6', className)}>
      {/* Overall Rating */}
      <div className="text-center mb-8 pb-6 border-b">
        <div className="flex items-center justify-center gap-3 mb-2">
          <span className="text-5xl font-bold text-gray-900">
            {statistics.averageRating.toFixed(1)}
          </span>
          <div className="text-left">
            <RatingStars rating={statistics.averageRating} size="lg" />
            <p className="text-sm text-gray-600 mt-1">
              {statistics.totalRatings} {statistics.totalRatings === 1 ? 'review' : 'reviews'}
            </p>
          </div>
        </div>
      </div>

      {/* Rating Categories */}
      <div className="space-y-4 mb-6">
        <h4 className="text-sm font-semibold text-gray-900 mb-3">Rating Breakdown</h4>
        {ratingCategories.map((category) => (
          <div key={category.label} className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="text-gray-600">{category.icon}</div>
                <span className="text-sm font-medium text-gray-700">{category.label}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-gray-900">
                  {category.value.toFixed(1)}
                </span>
                <RatingStars rating={category.value} size="sm" />
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className={cn('h-2 rounded-full transition-all', category.color)}
                style={{ width: `${(category.value / 5) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Collaboration Metrics */}
      <div className="space-y-4 pt-6 border-t">
        <h4 className="text-sm font-semibold text-gray-900 mb-3">Collaboration History</h4>

        <div className="grid grid-cols-2 gap-3">
          <div className="text-center p-3 bg-blue-50 rounded-lg border border-blue-100">
            <p className="text-2xl font-bold text-blue-900">
              {statistics.collaborationMetrics.totalCollaborations}
            </p>
            <p className="text-xs text-blue-700 mt-1">Total Projects</p>
          </div>
          <div className="text-center p-3 bg-green-50 rounded-lg border border-green-100">
            <p className="text-2xl font-bold text-green-900">
              {statistics.collaborationMetrics.completedCollaborations}
            </p>
            <p className="text-xs text-green-700 mt-1">Completed</p>
          </div>
          <div className="text-center p-3 bg-orange-50 rounded-lg border border-orange-100">
            <p className="text-2xl font-bold text-orange-900">
              {statistics.collaborationMetrics.canceledCollaborations}
            </p>
            <p className="text-xs text-orange-700 mt-1">Canceled</p>
          </div>
          <div className="text-center p-3 bg-purple-50 rounded-lg border border-purple-100">
            <p className="text-2xl font-bold text-purple-900">
              {statistics.collaborationMetrics.successRate.toFixed(0)}%
            </p>
            <p className="text-xs text-purple-700 mt-1">Success Rate</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 mt-3">
          <div className="text-center p-3 bg-indigo-50 rounded-lg border border-indigo-100">
            <p className="text-2xl font-bold text-indigo-900">
              {statistics.collaborationMetrics.wouldWorkAgainPercentage.toFixed(0)}%
            </p>
            <p className="text-xs text-indigo-700 mt-1">Would Work Again</p>
          </div>
          <div className="text-center p-3 bg-teal-50 rounded-lg border border-teal-100">
            <p className="text-2xl font-bold text-teal-900">
              {statistics.engagementMetrics.averageResponseTimeHours !== null
                ? `${statistics.engagementMetrics.averageResponseTimeHours.toFixed(1)}h`
                : 'N/A'}
            </p>
            <p className="text-xs text-teal-700 mt-1">Avg Response Time</p>
          </div>
        </div>
      </div>

      {/* Tier Badge */}
      <div className="mt-6 pt-6 border-t text-center">
        <span
          className={cn(
            'inline-block px-4 py-2 rounded-full text-sm font-semibold shadow-md',
            statistics.tier === 'PREMIUM' &&
              'bg-gradient-to-r from-purple-500 to-indigo-600 text-white',
            statistics.tier === 'GOLD' &&
              'bg-gradient-to-r from-yellow-400 to-yellow-600 text-white',
            statistics.tier === 'SILVER' &&
              'bg-gradient-to-r from-gray-300 to-gray-400 text-gray-800',
            statistics.tier === 'BRONZE' &&
              'bg-gradient-to-r from-orange-400 to-orange-600 text-white'
          )}
        >
          {statistics.tier} TIER
        </span>
      </div>
    </div>
  );
};
