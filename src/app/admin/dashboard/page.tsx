"use client";

import { Game } from '@/lib/types';
import Link from 'next/link';
import StarRating from '@/components/ratings/StarRating';
import { useAdminLayout } from '../layout';

export default function AdminDashboard() {
  const { games, setGames } = useAdminLayout();

  return (
    <>
      <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
        <h2 className="text-2xl font-bold text-[var(--foreground)]">لوحة تحكم الألعاب</h2>
        <div className="text-lg font-semibold text-[var(--gaming-accent)] whitespace-nowrap">
          إجمالي الألعاب: <span className="text-[var(--gaming-primary)]">{games.length}</span>
        </div>
      </div>

      {games.length === 0 ? (
        <div className="game-card p-6 text-center">
          <p className="text-[var(--gaming-light)]">لا توجد ألعاب في المتجر حتى الآن. أضف أول لعبة!</p>
          <Link
            href="/admin/games/new"
            className="mt-4 inline-block btn btn-primary"
          >
            أضف أول لعبة
          </Link>
        </div>
      ) : (
        <div className="game-card overflow-x-auto">
          <table className="gaming-table w-full min-w-[700px]">
            <thead>
              <tr>
                <th className="px-4 py-3 text-right text-xs font-medium text-[var(--gaming-light)] uppercase tracking-wider">العنوان</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-[var(--gaming-light)] uppercase tracking-wider">التقييم</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-[var(--gaming-light)] uppercase tracking-wider">المراجعات</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-[var(--gaming-light)] uppercase tracking-wider">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--gaming-light)]/20">
              {games.map((game: Game) => (
                <tr key={game.id} className="hover:bg-[var(--gaming-card-hover)]">
                  <td className="px-4 py-4 text-right">
                    <div className="text-sm font-bold text-[var(--foreground)]">{game.title}</div>
                    <div className="text-sm text-[var(--gaming-light)] line-clamp-1 max-w-xs">{game.description}</div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-right">
                    {game.averageRating ? (
                      <div className="flex items-center gap-2 justify-end">
                        <span className="text-sm text-[var(--gaming-light)]">
                          {game.averageRating.toFixed(1)}
                        </span>
                        <StarRating rating={game.averageRating} readonly size="sm" />
                      </div>
                    ) : (
                      <span className="text-sm text-[var(--gaming-light)]">لا توجد تقييمات</span>
                    )}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-right">
                    <span className="text-sm text-[var(--gaming-light)]">
                      {game.totalRatings || 0} مراجعة
                    </span>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex gap-2 justify-start">
                      <button
                        onClick={async () => {
                          if (confirm('هل أنت متأكد من حذف هذه اللعبة؟')) {
                            const response = await fetch(`/api/games/${game.id}`, {
                              method: 'DELETE',
                            });
                            if (response.ok) {
                              setGames(games.filter((g: Game) => g.id !== game.id));
                            } else {
                              alert('فشل في حذف اللعبة');
                            }
                          }
                        }}
                        className="btn btn-danger text-sm px-3 py-1"
                      >
                        حذف
                      </button>
                      <Link
                        href={`/admin/games/edit/${game.id}`}
                        className="btn btn-outline text-sm px-3 py-1"
                      >
                        تعديل
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
