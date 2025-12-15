"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Category } from '@/lib/types';

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/categories');
      if (response.ok) {
        const data = await response.json();
        setCategories(data.categories);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="text-2xl font-semibold text-[var(--gaming-primary)]">Loading categories...</div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col p-4">
      {/* Header */}
      <div className="mb-8">
        <Link
          href="/"
          className="text-[var(--gaming-primary)] hover:text-[var(--gaming-accent)] flex items-center gap-2 mb-4"
        >
          ← Back to Games
        </Link>
        <h1 className="text-4xl font-bold text-[var(--foreground)] mb-2">Game Categories</h1>
        <p className="text-[var(--gaming-light)]">
          Browse games by category to find exactly what you're looking for
        </p>
      </div>

      {/* Categories Grid */}
      <div className="flex-grow">
        {categories.length === 0 ? (
          <div className="game-card p-12 text-center">
            <h2 className="text-2xl font-bold text-[var(--foreground)] mb-4">No Categories Yet</h2>
            <p className="text-[var(--gaming-light)]">
              Categories will be available once games are organized by type.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category) => (
              <Link key={category.id} href={`/?category=${category.id}`}>
                <div className="game-card h-full group cursor-pointer transform transition-all duration-300 hover:scale-105">
                  <div className="p-6">
                    <h3 className="text-2xl font-bold text-[var(--foreground)] mb-3 group-hover:text-[var(--gaming-primary)] transition-colors">
                      {category.name}
                    </h3>
                    {category.description && (
                      <p className="text-[var(--gaming-light)] mb-4 line-clamp-3">
                        {category.description}
                      </p>
                    )}
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-[var(--gaming-primary)]">
                        Browse games
                      </span>
                      <svg
                        className="w-5 h-5 text-[var(--gaming-primary)] transform transition-transform duration-300 group-hover:translate-x-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="gaming-footer rounded-t-3xl mt-8 p-6">
        <div className="max-w-7xl mx-auto text-center">
          <p>© {new Date().getFullYear()} ArcadeZone Game Store. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}