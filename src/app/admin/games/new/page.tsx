"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AddGamePage() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

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
          alert(errorData.error || 'Failed to upload image');
          setLoading(false);
          return;
        }
      } catch (error) {
        console.error('Error uploading image:', error);
        alert('Failed to upload image');
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
        }),
      });

      if (response.ok) {
        router.push('/admin/dashboard');
        router.refresh();
      } else {
        const errorData = await response.json();
        alert(errorData.error || 'Failed to add game');
      }
    } catch (error) {
      console.error('Error adding game:', error);
      alert('An error occurred while adding the game');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen p-4">
      <div className="flex-1 max-w-3xl mx-auto game-card p-6">
        <h1 className="text-2xl font-bold text-[var(--foreground)] mb-6">Add New Game</h1>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="title" className="block text-sm font-medium text-[var(--gaming-light)] mb-1">
              Title *
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="input-field"
              placeholder="Enter game title"
            />
          </div>

          <div className="mb-6">
            <label htmlFor="description" className="block text-sm font-medium text-[var(--gaming-light)] mb-1">
              Description *
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              rows={4}
              className="input-field"
              placeholder="Enter game description"
            ></textarea>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-[var(--gaming-light)] mb-1">
              Game Image
            </label>

            {/* Image Upload */}
            <div className="flex items-center space-x-4">
              <div className="flex-1">
                <label className="block w-full cursor-pointer">
                  <div className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-[var(--gaming-light)/30] rounded-lg bg-[var(--gaming-dark)] hover:bg-[var(--gaming-card-hover)]">
                    {previewUrl ? (
                      <div className="flex flex-col items-center">
                        <img src={previewUrl} alt="Preview" className="h-24 w-auto object-contain" />
                        <span className="mt-1 text-xs text-[var(--gaming-light)]">Click to change</span>
                      </div>
                    ) : imageUrl ? (
                      <div className="flex flex-col items-center">
                        <img src={imageUrl} alt="Current" className="h-24 w-auto object-contain" />
                        <span className="mt-1 text-xs text-[var(--gaming-light)]">Using URL</span>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center pt-4">
                        <svg className="w-8 h-8 text-[var(--gaming-primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                        </svg>
                        <span className="mt-2 text-sm text-[var(--gaming-light)]">
                          <span className="font-medium text-[var(--gaming-primary)]">Click to upload</span> or drag and drop
                        </span>
                        <p className="text-xs text-[var(--gaming-light)]">PNG, JPG, GIF up to 5MB</p>
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
                    Remove
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="flex space-x-4">
            <button
              type="submit"
              disabled={loading}
              className={`btn ${loading ? 'btn-outline' : 'btn-primary'}`}
            >
              {loading ? 'Adding...' : 'Add Game'}
            </button>

            <button
              type="button"
              onClick={() => router.back()}
              className="btn btn-outline"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}