"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Category } from '@/lib/types';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

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
      <div className="min-h-screen bg-[var(--gaming-dark)]">
        <Header />
        <div className="flex items-center justify-center min-h-screen">
          <LoadingSpinner text="جارٍ تحميل الفئات..." size="lg" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      
      <main className="flex-grow p-4 mt-32">
        {/* Page Title */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-[var(--foreground)] mb-2">فئات الألعاب</h1>
          <p className="text-[var(--gaming-light)]">
            تصفح الألعاب حسب الفئة للعثور على ما تبحث عنه بالضبط
          </p>
        </div>

        {/* Categories Grid */}
        <div className="flex-grow">
          {categories.length === 0 ? (
            <div className="game-card p-12 text-center">
              <h2 className="text-2xl font-bold text-[var(--foreground)] mb-4">لا توجد فئات بعد</h2>
              <p className="text-[var(--gaming-light)]">
                ستتوفر الفئات بمجرد تنظيم الألعاب حسب النوع.
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
                          تصفح الألعاب
                        </span>
                        <svg
                          className="w-5 h-5 text-[var(--gaming-primary)] transform transition-transform duration-300 group-hover:-translate-x-2"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 19l-7-7 7-7"
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
      </main>

      <Footer />
    </div>
  );
}