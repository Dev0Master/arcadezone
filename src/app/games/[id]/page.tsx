"use client";

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Game, Review } from '@/lib/types';
import StarRating from '@/components/ratings/StarRating';
import ReviewForm from '@/components/ratings/ReviewForm';
import ReviewList from '@/components/ratings/ReviewList';

export default function GameDetailPage() {
  const [game, setGame] = useState<Game | null>(null);
  const [loading, setLoading] = useState(true);
  const [reviewSubmitted, setReviewSubmitted] = useState(false);
  const params = useParams();
  const router = useRouter();

  useEffect(() => {
    if (params.id) {
      fetchGameData();
    }
  }, [params.id]);

  const fetchGameData = async () => {
    try {
      const response = await fetch(`/api/games/${params.id}`);
      if (response.ok) {
        const data = await response.json();
        setGame(data.game);
      } else {
        router.push('/');
      }
    } catch (error) {
      console.error('Error fetching game:', error);
      router.push('/');
    } finally {
      setLoading(false);
    }
  };

  const handleReviewSubmit = async (reviewData: {
    userName: string;
    rating: number;
    reviewText: string;
  }) => {
    const response = await fetch(`/api/games/${params.id}/reviews`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        gameId: params.id,
        ...reviewData,
        approved: false, // Reviews need admin approval
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to submit review');
    }

    setReviewSubmitted(true);
    setTimeout(() => setReviewSubmitted(false), 5000);
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="text-2xl font-semibold text-[var(--gaming-primary)]">جارٍ تحميل اللعبة...</div>
      </div>
    );
  }

  if (!game) {
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-[var(--foreground)] mb-4">اللعبة غير موجودة</h1>
          <button onClick={() => router.push('/')} className="btn btn-primary">
            العودة للألعاب
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col p-4">
      <div className="mb-6">
        <button
          onClick={() => router.push('/')}
          className="text-[var(--gaming-primary)] hover:text-[var(--gaming-accent)] flex items-center gap-2"
        >
          → العودة للألعاب
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Game Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Game Header */}
          <div className="game-card p-6">
            <div className="flex flex-col md:flex-row gap-6">
              {game.imageUrl && (
                <img
                  src={game.imageUrl}
                  alt={game.title}
                  className="w-full md:w-64 h-48 object-cover rounded-lg"
                />
              )}
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-[var(--foreground)] mb-2">{game.title}</h1>
                {game.categories && game.categories.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {game.categories.map((category) => (
                      <span
                        key={category.id}
                        className="px-3 py-1 bg-[var(--gaming-primary)] text-white text-sm rounded-full"
                      >
                        {category.name}
                      </span>
                    ))}
                  </div>
                )}
                {game.averageRating && (
                  <div className="flex items-center gap-3 mb-4">
                    <StarRating rating={game.averageRating} readonly showValue />
                    <span className="text-[var(--gaming-light)]">
                      ({game.totalRatings} {game.totalRatings !== 1 ? 'مراجعة' : 'مراجعة'})
                    </span>
                  </div>
                )}
                <p className="text-[var(--gaming-light)] leading-relaxed">
                  {game.description}
                </p>
              </div>
            </div>
          </div>

          {/* Reviews Section */}
          <div>
            <h2 className="text-2xl font-bold text-[var(--foreground)] mb-6">المراجعات</h2>

            {/* Success Message */}
            {reviewSubmitted && (
              <div className="mb-6 p-4 bg-green-500/20 border border-green-500 text-green-600 rounded-lg">
                تم إرسال المراجعة بنجاح! ستظهر بعد موافقة المشرف.
              </div>
            )}

            {/* Review Form */}
            <div className="mb-8">
              <ReviewForm
                gameId={params.id as string}
                onReviewSubmit={handleReviewSubmit}
              />
            </div>

            {/* Reviews List */}
            <ReviewList gameId={params.id as string} />
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Game Info Card */}
          <div className="game-card p-6">
            <h3 className="text-lg font-bold text-[var(--foreground)] mb-4">معلومات اللعبة</h3>
            <div className="space-y-3">
              <div>
                <span className="text-[var(--gaming-light)]">تاريخ الإصدار:</span>
                <span className="mr-2 text-[var(--foreground)]">
                  {new Date(game.createdAt).toLocaleDateString()}
                </span>
              </div>
              {game.categories && game.categories.length > 0 && (
                <div>
                  <span className="text-[var(--gaming-light)]">الفئات:</span>
                  <div className="mt-1 flex flex-wrap gap-1">
                    {game.categories.map((category) => (
                      <span
                        key={category.id}
                        className="text-xs px-2 py-1 bg-[var(--gaming-card-hover)] text-[var(--foreground)] rounded"
                      >
                        {category.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Rating Summary */}
          {game.averageRating && (
            <div className="game-card p-6">
              <h3 className="text-lg font-bold text-[var(--foreground)] mb-4">ملخص التقييم</h3>
              <div className="text-center">
                <div className="text-4xl font-bold text-[var(--gaming-primary)] mb-2">
                  {game.averageRating.toFixed(1)}
                </div>
                <div className="flex justify-center mb-2">
                  <StarRating rating={game.averageRating} readonly size="md" />
                </div>
                <p className="text-[var(--gaming-light)]">
                  بناءً على {game.totalRatings} {game.totalRatings !== 1 ? 'مراجعة' : 'مراجعة'}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}