"use client";

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Game } from '@/lib/types';
import { useAdminLayout } from '../../../layout';

export default function EditGamePage() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const params = useParams();
  const { refreshGames } = useAdminLayout();

  useEffect(() => {
    const fetchGame = async () => {
      try {
        const id = typeof params.id === 'string' ? params.id : (params.id as string[])[0];
        const response = await fetch(`/api/games/${id}`);
        if (response.ok) {
          const data = await response.json();
          const game: Game = data.game;
          setTitle(game.title);
          setDescription(game.description);
          setImageUrl(game.imageUrl || '');
        } else if (response.status === 404) {
          setError('اللعبة غير موجودة');
        } else {
          setError('فشل في تحميل اللعبة');
        }
      } catch (err) {
        setError('حدث خطأ أثناء تحميل اللعبة');
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchGame();
    }
  }, [params.id]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
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
    setSubmitting(true);

    let finalImageUrl = imageUrl;

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
          alert('فشل في رفع الصورة');
          setSubmitting(false);
          return;
        }
      } catch (error) {
        alert('فشل في رفع الصورة');
        setSubmitting(false);
        return;
      }
    }

    try {
      const response = await fetch(`/api/games/${params.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, description, imageUrl: finalImageUrl || undefined }),
      });

      if (response.ok) {
        await refreshGames();
        alert('تم تحديث اللعبة بنجاح!');
        router.push('/admin/dashboard');
      } else {
        alert('فشل في تحديث اللعبة');
      }
    } catch (error) {
      alert('حدث خطأ أثناء تحديث اللعبة');
    } finally {
      setSubmitting(false);
    }
  };

  if (error) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-bold text-[var(--gaming-danger)]">خطأ</h2>
        <p className="text-[var(--gaming-light)] mt-2">{error}</p>
        <button onClick={() => router.push('/admin/dashboard')} className="mt-4 btn btn-primary">
          العودة للوحة التحكم
        </button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-[var(--gaming-primary)] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-[var(--gaming-light)]">جارٍ تحميل اللعبة...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-[var(--foreground)] mb-2">تعديل اللعبة</h2>
        <p className="text-[var(--gaming-light)]">تعديل معلومات اللعبة</p>
      </div>

      <div className="game-card p-6 max-w-3xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-[var(--gaming-light)] mb-2">العنوان *</label>
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required className="input-field" disabled={submitting} />
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--gaming-light)] mb-2">الوصف *</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} required rows={4} className="input-field resize-none" disabled={submitting} />
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--gaming-light)] mb-2">صورة اللعبة</label>
            <div className="flex items-start gap-4">
              <label className="flex-1 cursor-pointer">
                <div className="flex flex-col items-center justify-center h-32 border-2 border-dashed border-[var(--gaming-light)]/30 rounded-lg bg-[var(--gaming-dark)] hover:bg-[var(--gaming-card-hover)]">
                  {previewUrl || imageUrl ? (
                    <img src={previewUrl || imageUrl} alt="صورة" className="h-24 object-contain" />
                  ) : (
                    <span className="text-[var(--gaming-primary)]">انقر للرفع</span>
                  )}
                  <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} disabled={submitting} />
                </div>
              </label>
              {(previewUrl || imageUrl) && (
                <button type="button" onClick={removeImagePreview} className="btn btn-danger text-sm" disabled={submitting}>إزالة</button>
              )}
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <button type="submit" disabled={submitting} className="btn btn-primary disabled:opacity-50">
              {submitting ? 'جارٍ التحديث...' : 'تحديث اللعبة'}
            </button>
            <button type="button" onClick={() => router.push('/admin/dashboard')} className="btn btn-outline" disabled={submitting}>إلغاء</button>
          </div>
        </form>
      </div>
    </>
  );
}