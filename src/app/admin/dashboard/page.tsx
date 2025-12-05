"use client";

import { useState, useEffect } from 'react';
import { Game } from '../../../lib/types';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function AdminDashboard() {
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // First, verify that the user is authenticated by making a simple authenticated API call
    const verifyAuth = async () => {
      try {
        const response = await fetch('/api/games');
        if (response.status === 401 || response.status === 403) {
          // If unauthorized, redirect to login
          router.push('/admin/login');
          return;
        }

        if (response.ok) {
          const data = await response.json();
          setGames(data.games);
        } else {
          // Handle other errors
          router.push('/admin/login');
        }
      } catch (error) {
        console.error('Error verifying authentication or fetching games:', error);
        router.push('/admin/login');
      } finally {
        setLoading(false);
      }
    };

    verifyAuth();
  }, [router]);

  const handleLogout = async () => {
    try {
      await fetch('/api/admin/logout', {
        method: 'POST',
      });

      // Clear the auth cookie
      document.cookie = 'auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';

      router.push('/admin/login');
      router.refresh();
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="text-2xl font-semibold text-[var(--gaming-primary)]">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <div className="w-64 gaming-sidebar">
        <div className="p-4 border-b border-[var(--gaming-light)/30]">
          <h1 className="text-xl font-bold text-[var(--gaming-primary)]">Admin Panel</h1>
        </div>
        <nav className="p-4">
          <ul className="space-y-2">
            <li>
              <Link href="/admin/dashboard" className="block p-2 text-[var(--gaming-primary)] font-bold">
                Dashboard
              </Link>
            </li>
            <li>
              <Link href="/admin/games/new" className="block p-2 text-[var(--gaming-light)] hover:bg-[var(--gaming-card-hover)] rounded">
                Add New Game
              </Link>
            </li>
            <li>
              <button
                onClick={handleLogout}
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
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-[var(--foreground)]">Game Dashboard</h2>
          <div className="text-lg font-semibold text-[var(--gaming-accent)]">
            Total Games: <span className="text-[var(--gaming-primary)]">{games.length}</span>
          </div>
        </div>

        {games.length === 0 ? (
          <div className="game-card p-6 text-center">
            <p className="text-[var(--gaming-light)]">No games in the store yet. Add your first game!</p>
            <Link
              href="/admin/games/new"
              className="mt-4 inline-block btn btn-primary"
            >
              Add Your First Game
            </Link>
          </div>
        ) : (
          <div className="game-card overflow-hidden">
            <table className="gaming-table">
              <thead>
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[var(--gaming-light)] uppercase tracking-wider">Title</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[var(--gaming-light)] uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--gaming-light)/20]">
                {games.map((game) => (
                  <tr key={game.id} className="hover:bg-[var(--gaming-card-hover)]">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-bold text-[var(--foreground)]">{game.title}</div>
                      <div className="text-sm text-[var(--gaming-light)] line-clamp-1">{game.description}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <Link
                        href={`/admin/games/edit/${game.id}`}
                        className="btn btn-outline mr-2"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={async () => {
                          if (confirm('Are you sure you want to delete this game?')) {
                            const response = await fetch(`/api/games/${game.id}`, {
                              method: 'DELETE',
                            });
                            if (response.ok) {
                              setGames(games.filter(g => g.id !== game.id));
                            } else {
                              alert('Failed to delete game');
                            }
                          }
                        }}
                        className="btn btn-danger"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}