import { TalentRating } from '../../../core/domain/entities';
import { RatingStars } from './RatingStars';
import { Button } from './Button';
import { cn } from '../../lib/utils';

interface ReviewListProps {
  reviews: TalentRating[];
  totalReviews: number;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  isLoading?: boolean;
  className?: string;
}

export const ReviewList = ({
  reviews,
  totalReviews,
  currentPage,
  totalPages,
  onPageChange,
  isLoading = false,
  className,
}: ReviewListProps) => {
  if (isLoading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
        <p className="text-gray-600 mt-4">Loading reviews...</p>
      </div>
    );
  }

  if (reviews.length === 0) {
    return (
      <div className="text-center py-12 bg-gray-50 rounded-lg">
        <svg
          className="mx-auto h-12 w-12 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
          />
        </svg>
        <p className="mt-4 text-gray-500">No reviews yet</p>
        <p className="text-sm text-gray-400 mt-1">Be the first to review this talent!</p>
      </div>
    );
  }

  return (
    <div className={cn('space-y-6', className)}>
      {/* Reviews List */}
      <div className="space-y-4">
        {reviews.map((review) => (
          <div
            key={review.ratingId}
            className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <RatingStars rating={review.averageRating} size="md" showValue />
                  {review.isVerified && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Verified
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-500">
                  {new Date(review.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
              </div>
              {review.wouldWorkAgain && (
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Would work again
                </span>
              )}
            </div>

            {/* Rating Breakdown */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
              <div className="text-center p-2 bg-gray-50 rounded">
                <p className="text-xs text-gray-600 mb-1">Professionalism</p>
                <p className="text-lg font-semibold text-gray-900">
                  {review.professionalismRating}
                </p>
              </div>
              <div className="text-center p-2 bg-gray-50 rounded">
                <p className="text-xs text-gray-600 mb-1">Quality</p>
                <p className="text-lg font-semibold text-gray-900">{review.qualityRating}</p>
              </div>
              <div className="text-center p-2 bg-gray-50 rounded">
                <p className="text-xs text-gray-600 mb-1">Communication</p>
                <p className="text-lg font-semibold text-gray-900">
                  {review.communicationRating}
                </p>
              </div>
              <div className="text-center p-2 bg-gray-50 rounded">
                <p className="text-xs text-gray-600 mb-1">Timeliness</p>
                <p className="text-lg font-semibold text-gray-900">
                  {review.timelinessRating}
                </p>
              </div>
            </div>

            {/* Review Text */}
            {review.reviewText && (
              <div className="mt-4">
                <p className="text-gray-700 leading-relaxed">{review.reviewText}</p>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between border-t pt-4">
          <div className="text-sm text-gray-600">
            Showing page {currentPage + 1} of {totalPages} ({totalReviews} total reviews)
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 0}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              Previous
            </Button>
            <div className="flex items-center gap-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i;
                } else if (currentPage < 3) {
                  pageNum = i;
                } else if (currentPage >= totalPages - 3) {
                  pageNum = totalPages - 5 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }

                return (
                  <button
                    key={pageNum}
                    onClick={() => onPageChange(pageNum)}
                    className={cn(
                      'w-8 h-8 rounded text-sm font-medium transition-colors',
                      currentPage === pageNum
                        ? 'bg-blue-600 text-white'
                        : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                    )}
                  >
                    {pageNum + 1}
                  </button>
                );
              })}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage >= totalPages - 1}
            >
              Next
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
