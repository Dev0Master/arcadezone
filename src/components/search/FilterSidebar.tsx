"use client";

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Category } from '@/lib/types';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

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
  const [selectedCategory, setSelectedCategory] = useState(initialSelectedCategory || 'all');
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
    } else {
      setSelectedCategory('all');
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
      category: selectedCategory !== 'all' ? selectedCategory : undefined,
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
    setSelectedCategory('all');
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
    <div className="rounded-2xl bg-gradient-to-b from-[var(--gaming-card-bg)] to-[var(--gaming-dark)] border border-white/5 overflow-hidden">
      {/* Header */}
      <div className="p-5 border-b border-white/5 bg-gradient-to-r from-[var(--gaming-primary)]/10 to-[var(--gaming-secondary)]/10">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <span className="w-8 h-8 rounded-lg bg-[var(--gaming-primary)]/20 flex items-center justify-center">🎛️</span>
          الفلاتر
        </h3>
      </div>

      <div className="p-5 space-y-6">
        {/* Categories Filter */}
        <div>
          <h4 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
            <span>📂</span>
            الفئات
          </h4>
          {loading ? (
            <div className="space-y-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-10 rounded-xl bg-white/5 animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="space-y-2">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                  selectedCategory === 'all'
                    ? 'bg-gradient-to-r from-[var(--gaming-primary)] to-[var(--gaming-secondary)] text-white shadow-lg shadow-[var(--gaming-primary)]/20'
                    : 'bg-white/5 text-[var(--gaming-light)]/70 hover:bg-white/10 hover:text-white'
                }`}
              >
                <span className="w-6 h-6 rounded-lg bg-white/10 flex items-center justify-center text-sm">🎮</span>
                <span>جميع الفئات</span>
                {selectedCategory === 'all' && (
                  <span className="mr-auto w-2 h-2 rounded-full bg-white animate-pulse" />
                )}
              </button>
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                    selectedCategory === category.id
                      ? 'bg-gradient-to-r from-[var(--gaming-primary)] to-[var(--gaming-secondary)] text-white shadow-lg shadow-[var(--gaming-primary)]/20'
                      : 'bg-white/5 text-[var(--gaming-light)]/70 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <span className="w-6 h-6 rounded-lg bg-white/10 flex items-center justify-center text-sm">🏷️</span>
                  <span>{category.name}</span>
                  {selectedCategory === category.id && (
                    <span className="mr-auto w-2 h-2 rounded-full bg-white animate-pulse" />
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Rating Filter */}
        <div>
          <h4 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
            <span>⭐</span>
            الحد الأدنى للتقييم
          </h4>
          <div className="space-y-2">
            {[4, 3, 2, 1, 0].map((rating) => (
              <button
                key={rating}
                onClick={() => setMinRating(rating)}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-300 ${
                  minRating === rating
                    ? 'bg-yellow-400/10 border border-yellow-400/30 text-yellow-400'
                    : 'bg-white/5 text-[var(--gaming-light)]/70 hover:bg-white/10 hover:text-white border border-transparent'
                }`}
              >
                <div className="flex items-center gap-2">
                  {rating === 0 ? (
                    <span className="text-sm">جميع التقييمات</span>
                  ) : (
                    <>
                      <div className="flex">
                        {Array.from({ length: 5 }, (_, i) => (
                          <span
                            key={i}
                            className={`text-base ${i < rating ? 'text-yellow-400' : 'text-gray-600'}`}
                          >
                            ★
                          </span>
                        ))}
                      </div>
                      <span className="text-xs text-[var(--gaming-light)]/50">فما فوق</span>
                    </>
                  )}
                </div>
                {minRating === rating && (
                  <span className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4 border-t border-white/5">
          <button
            onClick={applyFilters}
            className="flex-1 py-3 rounded-xl bg-gradient-to-r from-[var(--gaming-primary)] to-[var(--gaming-secondary)] text-white font-semibold hover:shadow-lg hover:shadow-[var(--gaming-primary)]/30 transition-all duration-300"
          >
            تطبيق
          </button>
          <button
            onClick={clearFilters}
            className="flex-1 py-3 rounded-xl bg-white/5 text-[var(--gaming-light)] font-semibold hover:bg-white/10 transition-all duration-300 border border-white/10"
          >
            مسح
          </button>
        </div>

        {/* Active Filters Display */}
        {(selectedCategory !== 'all' || minRating > 0) && (
          <div className="pt-4 border-t border-white/5">
            <h4 className="text-xs font-semibold text-[var(--gaming-light)]/50 mb-3 uppercase tracking-wider">الفلاتر النشطة</h4>
            <div className="flex flex-wrap gap-2">
              {selectedCategory !== 'all' && (
                <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-[var(--gaming-primary)]/20 text-[var(--gaming-primary)] text-sm rounded-full border border-[var(--gaming-primary)]/30">
                  <span>📂</span>
                  {categories.find(c => c.id === selectedCategory)?.name || selectedCategory}
                  <button
                    onClick={() => setSelectedCategory('all')}
                    className="hover:text-white transition-colors"
                  >
                    ✕
                  </button>
                </span>
              )}
              {minRating > 0 && (
                <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-yellow-400/10 text-yellow-400 text-sm rounded-full border border-yellow-400/30">
                  <span>⭐</span>
                  {minRating}+ نجوم
                  <button
                    onClick={() => setMinRating(0)}
                    className="hover:text-white transition-colors"
                  >
                    ✕
                  </button>
                </span>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}