"use client";

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Game, Review } from '@/lib/types';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import StarRating from '@/components/ratings/StarRating';
import ReviewForm from '@/components/ratings/ReviewForm';
import ReviewList from '@/components/ratings/ReviewList';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

export default function GameDetailPage() {
  const [game, setGame] = useState<Game | null>(null);
  const [loading, setLoading] = useState(true);
  const [reviewSubmitted, setReviewSubmitted] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'reviews'>('overview');
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
        approved: false,
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
      <div className="min-h-screen bg-[var(--gaming-dark)]">
        <Header />
        <div className="flex items-center justify-center min-h-screen">
          <LoadingSpinner text="جارٍ تحميل اللعبة..." size="lg" />
        </div>
      </div>
    );
  }

  if (!game) {
    return (
      <div className="min-h-screen bg-[var(--gaming-dark)]">
        <Header />
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center px-6 py-16 rounded-3xl bg-[var(--gaming-card-bg)] max-w-md mx-4">
            <div className="w-20 h-20 rounded-full bg-[var(--gaming-danger)]/20 flex items-center justify-center mx-auto mb-6">
              <span className="text-4xl">😔</span>
            </div>
            <h1 className="text-2xl font-bold text-white mb-4">اللعبة غير موجودة</h1>
            <p className="text-[var(--gaming-light)]/60 mb-8">عذراً، لم نتمكن من العثور على هذه اللعبة</p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-[var(--gaming-primary)] to-[var(--gaming-secondary)] text-white font-semibold hover:shadow-lg hover:shadow-[var(--gaming-primary)]/30 transition-all duration-300"
            >
              <span>العودة للرئيسية</span>
              <span>→</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--gaming-dark)]">
      <Header />
      
      {/* Hero Section with Game Image */}
      <section className="relative pt-20">
        {/* Background Image */}
        <div className="absolute inset-0 h-[60vh]">
          {game.imageUrl ? (
            <img
              src={game.imageUrl}
              alt={game.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-[var(--gaming-primary)]/30 to-[var(--gaming-secondary)]/30" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--gaming-dark)] via-[var(--gaming-dark)]/80 to-[var(--gaming-dark)]/40" />
          <div className="absolute inset-0 bg-gradient-to-r from-[var(--gaming-dark)] via-transparent to-[var(--gaming-dark)]" />
        </div>

        {/* Content */}
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12">
          {/* Breadcrumb */}
          <nav className="mb-8">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-[var(--gaming-light)]/60 hover:text-[var(--gaming-primary)] transition-colors"
            >
              <span>→</span>
              <span>العودة للألعاب</span>
            </Link>
          </nav>

          <div className="flex flex-col lg:flex-row gap-8 items-start">
            {/* Game Cover */}
            <div className="flex-shrink-0">
              <div className="relative w-64 h-80 rounded-2xl overflow-hidden shadow-2xl shadow-[var(--gaming-primary)]/30 group">
                {game.imageUrl ? (
                  <img
                    src={game.imageUrl}
                    alt={game.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-[var(--gaming-card-bg)] to-[var(--gaming-dark)] flex items-center justify-center">
                    <span className="text-6xl opacity-50">🎮</span>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
            </div>

            {/* Game Info */}
            <div className="flex-grow">
              {/* Categories */}
              {game.categories && game.categories.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {game.categories.map((category) => (
                    <span
                      key={category.id}
                      className="px-4 py-1.5 text-sm font-medium rounded-full bg-[var(--gaming-primary)]/20 text-[var(--gaming-primary)] border border-[var(--gaming-primary)]/30"
                    >
                      {category.name}
                    </span>
                  ))}
                </div>
              )}

              {/* Title */}
              <h1 className="text-4xl md:text-5xl font-black text-white mb-4">{game.title}</h1>

              {/* Rating */}
              {game.averageRating && (
                <div className="flex items-center gap-4 mb-6">
                  <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-yellow-400/10 border border-yellow-400/30">
                    <StarRating rating={game.averageRating} readonly size="md" />
                    <span className="text-2xl font-bold text-yellow-400">{game.averageRating.toFixed(1)}</span>
                  </div>
                  <span className="text-[var(--gaming-light)]/60">
                    ({game.totalRatings} {game.totalRatings !== 1 ? 'مراجعة' : 'مراجعة'})
                  </span>
                </div>
              )}

              {/* Platforms */}
              {game.platforms && game.platforms.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-6">
                  {game.platforms.map((platform) => (
                    <span
                      key={platform.id}
                      className="px-3 py-1.5 text-sm font-bold rounded-lg bg-[var(--gaming-dark)]/80 text-[var(--gaming-accent)] border border-[var(--gaming-accent)]/30"
                    >
                      {platform.name}
                    </span>
                  ))}
                </div>
              )}

              {/* Description */}
              <p className="text-lg text-[var(--gaming-light)]/80 leading-relaxed max-w-2xl">
                {game.description}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Tabs Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tab Navigation */}
        <div className="flex gap-2 mb-8 border-b border-white/10 pb-4">
          {[
            { id: 'overview', label: 'نظرة عامة', icon: '📋' },
            { id: 'reviews', label: 'المراجعات', icon: '⭐' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as 'overview' | 'reviews')}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-[var(--gaming-primary)] to-[var(--gaming-secondary)] text-white shadow-lg shadow-[var(--gaming-primary)]/30'
                  : 'text-[var(--gaming-light)]/60 hover:text-white hover:bg-white/5'
              }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {activeTab === 'overview' ? (
              <>
                {/* About Section */}
                <div className="p-8 rounded-2xl bg-gradient-to-b from-[var(--gaming-card-bg)] to-[var(--gaming-dark)] border border-white/5">
                  <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                    <span className="w-10 h-10 rounded-xl bg-[var(--gaming-primary)]/20 flex items-center justify-center">📖</span>
                    عن اللعبة
                  </h2>
                  <p className="text-[var(--gaming-light)]/70 leading-relaxed text-lg">
                    {game.description}
                  </p>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { label: 'التقييم', value: game.averageRating?.toFixed(1) || '-', icon: '⭐' },
                    { label: 'المراجعات', value: game.totalRatings || 0, icon: '💬' },
                    { label: 'الفئات', value: game.categories?.length || 0, icon: '🏷️' },
                    { label: 'المنصات', value: game.platforms?.length || 0, icon: '🎮' },
                  ].map((stat, i) => (
                    <div key={i} className="p-5 rounded-xl bg-[var(--gaming-card-bg)] border border-white/5 text-center group hover:border-[var(--gaming-primary)]/30 transition-all duration-300">
                      <span className="text-2xl mb-2 block group-hover:scale-125 transition-transform duration-300">{stat.icon}</span>
                      <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
                      <div className="text-sm text-[var(--gaming-light)]/50">{stat.label}</div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <>
                {/* Success Message */}
                {reviewSubmitted && (
                  <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/30 text-green-400 flex items-center gap-3">
                    <span className="text-xl">✅</span>
                    <span>تم إرسال المراجعة بنجاح! ستظهر بعد موافقة المشرف.</span>
                  </div>
                )}

                {/* Review Form */}
                <div className="p-8 rounded-2xl bg-gradient-to-b from-[var(--gaming-card-bg)] to-[var(--gaming-dark)] border border-white/5">
                  <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                    <span className="w-10 h-10 rounded-xl bg-[var(--gaming-secondary)]/20 flex items-center justify-center">✍️</span>
                    اكتب مراجعتك
                  </h2>
                  <ReviewForm
                    gameId={params.id as string}
                    onReviewSubmit={handleReviewSubmit}
                  />
                </div>

                {/* Reviews List */}
                <div className="p-8 rounded-2xl bg-gradient-to-b from-[var(--gaming-card-bg)] to-[var(--gaming-dark)] border border-white/5">
                  <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                    <span className="w-10 h-10 rounded-xl bg-[var(--gaming-accent)]/20 flex items-center justify-center">💬</span>
                    مراجعات اللاعبين
                  </h2>
                  <ReviewList gameId={params.id as string} />
                </div>
              </>
            )}
          </div>

          {/* Sidebar */}
          <aside className="space-y-6">
            {/* Game Info Card */}
            <div className="p-6 rounded-2xl bg-gradient-to-b from-[var(--gaming-card-bg)] to-[var(--gaming-dark)] border border-white/5 sticky top-28">
              <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                <span>ℹ️</span>
                معلومات اللعبة
              </h3>
              
              <div className="space-y-5">
                <div className="flex items-center justify-between py-3 border-b border-white/5">
                  <span className="text-[var(--gaming-light)]/60">تاريخ الإضافة</span>
                  <span className="text-white font-medium">
                    {new Date(game.createdAt).toLocaleDateString('ar-SA')}
                  </span>
                </div>

                {game.categories && game.categories.length > 0 && (
                  <div className="py-3 border-b border-white/5">
                    <span className="text-[var(--gaming-light)]/60 block mb-3">الفئات</span>
                    <div className="flex flex-wrap gap-2">
                      {game.categories.map((category) => (
                        <span
                          key={category.id}
                          className="px-3 py-1.5 text-xs font-medium rounded-lg bg-[var(--gaming-primary)]/10 text-[var(--gaming-primary)] border border-[var(--gaming-primary)]/20"
                        >
                          {category.name}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {game.platforms && game.platforms.length > 0 && (
                  <div className="py-3">
                    <span className="text-[var(--gaming-light)]/60 block mb-3">المنصات المتاحة</span>
                    <div className="flex flex-wrap gap-2">
                      {game.platforms.map((platform) => (
                        <span
                          key={platform.id}
                          className="px-3 py-1.5 text-xs font-bold rounded-lg bg-[var(--gaming-accent)]/10 text-[var(--gaming-accent)] border border-[var(--gaming-accent)]/20"
                        >
                          {platform.name}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Rating Summary */}
              {game.averageRating && (
                <div className="mt-6 pt-6 border-t border-white/10">
                  <div className="text-center p-6 rounded-xl bg-gradient-to-br from-yellow-400/10 to-orange-400/10 border border-yellow-400/20">
                    <div className="text-5xl font-black text-yellow-400 mb-2">
                      {game.averageRating.toFixed(1)}
                    </div>
                    <div className="flex justify-center mb-3">
                      <StarRating rating={game.averageRating} readonly size="lg" />
                    </div>
                    <p className="text-[var(--gaming-light)]/60 text-sm">
                      من {game.totalRatings} {game.totalRatings !== 1 ? 'مراجعة' : 'مراجعة'}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </aside>
        </div>
      </section>

      <Footer />
    </div>
  );
}