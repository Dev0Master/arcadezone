"use client";

import { useEffect, useState } from 'react';
import { Game } from '../lib/types';

export default function HomePage() {
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch games from the API
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
        setLoading(false);
      }
    };

    fetchGames();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="text-2xl font-semibold text-[var(--gaming-primary)]">Loading games...</div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col p-4">
      <header className="gaming-header rounded-b-3xl mb-8">
        <h1 className="text-4xl font-bold text-white">ArcadeZone Game Store</h1>
        <p className="text-xl text-[var(--gaming-light)] mt-2">
          Discover our collection of games
        </p>
      </header>

      <main className="flex-grow container mx-auto py-8">
        {games.length === 0 ? (
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-[var(--gaming-primary)]">No games available</h2>
            <p className="text-[var(--gaming-light)] mt-2">Check back later for new arrivals!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {games.map((game) => (
              <div
                key={game.id}
                className="game-card transform transition-transform duration-300 hover:scale-105"
              >
                {game.imageUrl ? (
                  <img
                    src={game.imageUrl}
                    alt={game.title}
                    className="w-full h-48 object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.onerror = null; // Prevent infinite loop
                      target.src = '/placeholder-game-image.jpg'; // Use a placeholder image
                    }}
                  />
                ) : (
                  <div className="w-full h-48 bg-[var(--gaming-dark)] flex items-center justify-center">
                    <span className="text-[var(--gaming-light)]">No image</span>
                  </div>
                )}
                <div className="p-4">
                  <h3 className="text-lg font-bold text-[var(--foreground)] truncate">{game.title}</h3>
                  <p className="text-[var(--gaming-light)] text-sm mt-2 line-clamp-2 h-16 overflow-hidden">
                    {game.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <footer className="gaming-footer rounded-t-3xl mt-8">
        <p>© {new Date().getFullYear()} ArcadeZone Game Store. All rights reserved.</p>
      </footer>
    </div>
  );
}