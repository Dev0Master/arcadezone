"use client";

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import dynamic from 'next/dynamic';
import { Game } from '@/lib/types';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import HeroSection from '@/components/layout/HeroSection';
import FilterSidebar from '@/components/search/FilterSidebar';
import GameCard from '@/components/game/GameCard';

// Dynamic import Lottie to avoid SSR issues
const Lottie = dynamic(() => import('lottie-react'), { ssr: false });

export default function HomePage() {
  const [games, setGames] = useState<Game[]>([]);
  const [filteredGames, setFilteredGames] = useState<Game[]>([]);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [animationComplete, setAnimationComplete] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [animationData, setAnimationData] = useState<object | null>(null);
  const searchParams = useSearchParams();

  // Show loading until both data is loaded AND animation completes
  const loading = !dataLoaded || !animationComplete;

  useEffect(() => {
    // Load Lottie animation
    fetch('/GameController.json')
      .then(res => res.json())
      .then(data => setAnimationData(data))
      .catch(err => console.error('Failed to load animation:', err));
    
    fetchGames();
    fetchCategories();
  }, []);

  useEffect(() => {
    // Apply filters when URL params or games change
    applyFilters();
  }, [games, searchParams]);

  const fetchGames = async () => {
    try {
      const response = await fetch('/api/games');
      if (response.ok) {
        const data = await response.json();
        setGames(data.games);
      }
    } catch (error) {
      console.error('Error fetching games:', error);
    } finally {
      setDataLoaded(true);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories');
      if (response.ok) {
        const data = await response.json();
        setCategories(data.categories);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const applyFilters = async () => {
    const query = searchParams.get('q');
    const categoryId = searchParams.get('category');
    const minRating = searchParams.get('rating');

    if (query || categoryId || minRating) {
      setSearchLoading(true);
      try {
        const params = new URLSearchParams();
        if (query) params.set('q', query);
        if (categoryId) params.set('category', categoryId);

        const response = await fetch(`/api/games/search?${params.toString()}`);
        if (response.ok) {
          const data = await response.json();
          let filtered = data.games;

          // Apply rating filter client-side if needed
          if (minRating) {
            filtered = filtered.filter((game: Game) =>
              game.averageRating && game.averageRating >= Number(minRating)
            );
          }

          setFilteredGames(filtered);
        }
      } catch (error) {
        console.error('Error filtering games:', error);
        setFilteredGames([]);
      } finally {
        setSearchLoading(false);
      }
    } else {
      setFilteredGames(games);
    }
  };

  const handleSearch = (query: string) => {
    const params = new URLSearchParams(searchParams);
    if (query.trim()) {
      params.set('q', query.trim());
    } else {
      params.delete('q');
    }
    // Update URL without navigation
    window.history.pushState({}, '', `/?${params.toString()}`);
    applyFilters();
  };

  const currentQuery = searchParams.get('q') || '';
  const hasActiveFilters = currentQuery || searchParams.get('category') || searchParams.get('rating');

  // Loading State
  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--gaming-dark)]">
        <Header />
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="w-48 h-48 sm:w-64 sm:h-64 mx-auto mb-4">
              {animationData ? (
                <Lottie
                  animationData={animationData}
                  loop={false}
                  onComplete={() => setAnimationComplete(true)}
                  className="w-full h-full"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <div className="w-16 h-16 border-4 border-[var(--gaming-primary)] border-t-transparent rounded-full animate-spin" />
                </div>
              )}
            </div>
            <p className="text-xl text-[var(--gaming-light)]/80 animate-pulse">جارٍ تحميل الألعاب...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--gaming-dark)]">
      <Header />
      
      {/* Hero Section */}
      {!hasActiveFilters && (
        <HeroSection onSearch={handleSearch} gamesCount={games.length} />
      )}

      {/* Main Content */}
      <main className={`relative ${hasActiveFilters ? 'pt-28' : ''}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Section Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-10">
            <div>
              <h2 className="text-3xl font-bold text-white flex items-center gap-3">
                <span className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--gaming-primary)] to-[var(--gaming-secondary)] flex items-center justify-center text-xl">
                  {hasActiveFilters ? '🔍' : '🎮'}
                </span>
                {hasActiveFilters ? 'نتائج البحث' : 'جميع الألعاب'}
              </h2>
              {hasActiveFilters && (
                <p className="text-[var(--gaming-light)]/60 mt-2">
                  تم العثور على <span className="text-[var(--gaming-primary)] font-semibold">{filteredGames.length}</span> لعبة
                </p>
              )}
            </div>

            {/* Filter Toggle Button (Mobile) */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="lg:hidden flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-[var(--gaming-light)] hover:bg-white/10 transition-all duration-300"
            >
              <span>🎛️</span>
              <span>الفلاتر</span>
              {(searchParams.get('category') || searchParams.get('rating')) && (
                <span className="w-2 h-2 rounded-full bg-[var(--gaming-primary)]" />
              )}
            </button>
          </div>

          {/* Layout with Sidebar */}
          <div className="flex flex-col lg:flex-row-reverse gap-8">
            {/* Filter Sidebar */}
            <aside className={`lg:w-80 flex-shrink-0 ${showFilters ? 'block' : 'hidden lg:block'}`}>
              <div className="sticky top-28">
                <FilterSidebar categories={categories} />
              </div>
            </aside>

            {/* Games Grid */}
            <div className="flex-grow">
              {searchLoading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="rounded-2xl overflow-hidden bg-[var(--gaming-card-bg)] animate-pulse">
                      <div className="h-52 bg-gradient-to-r from-gray-800 via-gray-700 to-gray-800 animate-shimmer" />
                      <div className="p-5 space-y-4">
                        <div className="h-6 bg-gray-700/50 rounded-lg w-3/4" />
                        <div className="h-4 bg-gray-700/50 rounded-lg" />
                        <div className="h-4 bg-gray-700/50 rounded-lg w-5/6" />
                        <div className="flex justify-between pt-2">
                          <div className="flex gap-1">
                            {Array.from({ length: 5 }).map((_, j) => (
                              <div key={j} className="w-4 h-4 rounded bg-gray-700/50" />
                            ))}
                          </div>
                          <div className="h-4 bg-gray-700/50 rounded w-16" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : filteredGames.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 px-6 rounded-3xl bg-gradient-to-b from-[var(--gaming-card-bg)] to-[var(--gaming-dark)] border border-white/5">
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[var(--gaming-primary)]/20 to-[var(--gaming-secondary)]/20 flex items-center justify-center mb-6">
                    <span className="text-5xl">{hasActiveFilters ? '🔍' : '🎮'}</span>
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-3">
                    {hasActiveFilters ? 'لم يتم العثور على ألعاب' : 'لا توجد ألعاب متاحة'}
                  </h3>
                  <p className="text-[var(--gaming-light)]/60 text-center max-w-md mb-6">
                    {hasActiveFilters
                      ? 'جرب تعديل معايير البحث أو إزالة بعض الفلاتر'
                      : 'عد لاحقاً لاكتشاف ألعاب جديدة ومثيرة!'}
                  </p>
                  {hasActiveFilters && (
                    <button
                      onClick={() => window.history.pushState({}, '', '/')}
                      className="px-6 py-3 rounded-xl bg-gradient-to-r from-[var(--gaming-primary)] to-[var(--gaming-secondary)] text-white font-semibold hover:shadow-lg hover:shadow-[var(--gaming-primary)]/30 transition-all duration-300"
                    >
                      مسح جميع الفلاتر
                    </button>
                  )}
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                  {filteredGames.map((game, index) => (
                    <div
                      key={game.id}
                      className="animate-fadeInUp"
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      <GameCard game={game} />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}