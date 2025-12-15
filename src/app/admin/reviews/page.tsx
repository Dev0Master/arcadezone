"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ReviewList from '@/components/ratings/ReviewList';
import { Review } from '@/lib/types';

interface ReviewWithGame extends Review {
  gameTitle?: string;
}

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<ReviewWithGame[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved'>('pending');
  const router = useRouter();

  useEffect(() => {
    fetchReviews();
  }, [filter]);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (filter !== 'all') {
        params.set('status', filter);
      }

      const response = await fetch(`/api/admin/reviews?${params.toString()}`);
      if (!response.ok) {
        throw new Error('Failed to fetch reviews');
      }

      const data = await response.json();
      setReviews(data.reviews || []);
    } catch (error) {
      console.error('Error fetching reviews:', error);
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
    } catch (error) {
      console.error('Error approving review:', error);
      alert('Failed to approve review');
    }
  };

  const handleReject = async (reviewId: string) => {
    if (!confirm('Are you sure you want to delete this review? This action cannot be undone.')) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/reviews/${reviewId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete review');
      }

      // Remove from local state
      setReviews(reviews.filter(review => review.id !== reviewId));
    } catch (error) {
      console.error('Error deleting review:', error);
      alert('Failed to delete review');
    }
  };

  const handleReply = async (reviewId: string, reply: string) => {
    // This would need to be implemented
    console.log('Reply functionality not implemented yet');
  };

  const getPendingCount = () => reviews.filter(r => !r.approved).length;
  const getApprovedCount = () => reviews.filter(r => r.approved).length;

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="text-2xl font-semibold text-[var(--gaming-primary)]">Loading reviews...</div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <div className="w-64 gaming-sidebar">
        <div className="p-4 border-b border-[var(--gaming-light)]/30">
          <h1 className="text-xl font-bold text-[var(--gaming-primary)]">Admin Panel</h1>
        </div>
        <nav className="p-4">
          <ul className="space-y-2">
            <li>
              <a href="/admin/dashboard" className="block p-2 text-[var(--gaming-light)] hover:bg-[var(--gaming-card-hover)] rounded">
                Dashboard
              </a>
            </li>
            <li>
              <a href="/admin/games/new" className="block p-2 text-[var(--gaming-light)] hover:bg-[var(--gaming-card-hover)] rounded">
                Add New Game
              </a>
            </li>
            <li>
              <a href="/admin/reviews" className="block p-2 text-[var(--gaming-primary)] font-bold">
                Reviews Management
              </a>
            </li>
            <li>
              <a href="/admin/categories" className="block p-2 text-[var(--gaming-light)] hover:bg-[var(--gaming-card-hover)] rounded">
                Categories
              </a>
            </li>
            <li>
              <button
                onClick={() => router.push('/login')}
                className="w-full text-left p-2 text-[var(--gaming-light)] hover:bg-[var(--gaming-card-hover)] rounded"
              >
                Logout
              </button>
            </li>
          </ul>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6 bg-[var(--background)]">
        {/* Header */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-[var(--foreground)] mb-2">Review Moderation</h2>
          <p className="text-[var(--gaming-light)]">
            Manage and moderate user reviews for all games
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="game-card p-6 text-center">
            <div className="text-3xl font-bold text-[var(--foreground)] mb-1">
              {reviews.length}
            </div>
            <p className="text-[var(--gaming-light)]">Total Reviews</p>
          </div>
          <div className="game-card p-6 text-center">
            <div className="text-3xl font-bold text-yellow-400 mb-1">
              {getPendingCount()}
            </div>
            <p className="text-[var(--gaming-light)]">Pending Approval</p>
          </div>
          <div className="game-card p-6 text-center">
            <div className="text-3xl font-bold text-green-400 mb-1">
              {getApprovedCount()}
            </div>
            <p className="text-[var(--gaming-light)]">Approved</p>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="mb-6 border-b border-[var(--gaming-light)]/20">
          <div className="flex gap-6">
            <button
              onClick={() => setFilter('pending')}
              className={`pb-3 px-1 border-b-2 transition-colors ${
                filter === 'pending'
                  ? 'border-[var(--gaming-primary)] text-[var(--gaming-primary)]'
                  : 'border-transparent text-[var(--gaming-light)] hover:text-[var(--foreground)]'
              }`}
            >
              Pending ({getPendingCount()})
            </button>
            <button
              onClick={() => setFilter('approved')}
              className={`pb-3 px-1 border-b-2 transition-colors ${
                filter === 'approved'
                  ? 'border-[var(--gaming-primary)] text-[var(--gaming-primary)]'
                  : 'border-transparent text-[var(--gaming-light)] hover:text-[var(--foreground)]'
              }`}
            >
              Approved ({getApprovedCount()})
            </button>
            <button
              onClick={() => setFilter('all')}
              className={`pb-3 px-1 border-b-2 transition-colors ${
                filter === 'all'
                  ? 'border-[var(--gaming-primary)] text-[var(--gaming-primary)]'
                  : 'border-transparent text-[var(--gaming-light)] hover:text-[var(--foreground)]'
              }`}
            >
              All ({reviews.length})
            </button>
          </div>
        </div>

        {/* Reviews List */}
        {reviews.length === 0 ? (
          <div className="game-card p-12 text-center">
            <h3 className="text-xl font-bold text-[var(--foreground)] mb-2">
              {filter === 'pending' ? 'No Pending Reviews' : 'No Reviews Found'}
            </h3>
            <p className="text-[var(--gaming-light)]">
              {filter === 'pending'
                ? 'All reviews have been reviewed and approved.'
                : 'No reviews match the selected filter.'}
            </p>
          </div>
        ) : (
          <ReviewList
            adminMode={true}
            onApprove={handleApprove}
            onReject={handleReject}
            onReply={handleReply}
          />
        )}
      </div>
    </div>
  );
}