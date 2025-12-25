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
    <div className="bg-[var(--gaming-card)] rounded-lg p-6 sticky top-4">
      <h3 className="text-lg font-bold text-[var(--foreground)] mb-4">الفلاتر</h3>

      {/* Categories Filter */}
      <div className="mb-6">
        <h4 className="text-sm font-semibold text-[var(--foreground)] mb-3">الفئات</h4>
        {loading ? (
          <div className="text-[var(--gaming-light)]">جارٍ تحميل الفئات...</div>
        ) : (
          <Select
            value={selectedCategory}
            onValueChange={(value) => setSelectedCategory(value)}
          >
            <SelectTrigger className="w-full" variant="gaming" dir="rtl">
              <SelectValue placeholder="جميع الفئات" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">جميع الفئات</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>

      {/* Rating Filter */}
      <div className="mb-6">
        <h4 className="text-sm font-semibold text-[var(--foreground)] mb-3">الحد الأدنى للتقييم</h4>
        <RadioGroup
          value={minRating.toString()}
          onValueChange={(value) => setMinRating(Number(value))}
          dir="rtl"
          className="space-y-2"
        >
          {[4, 3, 2, 1].map((rating) => (
            <div key={rating} className="flex items-center space-x-reverse space-x-2">
              <RadioGroupItem value={rating.toString()} id={`rating-${rating}`} variant="gaming-accent" />
              <Label
                htmlFor={`rating-${rating}`}
                className="flex items-center cursor-pointer text-sm"
              >
                <span className="flex items-center ml-2">
                  {Array.from({ length: 5 }, (_, i) => (
                    <span
                      key={i}
                      className={`text-sm ${i < rating ? 'text-yellow-400' : 'text-gray-600'}`}
                    >
                      ★
                    </span>
                  ))}
                </span>
                <span className="mr-2 text-[var(--gaming-light)] text-sm">
                  فما فوق
                </span>
              </Label>
            </div>
          ))}
          <div className="flex items-center space-x-reverse space-x-2">
            <RadioGroupItem value="0" id="rating-all" variant="gaming-accent" />
            <Label htmlFor="rating-all" className="cursor-pointer text-sm text-[var(--gaming-light)]">
              جميع التقييمات
            </Label>
          </div>
        </RadioGroup>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2">
        <Button
          onClick={applyFilters}
          variant="gaming"
          className="flex-1"
        >
          تطبيق الفلاتر
        </Button>
        <Button
          onClick={clearFilters}
          variant="gaming-outline"
          className="flex-1"
        >
          مسح
        </Button>
      </div>

      {/* Active Filters Display */}
      {(selectedCategory !== 'all' || minRating > 0) && (
        <div className="mt-4 pt-4 border-t border-[var(--gaming-light)]/20">
          <h4 className="text-sm font-semibold text-[var(--foreground)] mb-2">الفلاتر النشطة:</h4>
          <div className="flex flex-wrap gap-2">
            {selectedCategory !== 'all' && (
              <span className="px-2 py-1 bg-[var(--gaming-primary)] text-white text-xs rounded-full">
                {categories.find(c => c.id === selectedCategory)?.name || selectedCategory}
              </span>
            )}
            {minRating > 0 && (
              <span className="px-2 py-1 bg-[var(--gaming-accent)] text-white text-xs rounded-full">
                {minRating}+ نجوم
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}