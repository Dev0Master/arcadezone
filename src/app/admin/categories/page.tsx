"use client";

import { useState, useEffect } from 'react';
import { Category } from '@/lib/types';

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
  });

  useEffect(() => {
    fetchCategories();
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
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      alert('اسم الفئة مطلوب');
      return;
    }

    try {
      const url = editingCategory
        ? `/api/categories/${editingCategory.id}`
        : '/api/categories';
      const method = editingCategory ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name.trim(),
          description: formData.description.trim() || undefined,
        }),
      });

      if (response.ok) {
        setFormData({ name: '', description: '' });
        setShowAddForm(false);
        setEditingCategory(null);
        await fetchCategories();
        alert(editingCategory ? 'تم تحديث الفئة بنجاح!' : 'تم إضافة الفئة بنجاح!');
      } else {
        const data = await response.json();
        alert(data.error || 'فشل في حفظ الفئة');
      }
    } catch (error) {
      console.error('Error saving category:', error);
      alert('حدث خطأ. يرجى المحاولة مرة أخرى.');
    }
  };

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      description: category.description || '',
    });
    setShowAddForm(true);
  };

  const handleDelete = async (categoryId: string) => {
    if (!confirm('هل أنت متأكد من حذف هذه الفئة؟ هذا الإجراء لا يمكن التراجع عنه.')) {
      return;
    }

    try {
      const response = await fetch(`/api/categories/${categoryId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        await fetchCategories();
        alert('تم حذف الفئة بنجاح!');
      } else {
        const data = await response.json();
        alert(data.error || 'فشل في حذف الفئة');
      }
    } catch (error) {
      console.error('Error deleting category:', error);
      alert('حدث خطأ. يرجى المحاولة مرة أخرى.');
    }
  };

  const cancelForm = () => {
    setFormData({ name: '', description: '' });
    setShowAddForm(false);
    setEditingCategory(null);
  };

  return (
    <>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-[var(--foreground)] mb-2">إدارة الفئات</h2>
          <p className="text-[var(--gaming-light)]">
            إدارة فئات الألعاب لتنظيم مجموعة الألعاب الخاصة بك
          </p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="btn btn-primary"
        >
          إضافة فئة جديدة
        </button>
      </div>

      {/* Add/Edit Form */}
      {showAddForm && (
        <div className="game-card p-6 mb-6">
          <h3 className="text-lg font-bold text-[var(--foreground)] mb-4">
            {editingCategory ? 'تعديل الفئة' : 'إضافة فئة جديدة'}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[var(--gaming-light)] mb-1">
                اسم الفئة *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="input-field"
                placeholder="مثال: أكشن، مغامرة، تقمص الأدوار"
                required
                maxLength={50}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[var(--gaming-light)] mb-1">
                الوصف
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="input-field h-24 resize-none"
                placeholder="وصف موجز لهذه الفئة..."
                maxLength={200}
              />
            </div>
            <div className="flex gap-2">
              <button type="submit" className="btn btn-primary">
                {editingCategory ? 'تحديث الفئة' : 'إضافة الفئة'}
              </button>
              <button type="button" onClick={cancelForm} className="btn btn-outline">
                إلغاء
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Categories List */}
      {loading ? (
        <div className="game-card p-12 text-center">
          <div className="w-8 h-8 border-4 border-[var(--gaming-primary)] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-[var(--gaming-light)]">جارٍ تحميل الفئات...</p>
        </div>
      ) : categories.length === 0 ? (
        <div className="game-card p-12 text-center">
          <h3 className="text-xl font-bold text-[var(--foreground)] mb-4">لا توجد فئات بعد</h3>
          <p className="text-[var(--gaming-light)] mb-6">
            ابدأ في تنظيم ألعابك عن طريق إنشاء فئات.
          </p>
          <button
            onClick={() => setShowAddForm(true)}
            className="btn btn-primary"
          >
            أنشئ أول فئة لك
          </button>
        </div>
      ) : (
        <div className="game-card">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
            {categories.map((category) => (
              <div
                key={category.id}
                className="bg-[var(--gaming-dark)] rounded-lg p-4 border border-[var(--gaming-light)]/20"
              >
                <h4 className="text-lg font-bold text-[var(--foreground)] mb-2">
                  {category.name}
                </h4>
                {category.description && (
                  <p className="text-[var(--gaming-light)] text-sm mb-4 line-clamp-3">
                    {category.description}
                  </p>
                )}
                <div className="flex justify-between items-center">
                  <span className="text-xs text-[var(--gaming-light)]">
                    إنشاء: {new Date(category.createdAt).toLocaleDateString()}
                  </span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(category)}
                      className="text-[var(--gaming-primary)] hover:text-[var(--gaming-accent)] text-sm"
                    >
                      تعديل
                    </button>
                    <button
                      onClick={() => handleDelete(category.id)}
                      className="text-[var(--gaming-danger)] hover:text-red-400 text-sm"
                    >
                      حذف
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
