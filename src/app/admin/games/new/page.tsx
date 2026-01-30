"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAdminLayout } from '../../layout';

interface Category {
  id: string;
  name: string;
}

interface Platform {
  id: string;
  name: string;
}

export default function NewGamePage() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [platforms, setPlatforms] = useState<Platform[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [initialRating, setInitialRating] = useState<number>(0);
  const [submitting, setSubmitting] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const router = useRouter();
  const { refreshGames } = useAdminLayout();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [categoriesRes, platformsRes] = await Promise.all([
        fetch('/api/categories'),
        fetch('/api/platforms'),
      ]);

      if (categoriesRes.ok) {
        const data = await categoriesRes.json();
        setCategories(data.categories || []);
      }

      if (platformsRes.ok) {
        const data = await platformsRes.json();
        setPlatforms(data.platforms || []);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoadingData(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleCategoryToggle = (categoryId: string) => {
    setSelectedCategories(prev =>
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const handlePlatformToggle = (platformId: string) => {
    setSelectedPlatforms(prev =>
      prev.includes(platformId)
        ? prev.filter(id => id !== platformId)
        : [...prev, platformId]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      alert('عنوان اللعبة مطلوب');
      return;
    }

    if (!description.trim()) {
      alert('وصف اللعبة مطلوب');
      return;
    }

    setSubmitting(true);

    try {
      let imageUrl = '';

      // Upload image if selected
      if (selectedFile) {
        const formData = new FormData();
        formData.append('file', selectedFile);

        const uploadRes = await fetch('/api/admin/upload', {
          method: 'POST',
          body: formData,
        });

        if (uploadRes.ok) {
          const uploadData = await uploadRes.json();
          imageUrl = uploadData.url;
        } else {
          console.error('Failed to upload image');
        }
      }

      // Create game
      const response = await fetch('/api/games', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: title.trim(),
          description: description.trim(),
          imageUrl,
          categoryIds: selectedCategories,
          platformIds: selectedPlatforms,
          initialRating: initialRating > 0 ? initialRating : undefined,
        }),
      });

      if (response.ok) {
        await refreshGames();
        alert('تم إضافة اللعبة بنجاح!');
        router.push('/admin/dashboard');
      } else {
        const data = await response.json();
        alert(data.error || 'فشل في إضافة اللعبة');
      }
    } catch (error) {
      console.error('Error creating game:', error);
      alert('حدث خطأ. يرجى المحاولة مرة أخرى.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-[var(--foreground)] mb-2">إضافة لعبة جديدة</h2>
        <p className="text-[var(--gaming-light)]">
          أضف لعبة جديدة إلى المتجر
        </p>
      </div>

      <div className="game-card p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-[var(--gaming-light)] mb-2">
              عنوان اللعبة *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="input-field"
              placeholder="أدخل عنوان اللعبة"
              required
              disabled={submitting}
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-[var(--gaming-light)] mb-2">
              وصف اللعبة *
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="input-field h-32 resize-none"
              placeholder="أدخل وصف اللعبة"
              required
              disabled={submitting}
            />
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-[var(--gaming-light)] mb-2">
              صورة اللعبة
            </label>
            <div className="flex items-start gap-4">
              <div className="flex-1">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="input-field"
                  disabled={submitting}
                />
              </div>
              {previewUrl && (
                <div className="w-32 h-32 rounded-lg overflow-hidden bg-[var(--gaming-card-bg)]">
                  <img
                    src={previewUrl}
                    alt="معاينة"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Categories */}
          <div>
            <label className="block text-sm font-medium text-[var(--gaming-light)] mb-2">
              الفئات
            </label>
            {loadingData ? (
              <div className="text-[var(--gaming-light)]">جارٍ تحميل الفئات...</div>
            ) : categories.length === 0 ? (
              <div className="text-[var(--gaming-light)]">لا توجد فئات متاحة</div>
            ) : (
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    type="button"
                    onClick={() => handleCategoryToggle(category.id)}
                    className={`px-4 py-2 rounded-lg transition-colors ${
                      selectedCategories.includes(category.id)
                        ? 'bg-[var(--gaming-primary)] text-white'
                        : 'bg-[var(--gaming-card-bg)] text-[var(--gaming-light)] hover:bg-[var(--gaming-card-hover)]'
                    }`}
                    disabled={submitting}
                  >
                    {category.name}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Platforms */}
          <div>
            <label className="block text-sm font-medium text-[var(--gaming-light)] mb-2">
              المنصات
            </label>
            {loadingData ? (
              <div className="text-[var(--gaming-light)]">جارٍ تحميل المنصات...</div>
            ) : platforms.length === 0 ? (
              <div className="text-[var(--gaming-light)]">لا توجد منصات متاحة</div>
            ) : (
              <div className="flex flex-wrap gap-2">
                {platforms.map((platform) => (
                  <button
                    key={platform.id}
                    type="button"
                    onClick={() => handlePlatformToggle(platform.id)}
                    className={`px-4 py-2 rounded-lg transition-colors ${
                      selectedPlatforms.includes(platform.id)
                        ? 'bg-[var(--gaming-secondary)] text-white'
                        : 'bg-[var(--gaming-card-bg)] text-[var(--gaming-light)] hover:bg-[var(--gaming-card-hover)]'
                    }`}
                    disabled={submitting}
                  >
                    {platform.name}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Initial Rating */}
          <div>
            <label className="block text-sm font-medium text-[var(--gaming-light)] mb-2">
              التقييم الأولي (اختياري)
            </label>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setInitialRating(star === initialRating ? 0 : star)}
                  className={`text-2xl transition-colors ${
                    star <= initialRating ? 'text-yellow-400' : 'text-gray-600'
                  }`}
                  disabled={submitting}
                >
                  ★
                </button>
              ))}
              {initialRating > 0 && (
                <span className="text-[var(--gaming-light)] mr-2">
                  {initialRating} من 5
                </span>
              )}
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              className="btn btn-primary disabled:opacity-50"
              disabled={submitting}
            >
              {submitting ? 'جارٍ الإضافة...' : 'إضافة اللعبة'}
            </button>
            <button
              type="button"
              onClick={() => router.push('/admin/dashboard')}
              className="btn btn-outline"
              disabled={submitting}
            >
              إلغاء
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
