"use client";

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        // Create a simple auth token (timestamp-based) to store in cookie
        const authToken = `auth_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

        // Store the auth token in a cookie
        document.cookie = `auth_token=${authToken}; path=/; max-age=86400; SameSite=Strict`;

        router.push('/admin/dashboard');
        router.refresh();
      } else {
        const data = await response.json();
        setError(data.error || 'Invalid credentials');
      }
    } catch (err) {
      setError('An error occurred during login');
      console.error(err);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-md game-card p-8">
        <div className="gaming-header rounded-t-xl -m-8 mb-6">
          <h1 className="text-2xl font-bold text-white">Admin Login</h1>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-[var(--gaming-danger)] text-white rounded-md">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label htmlFor="username" className="block text-sm font-medium text-[var(--gaming-light)] mb-1">
              Username
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="input-field"
              required
            />
          </div>

          <div className="mb-6">
            <label htmlFor="password" className="block text-sm font-medium text-[var(--gaming-light)] mb-1">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input-field"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full btn btn-primary"
          >
            Sign In
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-[var(--gaming-light)]">
          Default credentials: admin / admin123
        </p>
      </div>
    </div>
  );
}