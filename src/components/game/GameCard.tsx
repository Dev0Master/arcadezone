"use client";

import Link from 'next/link';
import { Game } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

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
      <Card className="group cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-[var(--gaming-primary)]/30">
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
              <span className="text-[var(--gaming-light)]">لا توجد صورة</span>
            </div>
          )}

          {/* Category Badges */}
          {game.categories && game.categories.length > 0 && (
            <div className="absolute top-2 right-2 flex flex-wrap gap-1">
              {game.categories.slice(0, 2).map((category) => (
                <Badge key={category.id} variant="category" className="text-xs">
                  {category.name}
                </Badge>
              ))}
              {game.categories.length > 2 && (
                <Badge variant="category" className="text-xs">
                  +{game.categories.length - 2}
                </Badge>
              )}
            </div>
          )}

          {/* Platform Badges */}
          {game.platforms && game.platforms.length > 0 && (
            <div className="absolute bottom-2 left-2 flex flex-wrap gap-1">
              {game.platforms.slice(0, 3).map((platform) => (
                <Badge key={platform.id} variant="platform" className="text-xs">
                  {platform.code}
                </Badge>
              ))}
              {game.platforms.length > 3 && (
                <Badge variant="platform" className="text-xs">
                  +{game.platforms.length - 3}
                </Badge>
              )}
            </div>
          )}
        </div>

        {/* Game Info */}
        <CardContent className="p-4">
          <h3 className="text-lg font-bold text-foreground truncate mb-2 group-hover:text-[var(--gaming-primary)] transition-colors">
            {game.title}
          </h3>

          <p className="text-muted-foreground text-sm line-clamp-2 mb-3 h-10">
            {game.description}
          </p>

          {/* Rating */}
          {game.averageRating && (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1">
                {renderStars(game.averageRating)}
              </div>
              <span className="text-xs text-muted-foreground">
                {game.totalRatings} {game.totalRatings === 1 ? 'مراجعة' : 'مراجعات'}
              </span>
            </div>
          )}

          {/* View Details Button */}
          <div className="mt-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <Button className="w-full gaming py-1 text-sm">
              عرض التفاصيل
            </Button>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}