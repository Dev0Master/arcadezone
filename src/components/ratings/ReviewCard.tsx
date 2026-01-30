"use client";

import { useState } from 'react';
import { Review } from '@/lib/types';
import StarRating from './StarRating';

interface ReviewCardProps {
  review: Review;
  showGameTitle?: boolean;
  gameTitle?: string;
  onApprove?: (reviewId: string) => void;
  onReject?: (reviewId: string) => void;
  onReply?: (reviewId: string, reply: string) => void;
  showActions?: boolean;
}

export default function ReviewCard({
  review,
  showGameTitle = false,
  gameTitle,
  onApprove,
  onReject,
  onReply,
  showActions = false,
}: ReviewCardProps) {
  const [replyText, setReplyText] = useState('');
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleReply = async () => {
    if (!replyText.trim() || !onReply) return;

    setIsSubmitting(true);
    try {
      await onReply(review.id, replyText);
      setReplyText('');
      setShowReplyForm(false);
    } catch (error) {
      console.error('Error submitting reply:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('ar-SA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(new Date(date));
  };

  // Generate avatar initials
  const getInitials = () => {
    return review.userName
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  // Generate random gradient based on name
  const getAvatarGradient = () => {
    const gradients = [
      'from-[var(--gaming-primary)] to-[var(--gaming-secondary)]',
      'from-[var(--gaming-secondary)] to-[var(--gaming-accent)]',
      'from-[var(--gaming-accent)] to-[var(--gaming-primary)]',
      'from-purple-500 to-pink-500',
      'from-cyan-500 to-blue-500',
      'from-orange-500 to-red-500',
    ];
    const index = review.userName.charCodeAt(0) % gradients.length;
    return gradients[index];
  };

  return (
    <div className="group relative p-4 rounded-xl sm:p-6 sm:rounded-2xl bg-gradient-to-b from-[var(--gaming-card-bg)]/50 to-transparent border border-white/5 hover:border-[var(--gaming-primary)]/20 transition-all duration-300">
      {/* Hover Glow */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-[var(--gaming-primary)]/5 to-[var(--gaming-secondary)]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      <div className="relative">
        {/* Header */}
        <div className="flex items-start justify-between mb-5">
          <div className="flex-1">
            {showGameTitle && gameTitle && (
              <h4 className="text-sm font-semibold text-[var(--gaming-primary)] mb-3 flex items-center gap-2">
                <span>🎮</span>
                {gameTitle}
              </h4>
            )}
            <div className="flex items-center gap-4">
              {/* Avatar */}
              <div className={`w-10 h-10 rounded-lg sm:w-14 sm:h-14 sm:rounded-2xl bg-gradient-to-br ${getAvatarGradient()} flex items-center justify-center text-white font-bold text-sm sm:text-lg shadow-lg`}>
                {getInitials()}
              </div>
              
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-1.5">
                  <span className="font-bold text-white text-base sm:text-lg">
                    {review.userName}
                  </span>
                  {!review.approved && (
                    <span className="px-2 py-0.5 sm:px-3 sm:py-1 bg-yellow-400/10 text-yellow-400 text-[10px] sm:text-xs rounded-full border border-yellow-400/20 flex items-center gap-1">
                      <span>⏳</span>
                      قيد المراجعة
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <StarRating rating={review.rating} readonly size="sm" />
                  <span className="text-xs sm:text-sm text-[var(--gaming-light)]/50">•</span>
                  <span className="text-xs sm:text-sm text-[var(--gaming-light)]/50">
                    {formatDate(review.createdAt)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Admin Actions */}
          {showActions && (
            <div className="flex gap-2">
              {!review.approved && (
                <>
                  <button
                    onClick={() => onApprove?.(review.id)}
                    className="px-3 py-1.5 rounded-lg sm:px-4 sm:py-2 sm:rounded-xl bg-green-500/10 text-green-400 border border-green-500/20 hover:bg-green-500/20 text-xs sm:text-sm font-medium transition-all duration-300 flex items-center gap-2"
                  >
                    <span>✓</span>
                    موافقة
                  </button>
                  <button
                    onClick={() => onReject?.(review.id)}
                    className="px-3 py-1.5 rounded-lg sm:px-4 sm:py-2 sm:rounded-xl bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 text-xs sm:text-sm font-medium transition-all duration-300 flex items-center gap-2"
                  >
                    <span>✕</span>
                    رفض
                  </button>
                </>
              )}
              <button
                onClick={() => setShowReplyForm(!showReplyForm)}
                className="px-3 py-1.5 rounded-lg sm:px-4 sm:py-2 sm:rounded-xl bg-[var(--gaming-primary)]/10 text-[var(--gaming-primary)] border border-[var(--gaming-primary)]/20 hover:bg-[var(--gaming-primary)]/20 text-xs sm:text-sm font-medium transition-all duration-300 flex items-center gap-2"
              >
                <span>💬</span>
                رد
              </button>
            </div>
          )}
        </div>

        {/* Review Text */}
        <div className="mb-4">
          <p className="text-[var(--gaming-light)]/80 leading-relaxed text-sm sm:text-base">
            {review.reviewText}
          </p>
        </div>

        {/* Reply Section */}
        {showReplyForm && (
          <div className="pt-5 border-t border-white/5">
            <textarea
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder="اكتب رداً على هذه المراجعة..."
              className="w-full px-3 py-3 rounded-lg h-24 text-sm sm:px-5 sm:py-4 sm:rounded-xl sm:h-28 bg-[var(--gaming-dark)]/50 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-[var(--gaming-primary)] focus:ring-2 focus:ring-[var(--gaming-primary)]/20 transition-all duration-300 resize-none mb-4"
            />
            <div className="flex gap-3">
              <button
                onClick={handleReply}
                disabled={!replyText.trim() || isSubmitting}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[var(--gaming-primary)] to-[var(--gaming-secondary)] text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-[var(--gaming-primary)]/30 transition-all duration-300 flex items-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    جارٍ الإرسال...
                  </>
                ) : (
                  <>
                    <span>📤</span>
                    إرسال الرد
                  </>
                )}
              </button>
              <button
                onClick={() => {
                  setShowReplyForm(false);
                  setReplyText('');
                }}
                className="px-5 py-2.5 rounded-xl bg-white/5 text-[var(--gaming-light)] hover:bg-white/10 transition-all duration-300"
              >
                إلغاء
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}