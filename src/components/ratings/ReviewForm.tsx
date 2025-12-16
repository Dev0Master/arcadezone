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
  submitButtonText = 'إرسال المراجعة',
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
      setError('يرجى إدخال اسمك');
      return;
    }

    if (!formData.reviewText.trim()) {
      setError('يرجى كتابة مراجعة');
      return;
    }

    if (formData.reviewText.trim().length < 10) {
      setError('يجب أن تكون المراجعة 10 أحرف على الأقل');
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
      setError('فشل في إرسال المراجعة. يرجى المحاولة مرة أخرى.');
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
        اكتب مراجعة
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
            اسمك *
          </label>
          <input
            id="userName"
            type="text"
            value={formData.userName}
            onChange={(e) => handleInputChange('userName', e.target.value)}
            placeholder="أدخل اسمك"
            className="input-field"
            maxLength={100}
            required
          />
        </div>

        {/* Rating Field */}
        <div>
          <label className="block text-sm font-medium text-[var(--gaming-light)] mb-2">
            التقييم *
          </label>
          <StarRating
            rating={formData.rating}
            onRatingChange={handleRatingChange}
            size="lg"
            showValue
          />
          <p className="text-xs text-[var(--gaming-light)] mt-1">
            انقر للتقييم (1-5 نجوم)
          </p>
        </div>

        {/* Review Text Field */}
        <div>
          <label htmlFor="reviewText" className="block text-sm font-medium text-[var(--gaming-light)] mb-2">
            مراجعتك *
          </label>
          <textarea
            id="reviewText"
            value={formData.reviewText}
            onChange={(e) => handleInputChange('reviewText', e.target.value)}
            placeholder="شارك أفكارك حول هذه اللعبة..."
            className="input-field h-32 resize-none"
            maxLength={1000}
            required
          />
          <p className="text-xs text-[var(--gaming-light)] mt-1">
            {formData.reviewText.length}/1000 حرف
          </p>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full btn btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'جارٍ الإرسال...' : submitButtonText}
        </button>

        {/* Review Guidelines */}
        <div className="text-xs text-[var(--gaming-light)] border-t border-[var(--gaming-light)]/20 pt-4">
          <p className="mb-1">إرشادات المراجعة:</p>
          <ul className="list-disc list-inside space-y-1 text-right">
            <li>كن محترماً وبناءاً</li>
            <li>ركز على اللعب، الرسومات، والتجربة العامة</li>
            <li>تجنب الحرقلة عند الإمكان</li>
            <li>المراجعات تتطلب موافقة المشرف قبل الظهور</li>
          </ul>
        </div>
      </form>
    </div>
  );
}