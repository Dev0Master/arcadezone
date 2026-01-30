"use client";

import { useState, useEffect, createContext, useContext } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';

interface AdminLayoutContextType {
  games: any[];
  setGames: (games: any[]) => void;
  refreshGames: () => Promise<void>;
}

const AdminLayoutContext = createContext<AdminLayoutContextType | null>(null);

export const useAdminLayout = () => {
  const context = useContext(AdminLayoutContext);
  if (!context) {
    throw new Error('useAdminLayout must be used within AdminLayout');
  }
  return context;
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [games, setGames] = useState<any[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const verifyAuth = async () => {
      try {
        const response = await fetch('/api/games', {
          credentials: 'include',
        });
        
        if (response.ok) {
          const data = await response.json();
          setGames(data.games || []);
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
          router.push('/login');
        }
      } catch (error) {
        console.error('Auth error:', error);
        setIsAuthenticated(false);
        router.push('/login');
      }
    };

    verifyAuth();
  }, [router]);

  const refreshGames = async () => {
    try {
      const response = await fetch('/api/games', { credentials: 'include' });
      if (response.ok) {
        const data = await response.json();
        setGames(data.games || []);
      }
    } catch (error) {
      console.error('Error refreshing games:', error);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/admin/logout', {
        method: 'POST',
        credentials: 'include',
      });
      router.push('/login');
      router.refresh();
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const isActive = (path: string) => pathname === path;

  // Show nothing while checking auth
  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen bg-[var(--gaming-dark)] flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-[var(--gaming-primary)] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // If not authenticated, don't render anything (will redirect)
  if (!isAuthenticated) {
    return null;
  }

  return (
    <AdminLayoutContext.Provider value={{ games, setGames, refreshGames }}>
      <div className="flex min-h-screen bg-[var(--gaming-dark)]">
        {/* Sidebar */}
        <div className="w-64 min-w-[16rem] gaming-sidebar flex-shrink-0 sticky top-0 h-screen">
          <div className="p-4 border-b border-[var(--gaming-light)]/30">
            <h1 className="text-xl font-bold text-[var(--gaming-primary)]">لوحة المشرف</h1>
          </div>
          <nav className="p-4">
            <ul className="space-y-2">
              <li>
                <Link 
                  href="/admin/dashboard" 
                  className={`block p-2 rounded transition-colors ${
                    isActive('/admin/dashboard') 
                      ? 'text-[var(--gaming-primary)] font-bold bg-[var(--gaming-card-hover)]' 
                      : 'text-[var(--gaming-light)] hover:bg-[var(--gaming-card-hover)]'
                  }`}
                >
                  لوحة التحكم
                </Link>
              </li>
              <li>
                <Link 
                  href="/admin/games/new" 
                  className={`block p-2 rounded transition-colors ${
                    isActive('/admin/games/new') 
                      ? 'text-[var(--gaming-primary)] font-bold bg-[var(--gaming-card-hover)]' 
                      : 'text-[var(--gaming-light)] hover:bg-[var(--gaming-card-hover)]'
                  }`}
                >
                  إضافة لعبة جديدة
                </Link>
              </li>
              <li>
                <Link 
                  href="/admin/reviews" 
                  className={`block p-2 rounded transition-colors ${
                    isActive('/admin/reviews') 
                      ? 'text-[var(--gaming-primary)] font-bold bg-[var(--gaming-card-hover)]' 
                      : 'text-[var(--gaming-light)] hover:bg-[var(--gaming-card-hover)]'
                  }`}
                >
                  إدارة المراجعات
                </Link>
              </li>
              <li>
                <Link 
                  href="/admin/categories" 
                  className={`block p-2 rounded transition-colors ${
                    isActive('/admin/categories') 
                      ? 'text-[var(--gaming-primary)] font-bold bg-[var(--gaming-card-hover)]' 
                      : 'text-[var(--gaming-light)] hover:bg-[var(--gaming-card-hover)]'
                  }`}
                >
                  الفئات
                </Link>
              </li>
              <li>
                <button
                  onClick={handleLogout}
                  className="w-full text-right p-2 text-[var(--gaming-danger)] hover:bg-[var(--gaming-card-hover)] rounded transition-colors"
                >
                  تسجيل الخروج
                </button>
              </li>
            </ul>
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-6 overflow-x-auto">
          {children}
        </div>
      </div>
    </AdminLayoutContext.Provider>
  );
}
