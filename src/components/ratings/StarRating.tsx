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
    lg: 'text-4xl',
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
    <div className={`flex items-center gap-3 ${className}`}>
      <div className="flex items-center gap-0.5">
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
              className={`${sizeClasses[size]} transition-all duration-200 ${
                readonly
                  ? 'cursor-default'
                  : 'cursor-pointer hover:scale-125 transform'
              }`}
              title={readonly ? `${currentRating} نجوم` : `قيم ${starValue} نجوم`}
            >
              <span
                className={`relative inline-block transition-all duration-300 ${
                  isFilled
                    ? 'text-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.5)]'
                    : isHalfFilled
                    ? 'text-yellow-400/50'
                    : 'text-gray-600 hover:text-gray-500'
                } ${!readonly && hoverRating >= starValue ? 'scale-110' : ''}`}
              >
                ★
                {isHalfFilled && (
                  <span
                    className="absolute inset-0 overflow-hidden text-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.5)]"
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
        <span className={`font-bold ${
          size === 'lg' ? 'text-2xl' : size === 'md' ? 'text-lg' : 'text-base'
        } text-yellow-400`}>
          {(hoverRating || currentRating).toFixed(1)}
        </span>
      )}
    </div>
  );
}