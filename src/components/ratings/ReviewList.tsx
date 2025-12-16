"use client";

import { useState, useEffect } from 'react';
import { Review } from '@/lib/types';
import ReviewCard from './ReviewCard';

interface ReviewListProps {
  gameId?: string;
  showAllReviews?: boolean;
  adminMode?: boolean;
  onApprove?: (reviewId: string) => void;
  onReject?: (reviewId: string) => void;
  onReply?: (reviewId: string, reply: string) => void;
  className?: string;
}

export default function ReviewList({
  gameId,
  showAllReviews = false,
  adminMode = false,
  onApprove,
  onReject,
  onReply,
  className = '',
}: ReviewListProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'highest' | 'lowest'>('newest');

  useEffect(() => {
    fetchReviews();
  }, [gameId, adminMode, sortBy]);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      setError('');

      let url;
      if (adminMode) {
        // In admin mode, fetch all reviews (including unapproved)
        url = '/api/admin/reviews';
      } else if (gameId) {
        // In game detail mode, fetch reviews for specific game
        url = `/api/games/${gameId}/reviews`;
      } else {
        return;
      }

      const params = new URLSearchParams();
      if (adminMode || gameId) {
        params.set('sort', sortBy);
      }

      const response = await fetch(`${url}?${params.toString()}`);
      if (!response.ok) {
        throw new Error('Failed to fetch reviews');
      }

      const data = await response.json();
      setReviews(data.reviews || []);
    } catch (err) {
      setError('Unable to load reviews. Please try again later.');
      console.error('Error fetching reviews:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (reviewId: string) => {
    try {
      const response = await fetch(`/api/admin/reviews/${reviewId}/approve`, {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error('Failed to approve review');
      }

      // Update local state
      setReviews(reviews.map(review =>
        review.id === reviewId ? { ...review, approved: true } : review
      ));

      onApprove?.(reviewId);
    } catch (err) {
      console.error('Error approving review:', err);
      alert('Failed to approve review');
    }
  };

  const handleReject = async (reviewId: string) => {
    if (!confirm('Are you sure you want to reject this review? This action cannot be undone.')) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/reviews/${reviewId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to reject review');
      }

      // Remove from local state
      setReviews(reviews.filter(review => review.id !== reviewId));
      onReject?.(reviewId);
    } catch (err) {
      console.error('Error rejecting review:', err);
      alert('Failed to reject review');
    }
  };

  const handleReply = async (reviewId: string, reply: string) => {
    // This would need to be implemented on the backend
    console.log('Reply to review:', reviewId, reply);
    onReply?.(reviewId, reply);
  };

  const getAverageRating = () => {
    if (reviews.length === 0) return 0;
    const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
    return sum / reviews.length;
  };

  const getRatingDistribution = () => {
    const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    reviews.forEach(review => {
      distribution[review.rating as keyof typeof distribution]++;
    });
    return distribution;
  };

  if (loading) {
    return (
      <div className={`space-y-4 ${className}`}>
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="game-card p-6 animate-pulse">
            <div className="h-4 bg-gray-700 rounded w-1/4 mb-2"></div>
            <div className="h-3 bg-gray-700 rounded w-1/6 mb-3"></div>
            <div className="h-16 bg-gray-700 rounded mb-2"></div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className={`game-card p-6 text-center ${className}`}>
        <p className="text-[var(--gaming-danger)]">{error}</p>
        <button
          onClick={fetchReviews}
          className="mt-4 btn btn-primary"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (reviews.length === 0) {
    return (
      <div className={`game-card p-8 text-center ${className}`}>
        <p className="text-[var(--gaming-light)]">
          {adminMode
            ? 'No reviews yet. Reviews will appear here once users start rating games.'
            : gameId
            ? 'No reviews yet. Be the first to review this game!'
            : 'No reviews found.'}
        </p>
      </div>
    );
  }

  const averageRating = getAverageRating();
  const distribution = getRatingDistribution();

  return (
    <div className={className}>
      {/* Rating Summary */}
      {!adminMode && gameId && (
        <div className="game-card p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="text-3xl font-bold text-[var(--gaming-primary)] mb-1">
                {averageRating.toFixed(1)}
              </div>
              <p className="text-[var(--gaming-light)]">
                بناءً على {reviews.length} {reviews.length !== 1 ? 'مراجعة' : 'مراجعة'}
              </p>
            </div>
            <div className="text-left">
              <div className="text-sm text-[var(--gaming-light)] mb-1">ترتيب حسب:</div>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-3 py-1 bg-[var(--gaming-dark)] border border-[var(--gaming-light)]/30 rounded text-[var(--foreground)]"
              >
                <option value="newest">الأحدث أولاً</option>
                <option value="oldest">الأقدم أولاً</option>
                <option value="highest">الأعلى تقييماً</option>
                <option value="lowest">الأقل تقييماً</option>
              </select>
            </div>
          </div>

          {/* Rating Distribution */}
          <div className="space-y-2">
            {Object.entries(distribution)
              .sort((a, b) => Number(b[0]) - Number(a[0]))
              .map(([stars, count]) => (
                <div key={stars} className="flex items-center gap-2">
                  <span className="text-sm text-[var(--gaming-light)] w-12">
                    {stars} ★
                  </span>
                  <div className="flex-1 bg-[var(--gaming-dark)] rounded-full h-2">
                    <div
                      className="bg-[var(--gaming-primary)] h-2 rounded-full"
                      style={{
                        width: `${reviews.length > 0 ? (count / reviews.length) * 100 : 0}%`,
                      }}
                    ></div>
                  </div>
                  <span className="text-sm text-[var(--gaming-light)] w-8 text-right">
                    {count}
                  </span>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Reviews List */}
      <div className="space-y-4">
        {reviews.map((review) => (
          <ReviewCard
            key={review.id}
            review={review}
            showActions={adminMode}
            onApprove={handleApprove}
            onReject={handleReject}
            onReply={handleReply}
          />
        ))}
      </div>

      {/* Load More Button */}
      {!showAllReviews && !adminMode && reviews.length > 0 && (
        <div className="text-center mt-6">
          <button className="btn btn-outline">
            Load More Reviews
          </button>
        </div>
      )}
    </div>
  );
}