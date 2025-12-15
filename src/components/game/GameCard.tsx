"use client";

import Link from 'next/link';
import { Game } from '@/lib/types';

interface GameCardProps {
  game: Game;
}

export default function GameCard({ game }: GameCardProps) {
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span
        key={i}
        className={`text-sm ${i < Math.round(rating) ? 'text-yellow-400' : 'text-gray-600'}`}
      >
        ★
      </span>
    ));
  };

  return (
    <Link href={`/games/${game.id}`}>
      <div className="game-card group cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-xl">
        {/* Game Image */}
        <div className="relative overflow-hidden rounded-t-lg">
          {game.imageUrl ? (
            <img
              src={game.imageUrl}
              alt={game.title}
              className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-110"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.onerror = null;
                target.src = '/placeholder-game-image.jpg';
              }}
            />
          ) : (
            <div className="w-full h-48 bg-[var(--gaming-dark)] flex items-center justify-center">
              <span className="text-[var(--gaming-light)]">No image</span>
            </div>
          )}

          {/* Category Badges */}
          {game.categories && game.categories.length > 0 && (
            <div className="absolute top-2 left-2 flex flex-wrap gap-1">
              {game.categories.slice(0, 2).map((category) => (
                <span
                  key={category.id}
                  className="px-2 py-1 bg-black/50 backdrop-blur-sm text-white text-xs rounded-full"
                >
                  {category.name}
                </span>
              ))}
              {game.categories.length > 2 && (
                <span className="px-2 py-1 bg-black/50 backdrop-blur-sm text-white text-xs rounded-full">
                  +{game.categories.length - 2}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Game Info */}
        <div className="p-4">
          <h3 className="text-lg font-bold text-[var(--foreground)] truncate mb-2 group-hover:text-[var(--gaming-primary)] transition-colors">
            {game.title}
          </h3>

          <p className="text-[var(--gaming-light)] text-sm line-clamp-2 mb-3 h-10">
            {game.description}
          </p>

          {/* Rating */}
          {game.averageRating && (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1">
                {renderStars(game.averageRating)}
              </div>
              <span className="text-xs text-[var(--gaming-light)]">
                {game.totalRatings} {game.totalRatings === 1 ? 'review' : 'reviews'}
              </span>
            </div>
          )}

          {/* View Details Button */}
          <div className="mt-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <button className="w-full btn btn-primary py-1 text-sm">
              View Details
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
}