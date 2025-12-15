"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
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
  const router = useRouter();

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
      alert('Category name is required');
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
        // Reset form
        setFormData({ name: '', description: '' });
        setShowAddForm(false);
        setEditingCategory(null);
        // Refresh categories
        await fetchCategories();
        alert(editingCategory ? 'Category updated successfully!' : 'Category added successfully!');
      } else {
        const data = await response.json();
        alert(data.error || 'Failed to save category');
      }
    } catch (error) {
      console.error('Error saving category:', error);
      alert('An error occurred. Please try again.');
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
    if (!confirm('Are you sure you want to delete this category? This action cannot be undone.')) {
      return;
    }

    try {
      const response = await fetch(`/api/categories/${categoryId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        await fetchCategories();
        alert('Category deleted successfully!');
      } else {
        const data = await response.json();
        alert(data.error || 'Failed to delete category');
      }
    } catch (error) {
      console.error('Error deleting category:', error);
      alert('An error occurred. Please try again.');
    }
  };

  const cancelForm = () => {
    setFormData({ name: '', description: '' });
    setShowAddForm(false);
    setEditingCategory(null);
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="text-2xl font-semibold text-[var(--gaming-primary)]">Loading categories...</div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <div className="w-64 gaming-sidebar">
        <div className="p-4 border-b border-[var(--gaming-light)]/30">
          <h1 className="text-xl font-bold text-[var(--gaming-primary)]">Admin Panel</h1>
        </div>
        <nav className="p-4">
          <ul className="space-y-2">
            <li>
              <a href="/admin/dashboard" className="block p-2 text-[var(--gaming-light)] hover:bg-[var(--gaming-card-hover)] rounded">
                Dashboard
              </a>
            </li>
            <li>
              <a href="/admin/games/new" className="block p-2 text-[var(--gaming-light)] hover:bg-[var(--gaming-card-hover)] rounded">
                Add New Game
              </a>
            </li>
            <li>
              <a href="/admin/reviews" className="block p-2 text-[var(--gaming-light)] hover:bg-[var(--gaming-card-hover)] rounded">
                Reviews Management
              </a>
            </li>
            <li>
              <a href="/admin/categories" className="block p-2 text-[var(--gaming-primary)] font-bold">
                Categories
              </a>
            </li>
            <li>
              <button
                onClick={() => router.push('/login')}
                className="w-full text-left p-2 text-[var(--gaming-light)] hover:bg-[var(--gaming-card-hover)] rounded"
              >
                Logout
              </button>
            </li>
          </ul>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6 bg-[var(--background)]">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold text-[var(--foreground)] mb-2">Category Management</h2>
            <p className="text-[var(--gaming-light)]">
              Manage game categories for organizing your game collection
            </p>
          </div>
          <button
            onClick={() => setShowAddForm(true)}
            className="btn btn-primary"
          >
            Add New Category
          </button>
        </div>

        {/* Add/Edit Form */}
        {showAddForm && (
          <div className="game-card p-6 mb-6">
            <h3 className="text-lg font-bold text-[var(--foreground)] mb-4">
              {editingCategory ? 'Edit Category' : 'Add New Category'}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[var(--gaming-light)] mb-1">
                  Category Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="input-field"
                  placeholder="e.g., Action, Adventure, RPG"
                  required
                  maxLength={50}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--gaming-light)] mb-1">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="input-field h-24 resize-none"
                  placeholder="Brief description of this category..."
                  maxLength={200}
                />
              </div>
              <div className="flex gap-2">
                <button type="submit" className="btn btn-primary">
                  {editingCategory ? 'Update Category' : 'Add Category'}
                </button>
                <button type="button" onClick={cancelForm} className="btn btn-outline">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Categories List */}
        {categories.length === 0 ? (
          <div className="game-card p-12 text-center">
            <h3 className="text-xl font-bold text-[var(--foreground)] mb-4">No Categories Yet</h3>
            <p className="text-[var(--gaming-light)] mb-6">
              Start organizing your games by creating categories.
            </p>
            <button
              onClick={() => setShowAddForm(true)}
              className="btn btn-primary"
            >
              Create Your First Category
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
                      Created: {new Date(category.createdAt).toLocaleDateString()}
                    </span>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(category)}
                        className="text-[var(--gaming-primary)] hover:text-[var(--gaming-accent)] text-sm"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(category.id)}
                        className="text-[var(--gaming-danger)] hover:text-red-400 text-sm"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}