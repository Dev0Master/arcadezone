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
    <div className={className}>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Error Message */}
        {error && (
          <div className="p-4 rounded-xl bg-[var(--gaming-danger)]/10 border border-[var(--gaming-danger)]/30 text-[var(--gaming-danger)] flex items-center gap-3">
            <span className="text-xl">⚠️</span>
            <span>{error}</span>
          </div>
        )}

        {/* Name Field */}
        <div>
          <label htmlFor="userName" className="block text-sm font-semibold text-white mb-3 flex items-center gap-2">
            <span>👤</span>
            اسمك
          </label>
          <input
            id="userName"
            type="text"
            value={formData.userName}
            onChange={(e) => handleInputChange('userName', e.target.value)}
            placeholder="أدخل اسمك"
            className="w-full px-5 py-4 rounded-xl bg-[var(--gaming-dark)]/50 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-[var(--gaming-primary)] focus:ring-2 focus:ring-[var(--gaming-primary)]/20 transition-all duration-300"
            maxLength={100}
            required
          />
        </div>

        {/* Rating Field */}
        <div>
          <label className="block text-sm font-semibold text-white mb-3 flex items-center gap-2">
            <span>⭐</span>
            تقييمك
          </label>
          <div className="p-5 rounded-xl bg-[var(--gaming-dark)]/50 border border-white/10">
            <StarRating
              rating={formData.rating}
              onRatingChange={handleRatingChange}
              size="lg"
              showValue
            />
            <p className="text-xs text-[var(--gaming-light)]/50 mt-3">
              انقر على النجوم لاختيار تقييمك
            </p>
          </div>
        </div>

        {/* Review Text Field */}
        <div>
          <label htmlFor="reviewText" className="block text-sm font-semibold text-white mb-3 flex items-center gap-2">
            <span>📝</span>
            مراجعتك
          </label>
          <textarea
            id="reviewText"
            value={formData.reviewText}
            onChange={(e) => handleInputChange('reviewText', e.target.value)}
            placeholder="شارك تجربتك مع هذه اللعبة... ما الذي أعجبك؟ ما الذي يمكن تحسينه؟"
            className="w-full px-5 py-4 rounded-xl bg-[var(--gaming-dark)]/50 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-[var(--gaming-primary)] focus:ring-2 focus:ring-[var(--gaming-primary)]/20 transition-all duration-300 h-36 resize-none"
            maxLength={1000}
            required
          />
          <div className="flex items-center justify-between mt-2">
            <p className="text-xs text-[var(--gaming-light)]/50">
              الحد الأدنى 10 أحرف
            </p>
            <p className={`text-xs ${formData.reviewText.length > 900 ? 'text-[var(--gaming-warning)]' : 'text-[var(--gaming-light)]/50'}`}>
              {formData.reviewText.length}/1000
            </p>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-4 rounded-xl bg-gradient-to-r from-[var(--gaming-primary)] to-[var(--gaming-secondary)] text-white font-bold text-lg hover:shadow-lg hover:shadow-[var(--gaming-primary)]/30 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none flex items-center justify-center gap-3"
        >
          {isSubmitting ? (
            <>
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>جارٍ الإرسال...</span>
            </>
          ) : (
            <>
              <span>🚀</span>
              <span>{submitButtonText}</span>
            </>
          )}
        </button>

        {/* Review Guidelines */}
        <div className="p-5 rounded-xl bg-[var(--gaming-primary)]/5 border border-[var(--gaming-primary)]/10">
          <p className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
            <span>💡</span>
            إرشادات المراجعة
          </p>
          <ul className="space-y-2 text-sm text-[var(--gaming-light)]/60">
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--gaming-primary)]" />
              كن محترماً وبناءاً في مراجعتك
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--gaming-secondary)]" />
              ركز على تجربة اللعب والرسومات والقصة
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--gaming-accent)]" />
              تجنب حرق الأحداث المهمة
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-yellow-400" />
              المراجعات تحتاج موافقة المشرف للظهور
            </li>
          </ul>
        </div>
      </form>
    </div>
  );
}