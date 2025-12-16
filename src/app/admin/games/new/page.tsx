"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Category, Platform } from '@/lib/types';
import StarRating from '@/components/ratings/StarRating';

export default function AddGamePage() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [platforms, setPlatforms] = useState<Platform[]>([]);
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [initialRating, setInitialRating] = useState(0);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [platformsLoading, setPlatformsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchCategories();
    fetchPlatforms();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories');
      if (response.ok) {
        const data = await response.json();
        setCategories(data.categories);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      setCategoriesLoading(false);
    }
  };

  const handleCategoryToggle = (categoryId: string) => {
    setSelectedCategories(prev =>
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const fetchPlatforms = async () => {
    try {
      const response = await fetch('/api/platforms');
      if (response.ok) {
        const data = await response.json();
        setPlatforms(data.platforms);
      }
    } catch (error) {
      console.error('Error fetching platforms:', error);
    } finally {
      setPlatformsLoading(false);
    }
  };

  const handlePlatformToggle = (platformId: string) => {
    setSelectedPlatforms(prev =>
      prev.includes(platformId)
        ? prev.filter(id => id !== platformId)
        : [...prev, platformId]
    );
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);

      // Create a preview URL
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const removeImagePreview = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setImageUrl('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    let finalImageUrl = imageUrl;

    // If the user selected a file, upload it
    if (selectedFile) {
      const formData = new FormData();
      formData.append('image', selectedFile);

      try {
        const uploadResponse = await fetch('/api/admin/upload', {
          method: 'POST',
          body: formData,
        });

        if (uploadResponse.ok) {
          const uploadData = await uploadResponse.json();
          finalImageUrl = uploadData.imageUrl;
        } else {
          const errorData = await uploadResponse.json();
          alert(errorData.error || 'فشل في رفع الصورة');
          setLoading(false);
          return;
        }
      } catch (error) {
        console.error('Error uploading image:', error);
        alert('فشل في رفع الصورة');
        setLoading(false);
        return;
      }
    }

    try {
      const response = await fetch('/api/games', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          description,
          imageUrl: finalImageUrl || undefined,
          categoryIds: selectedCategories,
          platformIds: selectedPlatforms,
          initialRating,
        }),
      });

      if (response.ok) {
        router.push('/admin/dashboard');
        router.refresh();
      } else {
        const errorData = await response.json();
        alert(errorData.error || 'فشل في إضافة اللعبة');
      }
    } catch (error) {
      console.error('Error adding game:', error);
      alert('حدث خطأ أثناء إضافة اللعبة');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <div className="w-64 gaming-sidebar">
        <div className="p-4 border-b border-[var(--gaming-light)]/30">
          <h1 className="text-xl font-bold text-[var(--gaming-primary)]">لوحة المشرف</h1>
        </div>
        <nav className="p-4">
          <ul className="space-y-2">
            <li>
              <a href="/admin/dashboard" className="block p-2 text-[var(--gaming-light)] hover:bg-[var(--gaming-card-hover)] rounded">
                لوحة التحكم
              </a>
            </li>
            <li>
              <a href="/admin/games/new" className="block p-2 text-[var(--gaming-primary)] font-bold">
                إضافة لعبة جديدة
              </a>
            </li>
            <li>
              <a href="/admin/reviews" className="block p-2 text-[var(--gaming-light)] hover:bg-[var(--gaming-card-hover)] rounded">
                إدارة المراجعات
              </a>
            </li>
            <li>
              <a href="/admin/categories" className="block p-2 text-[var(--gaming-light)] hover:bg-[var(--gaming-card-hover)] rounded">
                الفئات
              </a>
            </li>
            <li>
              <button
                onClick={async () => {
                  await fetch('/api/admin/logout', {
                    method: 'POST',
                  });
                  router.push('/login');
                  router.refresh();
                }}
                className="w-full text-right p-2 text-[var(--gaming-light)] hover:bg-[var(--gaming-card-hover)] rounded"
              >
                تسجيل الخروج
              </button>
            </li>
          </ul>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6 bg-[var(--background)]">
        <div className="max-w-3xl mx-auto game-card p-6">
          <h1 className="text-2xl font-bold text-[var(--foreground)] mb-6">إضافة لعبة جديدة</h1>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="title" className="block text-sm font-medium text-[var(--gaming-light)] mb-1">
              العنوان *
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="input-field"
              placeholder="أدخل عنوان اللعبة"
            />
          </div>

          <div className="mb-6">
            <label htmlFor="description" className="block text-sm font-medium text-[var(--gaming-light)] mb-1">
              الوصف *
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              rows={4}
              className="input-field"
              placeholder="أدخل وصف اللعبة"
            ></textarea>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-[var(--gaming-light)] mb-1">
              صورة اللعبة
            </label>

            {/* Image Upload */}
            <div className="flex items-center space-x-reverse space-x-4">
              <div className="flex-1">
                <label className="block w-full cursor-pointer">
                  <div className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-[var(--gaming-light)/30] rounded-lg bg-[var(--gaming-dark)] hover:bg-[var(--gaming-card-hover)]">
                    {previewUrl ? (
                      <div className="flex flex-col items-center">
                        <img src={previewUrl} alt="معاينة" className="h-24 w-auto object-contain" />
                        <span className="mt-1 text-xs text-[var(--gaming-light)]">انقر للتغيير</span>
                      </div>
                    ) : imageUrl ? (
                      <div className="flex flex-col items-center">
                        <img src={imageUrl} alt="الحالي" className="h-24 w-auto object-contain" />
                        <span className="mt-1 text-xs text-[var(--gaming-light)]">استخدام الرابط</span>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center pt-4">
                        <svg className="w-8 h-8 text-[var(--gaming-primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                        </svg>
                        <span className="mt-2 text-sm text-[var(--gaming-light)]">
                          <span className="font-medium text-[var(--gaming-primary)]">انقر للرفع</span> أو السحب والإفلات
                        </span>
                        <p className="text-xs text-[var(--gaming-light)]">PNG, JPG, GIF حتى 5MB</p>
                      </div>
                    )}
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={handleFileChange}
                    />
                  </div>
                </label>
              </div>

              <div className="flex flex-col space-y-2">
                {(previewUrl || imageUrl) && (
                  <button
                    type="button"
                    onClick={removeImagePreview}
                    className="px-3 py-1 text-sm btn btn-danger"
                  >
                    إزالة
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Category Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-[var(--gaming-light)] mb-2">
              الفئات *
            </label>
            {categoriesLoading ? (
              <div className="text-[var(--gaming-light)]">جارٍ تحميل الفئات...</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                {categories.map((category) => (
                  <label
                    key={category.id}
                    className="flex items-center p-3 bg-[var(--gaming-dark)] border border-[var(--gaming-light)]/20 rounded-lg cursor-pointer hover:bg-[var(--gaming-card-hover)]"
                  >
                    <input
                      type="checkbox"
                      checked={selectedCategories.includes(category.id)}
                      onChange={() => handleCategoryToggle(category.id)}
                      className="ml-2 w-4 h-4 text-[var(--gaming-primary)] bg-gray-100 border-gray-300 rounded focus:ring-[var(--gaming-primary)] focus:ring-2"
                    />
                    <span className="text-[var(--foreground)]">{category.name}</span>
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* Platform Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-[var(--gaming-light)] mb-2">
              المنصات *
            </label>
            {platformsLoading ? (
              <div className="text-[var(--gaming-light)]">جارٍ تحميل المنصات...</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                {platforms.map((platform) => (
                  <label
                    key={platform.id}
                    className="flex items-center p-3 bg-[var(--gaming-dark)] border border-[var(--gaming-light)]/20 rounded-lg cursor-pointer hover:bg-[var(--gaming-card-hover)]"
                  >
                    <input
                      type="checkbox"
                      checked={selectedPlatforms.includes(platform.id)}
                      onChange={() => handlePlatformToggle(platform.id)}
                      className="ml-2 w-4 h-4 text-[var(--gaming-primary)] bg-gray-100 border-gray-300 rounded focus:ring-[var(--gaming-primary)] focus:ring-2"
                    />
                    <span className="text-[var(--foreground)]">{platform.name}</span>
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* Initial Rating */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-[var(--gaming-light)] mb-2">
              التقييم الأولي
            </label>
            <div className="flex items-center gap-4">
              <StarRating
                rating={initialRating}
                onRatingChange={setInitialRating}
                size="lg"
              />
              <span className="text-[var(--gaming-light)]">
                {initialRating > 0 ? `${initialRating} من 5 نجوم` : 'بدون تقييم'}
              </span>
            </div>
          </div>

          <div className="flex space-x-reverse space-x-4">
            <button
              type="submit"
              disabled={loading}
              className={`btn ${loading ? 'btn-outline' : 'btn-primary'}`}
            >
              {loading ? 'جارٍ الإضافة...' : 'إضافة اللعبة'}
            </button>

            <button
              type="button"
              onClick={() => router.back()}
              className="btn btn-outline"
            >
              إلغاء
            </button>
          </div>
        </form>
        </div>
      </div>
    </div>
  );
}