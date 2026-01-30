"use client";

import { useState, useEffect } from 'react';
import ReviewList from '@/components/ratings/ReviewList';
import { Review } from '@/lib/types';

interface ReviewWithGame extends Review {
  gameTitle?: string;
}

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<ReviewWithGame[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved'>('pending');

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

      setReviews(reviews.map(review =>
        review.id === reviewId ? { ...review, approved: true } : review
      ));
    } catch (error) {
      console.error('Error approving review:', error);
      alert('فشل في الموافقة على المراجعة');
    }
  };

  const handleReject = async (reviewId: string) => {
    if (!confirm('هل أنت متأكد من حذف هذه المراجعة؟ هذا الإجراء لا يمكن التراجع عنه.')) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/reviews/${reviewId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete review');
      }

      setReviews(reviews.filter(review => review.id !== reviewId));
    } catch (error) {
      console.error('Error deleting review:', error);
      alert('فشل في حذف المراجعة');
    }
  };

  const handleReply = async (reviewId: string, reply: string) => {
    console.log('Reply functionality not implemented yet');
  };

  const getPendingCount = () => reviews.filter(r => !r.approved).length;
  const getApprovedCount = () => reviews.filter(r => r.approved).length;

  // Filter reviews based on selected tab
  const filteredReviews = reviews.filter(review => {
    if (filter === 'pending') return !review.approved;
    if (filter === 'approved') return review.approved;
    return true; // 'all'
  });

  return (
    <>
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-[var(--foreground)] mb-2">إشراف المراجعات</h2>
        <p className="text-[var(--gaming-light)]">
          إدارة ومراجعة مراجعات المستخدمين لجميع الألعاب
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="game-card p-6 text-center">
          <div className="text-3xl font-bold text-[var(--foreground)] mb-1">
            {reviews.length}
          </div>
          <p className="text-[var(--gaming-light)]">إجمالي المراجعات</p>
        </div>
        <div className="game-card p-6 text-center">
          <div className="text-3xl font-bold text-yellow-400 mb-1">
            {getPendingCount()}
          </div>
          <p className="text-[var(--gaming-light)]">في انتظار الموافقة</p>
        </div>
        <div className="game-card p-6 text-center">
          <div className="text-3xl font-bold text-green-400 mb-1">
            {getApprovedCount()}
          </div>
          <p className="text-[var(--gaming-light)]">موافق عليها</p>
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
            في الانتظار ({getPendingCount()})
          </button>
          <button
            onClick={() => setFilter('approved')}
            className={`pb-3 px-1 border-b-2 transition-colors ${
              filter === 'approved'
                ? 'border-[var(--gaming-primary)] text-[var(--gaming-primary)]'
                : 'border-transparent text-[var(--gaming-light)] hover:text-[var(--foreground)]'
            }`}
          >
            الموافق عليها ({getApprovedCount()})
          </button>
          <button
            onClick={() => setFilter('all')}
            className={`pb-3 px-1 border-b-2 transition-colors ${
              filter === 'all'
                ? 'border-[var(--gaming-primary)] text-[var(--gaming-primary)]'
                : 'border-transparent text-[var(--gaming-light)] hover:text-[var(--foreground)]'
            }`}
          >
            الكل ({reviews.length})
          </button>
        </div>
      </div>

      {/* Reviews List */}
      {loading ? (
        <div className="game-card p-12 text-center">
          <div className="w-8 h-8 border-4 border-[var(--gaming-primary)] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-[var(--gaming-light)]">جارٍ تحميل المراجعات...</p>
        </div>
      ) : reviews.length === 0 ? (
        <div className="game-card p-12 text-center">
          <h3 className="text-xl font-bold text-[var(--foreground)] mb-2">
            {filter === 'pending' ? 'لا توجد مراجعات في الانتظار' : 'لا توجد مراجعات'}
          </h3>
          <p className="text-[var(--gaming-light)]">
            {filter === 'pending'
              ? 'جميع المراجعات تمت مراجعتها والموافقة عليها.'
              : 'لا توجد مراجعات تطابق الفلتر المحدد.'}
          </p>
        </div>
      ) : (
        <ReviewList
          reviews={filteredReviews}
          adminMode={true}
          onApprove={handleApprove}
          onReject={handleReject}
          onReply={handleReply}
        />
      )}
    </>
  );
}
