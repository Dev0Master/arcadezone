"use client";

import { useState } from 'react';
import StarRating from './StarRating';

interface ReviewFormProps {
  gameId: string;
  onReviewSubmit: (review: {
    userName: string;
    rating: number;
    reviewText: string;
  }) => Promise<void>;
  initialData?: {
    userName?: string;
    rating?: number;
    reviewText?: string;
  };
  submitButtonText?: string;
  className?: string;
}

export default function ReviewForm({
  gameId,
  onReviewSubmit,
  initialData = {},
  submitButtonText = 'Submit Review',
  className = '',
}: ReviewFormProps) {
  const [formData, setFormData] = useState({
    userName: initialData.userName || '',
    rating: initialData.rating || 5,
    reviewText: initialData.reviewText || '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleRatingChange = (rating: number) => {
    setFormData({ ...formData, rating });
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!formData.userName.trim()) {
      setError('Please enter your name');
      return;
    }

    if (!formData.reviewText.trim()) {
      setError('Please write a review');
      return;
    }

    if (formData.reviewText.trim().length < 10) {
      setError('Review must be at least 10 characters long');
      return;
    }

    setIsSubmitting(true);

    try {
      await onReviewSubmit({
        userName: formData.userName.trim(),
        rating: formData.rating,
        reviewText: formData.reviewText.trim(),
      });

      // Reset form on success
      setFormData({
        userName: '',
        rating: 5,
        reviewText: '',
      });
    } catch (err) {
      setError('Failed to submit review. Please try again.');
      console.error('Review submission error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (
    field: 'userName' | 'reviewText',
    value: string
  ) => {
    setFormData({ ...formData, [field]: value });
    setError('');
  };

  return (
    <div className={`game-card p-6 ${className}`}>
      <h3 className="text-xl font-bold text-[var(--foreground)] mb-4">
        Write a Review
      </h3>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Error Message */}
        {error && (
          <div className="p-3 bg-[var(--gaming-danger)]/20 border border-[var(--gaming-danger)] text-[var(--gaming-danger)] rounded-lg">
            {error}
          </div>
        )}

        {/* Name Field */}
        <div>
          <label htmlFor="userName" className="block text-sm font-medium text-[var(--gaming-light)] mb-2">
            Your Name *
          </label>
          <input
            id="userName"
            type="text"
            value={formData.userName}
            onChange={(e) => handleInputChange('userName', e.target.value)}
            placeholder="Enter your name"
            className="input-field"
            maxLength={100}
            required
          />
        </div>

        {/* Rating Field */}
        <div>
          <label className="block text-sm font-medium text-[var(--gaming-light)] mb-2">
            Rating *
          </label>
          <StarRating
            rating={formData.rating}
            onRatingChange={handleRatingChange}
            size="lg"
            showValue
          />
          <p className="text-xs text-[var(--gaming-light)] mt-1">
            Click to rate (1-5 stars)
          </p>
        </div>

        {/* Review Text Field */}
        <div>
          <label htmlFor="reviewText" className="block text-sm font-medium text-[var(--gaming-light)] mb-2">
            Your Review *
          </label>
          <textarea
            id="reviewText"
            value={formData.reviewText}
            onChange={(e) => handleInputChange('reviewText', e.target.value)}
            placeholder="Share your thoughts about this game..."
            className="input-field h-32 resize-none"
            maxLength={1000}
            required
          />
          <p className="text-xs text-[var(--gaming-light)] mt-1">
            {formData.reviewText.length}/1000 characters
          </p>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full btn btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Submitting...' : submitButtonText}
        </button>

        {/* Review Guidelines */}
        <div className="text-xs text-[var(--gaming-light)] border-t border-[var(--gaming-light)]/20 pt-4">
          <p className="mb-1">Review Guidelines:</p>
          <ul className="list-disc list-inside space-y-1">
            <li>Be respectful and constructive</li>
            <li>Focus on gameplay, graphics, and overall experience</li>
            <li>Avoid spoilers when possible</li>
            <li>Reviews require admin approval before appearing</li>
          </ul>
        </div>
      </form>
    </div>
  );
}