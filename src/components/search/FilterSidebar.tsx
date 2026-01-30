"use client";

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Category } from '@/lib/types';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import {
  SlidersHorizontal,
  Grid3x3,
  Tag,
  Star,
  CheckCircle2,
  X,
} from 'lucide-react';
import { cn } from '@/lib/utils';

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
    <div
      className="rounded-lg bg-gradient-to-b from-[var(--gaming-card-bg)] to-[var(--gaming-dark)] border border-white/10 overflow-hidden"
      role="complementary"
      aria-label="خيارات الفلتر"
    >
      {/* Header */}
      <div className="sticky top-0 z-10 p-4 lg:p-5 border-b border-white/10
                      bg-gradient-to-br from-violet-500/20 via-pink-500/10 to-cyan-500/5
                      backdrop-blur-sm">
        <div className="flex items-center justify-between">
          <h3 className="text-base lg:text-lg font-bold text-white flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gradient-to-br from-violet-500 to-pink-500
                            shadow-lg shadow-violet-500/50">
              <SlidersHorizontal className="w-4 h-4 lg:w-5 lg:h-5 text-white" />
            </div>
            الفلاتر
          </h3>
          {(selectedCategory !== 'all' || minRating > 0) && (
            <button
              onClick={clearFilters}
              className="text-xs text-cyan-400 hover:text-cyan-300
                         flex items-center gap-1 transition-colors"
            >
              <X className="w-3 h-3" />
              <span>مسح الكل</span>
            </button>
          )}
        </div>
      </div>

      <div className="p-4 space-y-5 lg:p-5 lg:space-y-6">
        {/* Categories Filter */}
        <div role="radiogroup" aria-labelledby="categories-heading">
          <h4 id="categories-heading" className="text-sm lg:text-base font-bold text-white mb-4 flex items-center gap-2">
            <Tag className="w-4 h-4 text-violet-400" />
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
                aria-checked={selectedCategory === 'all'}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2.5 lg:px-4 lg:py-3.5 rounded-lg",
                  "text-sm lg:text-base font-medium transition-all duration-200",
                  "border focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-500",
                  selectedCategory === 'all'
                    ? "bg-gradient-to-r from-violet-500 to-pink-500 text-white border-violet-500/50 shadow-lg shadow-violet-500/40 scale-[1.02]"
                    : "bg-white/5 text-slate-400 border-white/10 hover:bg-white/10 hover:text-slate-200 hover:border-white/20 hover:scale-[1.01]"
                )}
              >
                <Grid3x3 className="w-4 h-4 lg:w-5 lg:h-5 flex-shrink-0" />
                <span className="flex-grow text-right">جميع الفئات</span>
                {selectedCategory === 'all' && (
                  <CheckCircle2 className="w-4 h-4 flex-shrink-0 animate-pulse" />
                )}
              </button>
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  aria-checked={selectedCategory === category.id}
                  className={cn(
                    "w-full flex items-center gap-3 px-3 py-2.5 lg:px-4 lg:py-3.5 rounded-lg",
                    "text-sm lg:text-base font-medium transition-all duration-200",
                    "border focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-500",
                    selectedCategory === category.id
                      ? "bg-gradient-to-r from-violet-500 to-pink-500 text-white border-violet-500/50 shadow-lg shadow-violet-500/40 scale-[1.02]"
                      : "bg-white/5 text-slate-400 border-white/10 hover:bg-white/10 hover:text-slate-200 hover:border-white/20 hover:scale-[1.01]"
                  )}
                >
                  <Tag className="w-4 h-4 lg:w-5 lg:h-5 flex-shrink-0" />
                  <span className="flex-grow text-right">{category.name}</span>
                  {selectedCategory === category.id && (
                    <CheckCircle2 className="w-4 h-4 flex-shrink-0 animate-pulse" />
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Rating Filter */}
        <div role="radiogroup" aria-labelledby="rating-heading">
          <h4 id="rating-heading" className="text-sm lg:text-base font-bold text-white mb-4 flex items-center gap-2">
            <Star className="w-4 h-4 text-cyan-400 fill-cyan-400" />
            الحد الأدنى للتقييم
          </h4>
          <div className="space-y-2">
            {[4, 3, 2, 1, 0].map((rating) => (
              <button
                key={rating}
                onClick={() => setMinRating(rating)}
                aria-checked={minRating === rating}
                className={cn(
                  "w-full flex items-center justify-between px-3 py-2.5 lg:px-4 lg:py-3.5 rounded-lg",
                  "text-sm lg:text-base transition-all duration-200",
                  "border focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-500",
                  minRating === rating
                    ? "bg-cyan-500 text-white border-cyan-500/50 shadow-lg shadow-cyan-500/40"
                    : "bg-white/5 text-slate-400 border-white/10 hover:bg-cyan-500/10 hover:text-cyan-300 hover:border-cyan-500/30"
                )}
              >
                <div className="flex items-center gap-2">
                  {rating === 0 ? (
                    <span>جميع التقييمات</span>
                  ) : (
                    <>
                      <div className="flex gap-0.5" role="img" aria-label={`${rating} نجوم`}>
                        {Array.from({ length: 5 }, (_, i) => (
                          <Star
                            key={i}
                            className={cn(
                              "w-3.5 h-3.5 lg:w-4 lg:h-4 transition-all",
                              i < rating
                                ? minRating === rating
                                  ? "fill-white text-white"
                                  : "fill-cyan-400 text-cyan-400"
                                : "fill-slate-700 text-slate-700"
                            )}
                          />
                        ))}
                      </div>
                      <span className="text-xs text-slate-500">فما فوق</span>
                    </>
                  )}
                </div>
                {minRating === rating && (
                  <CheckCircle2 className="w-4 h-4 animate-pulse" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="sticky bottom-0 flex gap-3 p-4 lg:p-5
                        border-t border-white/10 bg-gaming-card-bg/80 backdrop-blur-sm">
          <button
            onClick={applyFilters}
            className="flex-1 py-3 lg:py-3.5 rounded-lg text-sm lg:text-base font-semibold
                       bg-gradient-to-r from-violet-500 to-pink-500 text-white
                       shadow-lg shadow-violet-500/40 hover:shadow-violet-500/60
                       hover:scale-[1.02] active:scale-95 transition-all duration-200
                       focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-500"
          >
            تطبيق الفلاتر
          </button>
          <button
            onClick={clearFilters}
            disabled={selectedCategory === 'all' && minRating === 0}
            className={cn(
              "px-4 py-3 lg:py-3.5 rounded-lg transition-all duration-200 border",
              selectedCategory === 'all' && minRating === 0
                ? "bg-white/5 text-slate-600 border-white/10 cursor-not-allowed opacity-50"
                : "bg-white/5 text-slate-300 border-white/20 hover:bg-white/10 hover:border-white/30"
            )}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Active Filters Display */}
        {(selectedCategory !== 'all' || minRating > 0) && (
          <div className="p-4 lg:p-5 border-t border-white/10 bg-white/5">
            <h4 className="text-xs font-bold text-slate-400 mb-3 uppercase tracking-wider flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5" />
              الفلاتر النشطة
            </h4>
            <div className="flex flex-wrap gap-2">
              {selectedCategory !== 'all' && (
                <span className="inline-flex items-center gap-2 px-3 py-1.5 text-sm
                               bg-violet-500/20 text-violet-300 rounded-lg
                               border border-violet-500/40 backdrop-blur-sm">
                  <Tag className="w-3.5 h-3.5" />
                  <span className="font-medium">
                    {categories.find(c => c.id === selectedCategory)?.name || selectedCategory}
                  </span>
                  <button
                    onClick={() => setSelectedCategory('all')}
                    className="p-0.5 rounded hover:bg-violet-500/30 transition-colors"
                    aria-label="إزالة فلتر الفئة"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              {minRating > 0 && (
                <span className="inline-flex items-center gap-2 px-3 py-1.5 text-sm
                               bg-cyan-500/20 text-cyan-300 rounded-lg
                               border border-cyan-500/40 backdrop-blur-sm">
                  <Star className="w-3.5 h-3.5 fill-cyan-300" />
                  <span className="font-medium">{minRating}+ نجوم</span>
                  <button
                    onClick={() => setMinRating(0)}
                    className="p-0.5 rounded hover:bg-cyan-500/30 transition-colors"
                    aria-label="إزالة فلتر التقييم"
                  >
                    <X className="w-3 h-3" />
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