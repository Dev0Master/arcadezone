import { Suspense } from 'react';
import HomePage from '@/components/HomePage';

export default function Home() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="text-2xl font-semibold text-[var(--gaming-primary)]">جارٍ تحميل الألعاب...</div>
      </div>
    }>
      <HomePage />
    </Suspense>
  );
}