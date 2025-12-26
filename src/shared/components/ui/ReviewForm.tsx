import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from './Button';
import { RatingStars } from './RatingStars';
import { AlertModal } from './AlertModal';
import { CreateRatingRequest } from '../../../core/domain/dtos';
import { cn } from '../../lib/utils';

interface ReviewFormProps {
  talentProfileId: string;
  talentName: string;
  onSubmit: (data: CreateRatingRequest) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
  className?: string;
}

interface FormData {
  overallRating: number;
  professionalismRating: number;
  qualityRating: number;
  communicationRating: number;
  timelinessRating: number;
  reviewText: string;
  wouldWorkAgain: boolean;
}

export const ReviewForm = ({
  talentProfileId,
  talentName,
  onSubmit,
  onCancel,
  isSubmitting = false,
  className,
}: ReviewFormProps) => {
  const [ratings, setRatings] = useState({
    overall: 0,
    professionalism: 0,
    quality: 0,
    communication: 0,
    timeliness: 0,
  });

  const [showValidationAlert, setShowValidationAlert] = useState(false);

  const { register, handleSubmit } = useForm<FormData>();

  const handleRatingChange = (category: keyof typeof ratings, value: number) => {
    setRatings((prev) => ({ ...prev, [category]: value }));
  };

  const onFormSubmit = (data: FormData) => {
    // Validate all ratings are set
    if (
      ratings.overall === 0 ||
      ratings.professionalism === 0 ||
      ratings.quality === 0 ||
      ratings.communication === 0 ||
      ratings.timeliness === 0
    ) {
      setShowValidationAlert(true);
      return;
    }

    const reviewData: CreateRatingRequest = {
      talentProfileId,
      overallRating: ratings.overall,
      professionalismRating: ratings.professionalism,
      qualityRating: ratings.quality,
      communicationRating: ratings.communication,
      timelinessRating: ratings.timeliness,
      reviewText: data.reviewText.trim() || null,
      wouldWorkAgain: data.wouldWorkAgain,
    };

    onSubmit(reviewData);
  };

  const ratingCategories = [
    {
      key: 'overall' as const,
      label: 'Overall Rating',
      description: 'Your overall experience with this talent',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
          />
        </svg>
      ),
    },
    {
      key: 'professionalism' as const,
      label: 'Professionalism',
      description: 'Their professionalism and work ethic',
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
    },
    {
      key: 'quality' as const,
      label: 'Quality of Work',
      description: 'The quality of their delivered work',
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
    },
    {
      key: 'communication' as const,
      label: 'Communication',
      description: 'How well they communicated throughout',
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
    },
    {
      key: 'timeliness' as const,
      label: 'Timeliness',
      description: 'Their punctuality and meeting deadlines',
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
    },
  ];

  return (
    <div className={cn('bg-white rounded-lg shadow-lg p-6', className)}>
      <div className="mb-6">
        <h3 className="text-2xl font-bold text-gray-900">Write a Review</h3>
        <p className="text-gray-600 mt-1">Share your experience working with {talentName}</p>
      </div>

      <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
        {/* Rating Categories */}
        <div className="space-y-4">
          <h4 className="text-lg font-semibold text-gray-900">Rate Your Experience</h4>
          {ratingCategories.map((category) => (
            <div
              key={category.key}
              className="flex items-start justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="flex items-start gap-3">
                <div className="text-blue-600 mt-0.5">{category.icon}</div>
                <div>
                  <h5 className="font-medium text-gray-900">{category.label}</h5>
                  <p className="text-sm text-gray-600">{category.description}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <RatingStars
                  rating={ratings[category.key]}
                  interactive
                  size="lg"
                  onChange={(value) => handleRatingChange(category.key, value)}
                />
                {ratings[category.key] > 0 && (
                  <span className="text-sm font-semibold text-gray-700 min-w-[2rem]">
                    {ratings[category.key]}.0
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Review Text */}
        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-2">
            Written Review (Optional)
          </label>
          <textarea
            {...register('reviewText')}
            rows={5}
            maxLength={2000}
            placeholder="Share details about your experience, what went well, and any areas for improvement..."
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          />
          <p className="text-xs text-gray-500 mt-1">Maximum 2000 characters</p>
        </div>

        {/* Would Work Again */}
        <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg">
          <input
            type="checkbox"
            {...register('wouldWorkAgain')}
            id="wouldWorkAgain"
            className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <label
            htmlFor="wouldWorkAgain"
            className="text-sm font-medium text-gray-900 cursor-pointer"
          >
            I would work with this talent again
          </label>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Submitting...
              </span>
            ) : (
              'Submit Review'
            )}
          </Button>
        </div>
      </form>

      {/* Validation Alert Modal */}
      <AlertModal
        isOpen={showValidationAlert}
        title="Missing Ratings"
        message="Please provide all ratings before submitting your review."
        variant="warning"
        onClose={() => setShowValidationAlert(false)}
      />
    </div>
  );
};
