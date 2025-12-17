import { useState } from 'react';
import { cn } from '../../lib/utils';

interface RatingStarsProps {
  rating: number;
  maxRating?: number;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  interactive?: boolean;
  onChange?: (rating: number) => void;
  showValue?: boolean;
  className?: string;
}

export const RatingStars = ({
  rating,
  maxRating = 5,
  size = 'md',
  interactive = false,
  onChange,
  showValue = false,
  className,
}: RatingStarsProps) => {
  const [hoverRating, setHoverRating] = useState(0);

  const displayRating = interactive && hoverRating > 0 ? hoverRating : rating;

  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
    xl: 'w-8 h-8',
  };

  const handleClick = (value: number) => {
    if (interactive && onChange) {
      onChange(value);
    }
  };

  const handleMouseEnter = (value: number) => {
    if (interactive) {
      setHoverRating(value);
    }
  };

  const handleMouseLeave = () => {
    if (interactive) {
      setHoverRating(0);
    }
  };

  const stars = [];
  for (let i = 1; i <= maxRating; i++) {
    const isFilled = i <= displayRating;
    const isPartial = i > displayRating && i - 1 < displayRating;
    const fillPercentage = isPartial ? ((displayRating % 1) * 100).toFixed(0) : isFilled ? '100' : '0';

    stars.push(
      <div
        key={i}
        className={cn(
          'relative',
          interactive && 'cursor-pointer transition-transform hover:scale-110'
        )}
        onClick={() => handleClick(i)}
        onMouseEnter={() => handleMouseEnter(i)}
        onMouseLeave={handleMouseLeave}
      >
        {/* Background star (empty) */}
        <svg
          className={cn(sizeClasses[size], 'text-gray-300')}
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
        </svg>

        {/* Foreground star (filled) */}
        <div
          className="absolute inset-0 overflow-hidden"
          style={{ width: `${fillPercentage}%` }}
        >
          <svg
            className={cn(sizeClasses[size], 'text-yellow-500')}
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
          </svg>
        </div>
      </div>
    );
  }

  return (
    <div className={cn('flex items-center gap-1', className)}>
      <div className="flex items-center gap-0.5">{stars}</div>
      {showValue && (
        <span className="text-sm font-medium text-gray-700 ml-1">
          {displayRating.toFixed(1)}
        </span>
      )}
    </div>
  );
};
