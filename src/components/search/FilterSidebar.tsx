"use client";

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Category } from '@/lib/types';

interface FilterSidebarProps {
  categories?: Category[];
  selectedCategory?: string;
  minRating?: number;
  onFiltersChange?: (filters: { category?: string; minRating?: number }) => void;
}

export default function FilterSidebar({
  categories: initialCategories = [],
  selectedCategory: initialSelectedCategory,
  minRating: initialMinRating,
  onFiltersChange,
}: FilterSidebarProps) {
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [selectedCategory, setSelectedCategory] = useState(initialSelectedCategory || '');
  const [minRating, setMinRating] = useState(initialMinRating || 0);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    fetchCategories();
    // Initialize filters from URL
    const urlCategory = searchParams.get('category');
    const urlRating = searchParams.get('rating');

    if (urlCategory) {
      setSelectedCategory(urlCategory);
    }
    if (urlRating) {
      setMinRating(Number(urlRating));
    }
  }, [searchParams]);

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

  const applyFilters = () => {
    const filters = {
      category: selectedCategory || undefined,
      minRating: minRating > 0 ? minRating : undefined,
    };

    if (onFiltersChange) {
      onFiltersChange(filters);
    } else {
      // Update URL with filters
      const params = new URLSearchParams();
      const currentQuery = searchParams.get('q');

      if (currentQuery) {
        params.set('q', currentQuery);
      }
      if (filters.category) {
        params.set('category', filters.category);
      }
      if (filters.minRating) {
        params.set('rating', filters.minRating.toString());
      }

      const queryString = params.toString();
      router.push(queryString ? `/?${queryString}` : '/');
    }
  };

  const clearFilters = () => {
    setSelectedCategory('');
    setMinRating(0);
    const filters = { category: undefined, minRating: undefined };

    if (onFiltersChange) {
      onFiltersChange(filters);
    } else {
      const params = new URLSearchParams();
      const currentQuery = searchParams.get('q');

      if (currentQuery) {
        params.set('q', currentQuery);
      }

      const queryString = params.toString();
      router.push(queryString ? `/?${queryString}` : '/');
    }
  };

  return (
    <div className="bg-[var(--gaming-card)] rounded-lg p-6 sticky top-4">
      <h3 className="text-lg font-bold text-[var(--foreground)] mb-4">Filters</h3>

      {/* Categories Filter */}
      <div className="mb-6">
        <h4 className="text-sm font-semibold text-[var(--foreground)] mb-3">Categories</h4>
        {loading ? (
          <div className="text-[var(--gaming-light)]">Loading categories...</div>
        ) : (
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full px-3 py-2 bg-[var(--gaming-dark)] border border-[var(--gaming-light)]/30 rounded-lg text-[var(--foreground)] focus:outline-none focus:border-[var(--gaming-primary)]"
          >
            <option value="">All Categories</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        )}
      </div>

      {/* Rating Filter */}
      <div className="mb-6">
        <h4 className="text-sm font-semibold text-[var(--foreground)] mb-3">Minimum Rating</h4>
        <div className="space-y-2">
          {[4, 3, 2, 1].map((rating) => (
            <label key={rating} className="flex items-center cursor-pointer">
              <input
                type="radio"
                name="rating"
                value={rating}
                checked={minRating === rating}
                onChange={() => setMinRating(rating)}
                className="mr-2"
              />
              <span className="flex items-center">
                {Array.from({ length: 5 }, (_, i) => (
                  <span
                    key={i}
                    className={`text-sm ${i < rating ? 'text-yellow-400' : 'text-gray-600'}`}
                  >
                    ★
                  </span>
                ))}
                <span className="ml-2 text-[var(--gaming-light)] text-sm">
                  & up
                </span>
              </span>
            </label>
          ))}
          <label className="flex items-center cursor-pointer">
            <input
              type="radio"
              name="rating"
              value="0"
              checked={minRating === 0}
              onChange={() => setMinRating(0)}
              className="mr-2"
            />
            <span className="text-[var(--gaming-light)] text-sm">All Ratings</span>
          </label>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2">
        <button
          onClick={applyFilters}
          className="flex-1 btn btn-primary py-2"
        >
          Apply Filters
        </button>
        <button
          onClick={clearFilters}
          className="flex-1 btn btn-outline py-2"
        >
          Clear
        </button>
      </div>

      {/* Active Filters Display */}
      {(selectedCategory || minRating > 0) && (
        <div className="mt-4 pt-4 border-t border-[var(--gaming-light)]/20">
          <h4 className="text-sm font-semibold text-[var(--foreground)] mb-2">Active Filters:</h4>
          <div className="flex flex-wrap gap-2">
            {selectedCategory && (
              <span className="px-2 py-1 bg-[var(--gaming-primary)] text-white text-xs rounded-full">
                {categories.find(c => c.id === selectedCategory)?.name || selectedCategory}
              </span>
            )}
            {minRating > 0 && (
              <span className="px-2 py-1 bg-[var(--gaming-accent)] text-white text-xs rounded-full">
                {minRating}+ Stars
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}