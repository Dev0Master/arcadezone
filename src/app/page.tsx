"use client";

import { useEffect, useState, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Game } from '@/lib/types';
import SearchBar from '@/components/search/SearchBar';
import FilterSidebar from '@/components/search/FilterSidebar';
import GameCard from '@/components/game/GameCard';

export default function HomePage() {
  const [games, setGames] = useState<Game[]>([]);
  const [filteredGames, setFilteredGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchLoading, setSearchLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const searchParams = useSearchParams();

  useEffect(() => {
    fetchGames();
    fetchCategories();
  }, []);

  useEffect(() => {
    // Apply filters when URL params or games change
    applyFilters();
  }, [games, searchParams]);

  const fetchGames = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/games');
      if (response.ok) {
        const data = await response.json();
        setGames(data.games);
      }
    } catch (error) {
      console.error('Error fetching games:', error);
    } finally {
      setLoading(false);
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
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="text-2xl font-semibold text-[var(--gaming-primary)]">Loading games...</div>
      </div>
    );
  }

  const currentQuery = searchParams.get('q') || '';
  const hasActiveFilters = currentQuery || searchParams.get('category') || searchParams.get('rating');

  return (
    <div className="flex min-h-screen flex-col">
      {/* Header */}
      <header className="gaming-header rounded-b-3xl p-8 mb-8">
        <div className="max-w-4xl mx-auto">
          {/* Navigation Links */}
          <div className="flex justify-center gap-6 mb-6">
            <Link
              href="/"
              className="text-white hover:text-[var(--gaming-accent)] transition-colors"
            >
              All Games
            </Link>
            <Link
              href="/categories"
              className="text-white hover:text-[var(--gaming-accent)] transition-colors"
            >
              Categories
            </Link>
          </div>

          <div className="text-center">
            <h1 className="text-4xl font-bold text-white mb-4">ArcadeZone Game Store</h1>
            <p className="text-xl text-[var(--gaming-light)] mb-6">
              Discover our collection of games
            </p>

            {/* Search Bar */}
            <div className="flex justify-center">
              <SearchBar onSearch={handleSearch} />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow px-4 pb-8">
        <div className="max-w-7xl mx-auto">
          {/* Results Header */}
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-[var(--foreground)]">
              {hasActiveFilters ? 'Search Results' : 'All Games'}
            </h2>
            {hasActiveFilters && (
              <p className="text-[var(--gaming-light)] mt-1">
                Found {filteredGames.length} game{filteredGames.length !== 1 ? 's' : ''}
              </p>
            )}
          </div>

          {/* Layout with Sidebar */}
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Filter Sidebar */}
            <aside className="lg:w-80 flex-shrink-0">
              <FilterSidebar categories={categories} />
            </aside>

            {/* Games Grid */}
            <div className="flex-grow">
              {searchLoading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
                  {Array.from({ length: 8 }).map((_, i) => (
                    <div key={i} className="game-card animate-pulse">
                      <div className="h-48 bg-gray-700 rounded-t-lg"></div>
                      <div className="p-4">
                        <div className="h-6 bg-gray-700 rounded mb-2"></div>
                        <div className="h-4 bg-gray-700 rounded mb-1"></div>
                        <div className="h-4 bg-gray-700 rounded w-3/4"></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : filteredGames.length === 0 ? (
                <div className="game-card p-8 text-center">
                  <h3 className="text-xl font-bold text-[var(--foreground)] mb-2">
                    {hasActiveFilters ? 'No games found' : 'No games available'}
                  </h3>
                  <p className="text-[var(--gaming-light)]">
                    {hasActiveFilters
                      ? 'Try adjusting your filters or search query'
                      : 'Check back later for new arrivals!'}
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
                  {filteredGames.map((game) => (
                    <GameCard key={game.id} game={game} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="gaming-footer rounded-t-3xl mt-8 p-6">
        <div className="max-w-7xl mx-auto text-center">
          <p>© {new Date().getFullYear()} ArcadeZone Game Store. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}