import { Suspense } from 'react';
import HomePage from '@/components/HomePage';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

export default function Home() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[var(--gaming-dark)] flex items-center justify-center">
        <LoadingSpinner text="جارٍ تحميل الألعاب..." size="lg" />
      </div>
    }>
      <HomePage />
    </Suspense>
  );
}