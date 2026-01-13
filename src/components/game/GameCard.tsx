"use client";

import { useState } from 'react';
import Link from 'next/link';
import { Game } from '@/lib/types';

interface GameCardProps {
  game: Game;
  featured?: boolean;
}

export default function GameCard({ game, featured = false }: GameCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => {
      const filled = i < Math.floor(rating);
      const halfFilled = !filled && i < rating;
      return (
        <span
          key={i}
          className={`text-sm transition-all duration-300 ${
            filled ? 'text-yellow-400 drop-shadow-[0_0_3px_rgba(250,204,21,0.5)]' : 
            halfFilled ? 'text-yellow-400/50' : 'text-gray-600'
          } ${isHovered ? 'scale-110' : ''}`}
          style={{ transitionDelay: `${i * 50}ms` }}
        >
          ★
        </span>
      );
    });
  };

  // Placeholder component for when image fails or doesn't exist
  const ImagePlaceholder = () => (
    <div className="w-full h-full bg-gradient-to-br from-[var(--gaming-primary)]/20 via-[var(--gaming-dark)] to-[var(--gaming-secondary)]/20 flex items-center justify-center">
      <div className="text-center">
        <span className="text-6xl opacity-50 block mb-2">🎮</span>
        <span className="text-sm text-white/30">{game.title}</span>
      </div>
    </div>
  );

  return (
    <Link href={`/games/${game.id}`}>
      <article
        className={`group relative rounded-2xl overflow-hidden transition-all duration-500 cursor-pointer
          ${featured ? 'col-span-2 row-span-2' : ''}
          bg-gradient-to-b from-[var(--gaming-card-bg)] to-[var(--gaming-dark)]
          hover:shadow-2xl hover:shadow-[var(--gaming-primary)]/40
          hover:-translate-y-2 hover:scale-[1.02]
          border border-white/5 hover:border-[var(--gaming-primary)]/30`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Glow Effect */}
        <div className={`absolute inset-0 bg-gradient-to-t from-[var(--gaming-primary)]/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none`} />
        
        {/* Image Container */}
        <div className={`relative overflow-hidden ${featured ? 'h-72' : 'h-52'}`}>
          {/* Loading Skeleton */}
          {!imageLoaded && !imageError && game.imageUrl && (
            <div className="absolute inset-0 bg-gradient-to-r from-gray-800 via-gray-700 to-gray-800 animate-shimmer" />
          )}
          
          {game.imageUrl && !imageError ? (
            <img
              src={game.imageUrl}
              alt={game.title}
              className={`w-full h-full object-cover transition-all duration-700 ${
                isHovered ? 'scale-110 brightness-110' : 'scale-100'
              } ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
              onLoad={() => setImageLoaded(true)}
              onError={() => setImageError(true)}
            />
          ) : (
            <ImagePlaceholder />
          )}

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--gaming-dark)] via-transparent to-transparent opacity-80" />
          
          {/* Category Badges */}
          {game.categories && game.categories.length > 0 && (
            <div className="absolute top-3 right-3 flex flex-wrap gap-2 max-w-[70%]">
              {game.categories.slice(0, 2).map((category, i) => (
                <span
                  key={category.id}
                  className="px-3 py-1.5 text-xs font-semibold rounded-full
                    bg-[var(--gaming-primary)]/80 backdrop-blur-md text-white
                    border border-white/20 shadow-lg
                    transform transition-all duration-300 hover:scale-105"
                  style={{ animationDelay: `${i * 100}ms` }}
                >
                  {category.name}
                </span>
              ))}
              {game.categories.length > 2 && (
                <span className="px-2 py-1.5 text-xs font-semibold rounded-full bg-white/10 backdrop-blur-md text-white border border-white/20">
                  +{game.categories.length - 2}
                </span>
              )}
            </div>
          )}

          {/* Platform Badges */}
          {game.platforms && game.platforms.length > 0 && (
            <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
              {game.platforms.slice(0, 3).map((platform) => (
                <span
                  key={platform.id}
                  className="px-2 py-1 text-[10px] font-bold rounded-md
                    bg-[var(--gaming-dark)]/80 backdrop-blur-md text-[var(--gaming-accent)]
                    border border-[var(--gaming-accent)]/30"
                >
                  {platform.code}
                </span>
              ))}
            </div>
          )}

          {/* Hover Overlay */}
          <div className={`absolute inset-0 flex items-center justify-center bg-[var(--gaming-dark)]/60 backdrop-blur-sm
            transition-all duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
            <div className={`transform transition-all duration-500 ${isHovered ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
              <span className="px-6 py-3 rounded-xl bg-gradient-to-r from-[var(--gaming-primary)] to-[var(--gaming-secondary)] text-white font-bold text-sm shadow-xl shadow-[var(--gaming-primary)]/30 flex items-center gap-2">
                <span>عرض التفاصيل</span>
                <span className="text-lg">←</span>
              </span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="relative p-5">
          {/* Title */}
          <h3 className={`font-bold mb-2 transition-colors duration-300 line-clamp-1
            ${featured ? 'text-xl' : 'text-lg'}
            ${isHovered ? 'text-[var(--gaming-primary)]' : 'text-white'}`}>
            {game.title}
          </h3>

          {/* Description */}
          <p className={`text-[var(--gaming-light)]/60 text-sm leading-relaxed mb-4 transition-all duration-300
            ${featured ? 'line-clamp-3' : 'line-clamp-2'}
            ${isHovered ? 'text-[var(--gaming-light)]/80' : ''}`}>
            {game.description}
          </p>

          {/* Rating & Info */}
          <div className="flex items-center justify-between">
            {game.averageRating ? (
              <div className="flex items-center gap-2">
                <div className="flex items-center">
                  {renderStars(game.averageRating)}
                </div>
                <span className="text-sm font-semibold text-yellow-400">
                  {game.averageRating.toFixed(1)}
                </span>
              </div>
            ) : (
              <div className="flex items-center gap-1 text-[var(--gaming-light)]/40 text-sm">
                <span>لا توجد تقييمات</span>
              </div>
            )}
            
            {game.totalRatings && game.totalRatings > 0 && (
              <span className="text-xs text-[var(--gaming-light)]/50 bg-white/5 px-2 py-1 rounded-full">
                {game.totalRatings} {game.totalRatings === 1 ? 'مراجعة' : 'مراجعات'}
              </span>
            )}
          </div>

          {/* Bottom Glow Line */}
          <div className={`absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[var(--gaming-primary)] to-transparent
            transform transition-all duration-500 ${isHovered ? 'opacity-100 scale-x-100' : 'opacity-0 scale-x-0'}`} />
        </div>
      </article>
    </Link>
  );
}