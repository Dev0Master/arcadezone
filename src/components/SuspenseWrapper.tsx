"use client";

import { Suspense } from 'react';
import HomePage from '@/app/page';

export default function SuspenseWrapper() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="text-2xl font-semibold text-[var(--gaming-primary)]">Loading...</div>
      </div>
    }>
      <HomePage />
    </Suspense>
  );
}