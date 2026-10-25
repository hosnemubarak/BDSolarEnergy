import React from 'react';
import { Star } from 'lucide-react';

interface RatingStarsProps {
  rating: number;
  reviewCount?: number;
  size?: number;
  showText?: boolean;
}

export const RatingStars: React.FC<RatingStarsProps> = ({
  rating,
  reviewCount,
  size = 14,
  showText = true,
}) => {
  return (
    <div className="flex items-center gap-1.5 text-xs text-gray-500">
      <div className="flex items-center text-amber-400">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={size}
            className={`${
              star <= Math.round(rating)
                ? 'fill-amber-400 text-amber-400'
                : 'fill-gray-100 text-gray-300'
            }`}
          />
        ))}
      </div>
      {showText && (
        <span className="font-medium text-gray-700">
          {rating.toFixed(1)}
          {reviewCount !== undefined && (
            <span className="text-gray-400 font-normal ml-1">({reviewCount})</span>
          )}
        </span>
      )}
    </div>
  );
};
