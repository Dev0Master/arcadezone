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
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(new Date(date));
  };

  return (
    <div className="game-card p-6">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          {showGameTitle && gameTitle && (
            <h4 className="text-sm font-semibold text-[var(--gaming-primary)] mb-1">
              {gameTitle}
            </h4>
          )}
          <div className="flex items-center gap-3 mb-2">
            <span className="font-semibold text-[var(--foreground)]">
              {review.userName}
            </span>
            <StarRating rating={review.rating} readonly size="sm" />
            {!review.approved && (
              <span className="px-2 py-1 bg-yellow-500/20 text-yellow-600 text-xs rounded-full">
                Pending Approval
              </span>
            )}
          </div>
          <p className="text-sm text-[var(--gaming-light)]">
            {formatDate(review.createdAt)}
          </p>
        </div>

        {/* Admin Actions */}
        {showActions && (
          <div className="flex gap-2">
            {!review.approved && (
              <>
                <button
                  onClick={() => onApprove?.(review.id)}
                  className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white text-sm rounded transition-colors"
                >
                  Approve
                </button>
                <button
                  onClick={() => onReject?.(review.id)}
                  className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-sm rounded transition-colors"
                >
                  Reject
                </button>
              </>
            )}
            <button
              onClick={() => setShowReplyForm(!showReplyForm)}
              className="px-3 py-1 bg-[var(--gaming-primary)] hover:bg-[var(--gaming-accent)] text-white text-sm rounded transition-colors"
            >
              Reply
            </button>
          </div>
        )}
      </div>

      {/* Review Text */}
      <div className="mb-4">
        <p className="text-[var(--foreground)] leading-relaxed">
          {review.reviewText}
        </p>
      </div>

      {/* Reply Section */}
      {showReplyForm && (
        <div className="border-t border-[var(--gaming-light)]/20 pt-4">
          <textarea
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            placeholder="Write a reply to this review..."
            className="w-full px-3 py-2 bg-[var(--gaming-dark)] border border-[var(--gaming-light)]/30 rounded-lg text-[var(--foreground)] placeholder-[var(--gaming-light)] focus:outline-none focus:border-[var(--gaming-primary)] resize-none h-24 mb-3"
          />
          <div className="flex gap-2">
            <button
              onClick={handleReply}
              disabled={!replyText.trim() || isSubmitting}
              className="px-4 py-2 bg-[var(--gaming-primary)] hover:bg-[var(--gaming-accent)] disabled:opacity-50 disabled:cursor-not-allowed text-white rounded transition-colors"
            >
              {isSubmitting ? 'Posting...' : 'Post Reply'}
            </button>
            <button
              onClick={() => {
                setShowReplyForm(false);
                setReplyText('');
              }}
              className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}