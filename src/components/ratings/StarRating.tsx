"use client";

import { useState } from 'react';

interface StarRatingProps {
  rating?: number;
  onRatingChange?: (rating: number) => void;
  readonly?: boolean;
  size?: 'sm' | 'md' | 'lg';
  showValue?: boolean;
  className?: string;
}

export default function StarRating({
  rating = 0,
  onRatingChange,
  readonly = false,
  size = 'md',
  showValue = false,
  className = '',
}: StarRatingProps) {
  const [hoverRating, setHoverRating] = useState(0);
  const [currentRating, setCurrentRating] = useState(rating);

  const sizeClasses = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-3xl',
  };

  const handleStarClick = (starRating: number) => {
    if (!readonly && onRatingChange) {
      setCurrentRating(starRating);
      onRatingChange(starRating);
    }
  };

  const handleMouseEnter = (starRating: number) => {
    if (!readonly) {
      setHoverRating(starRating);
    }
  };

  const handleMouseLeave = () => {
    if (!readonly) {
      setHoverRating(0);
    }
  };

  const displayRating = hoverRating || currentRating;

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="flex items-center">
        {Array.from({ length: 5 }, (_, i) => {
          const starValue = i + 1;
          const isFilled = starValue <= displayRating;
          const isHalfFilled = !isFilled && starValue - 0.5 <= displayRating && displayRating % 1 !== 0;

          return (
            <button
              key={i}
              type="button"
              onClick={() => handleStarClick(starValue)}
              onMouseEnter={() => handleMouseEnter(starValue)}
              onMouseLeave={handleMouseLeave}
              disabled={readonly}
              className={`${sizeClasses[size]} transition-colors duration-200 ${
                readonly
                  ? 'cursor-default'
                  : 'cursor-pointer hover:scale-110 transform transition-transform'
              }`}
              title={readonly ? `${currentRating} نجوم` : `قيم ${starValue} نجوم`}
            >
              <span
                className={`relative inline-block ${
                  isFilled
                    ? 'text-yellow-400'
                    : isHalfFilled
                    ? 'text-yellow-400'
                    : 'text-gray-600'
                }`}
              >
                ★
                {isHalfFilled && (
                  <span
                    className="absolute inset-0 overflow-hidden text-yellow-400"
                    style={{ width: '50%' }}
                  >
                    ★
                  </span>
                )}
              </span>
            </button>
          );
        })}
      </div>

      {showValue && (
        <span className={`text-[var(--gaming-light)] ${
          size === 'sm' ? 'text-sm' : size === 'md' ? 'text-base' : 'text-lg'
        }`}>
          {currentRating.toFixed(1)}
        </span>
      )}
    </div>
  );
}