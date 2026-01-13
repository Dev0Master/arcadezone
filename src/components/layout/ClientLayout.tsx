"use client";

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';

// Dynamic import to avoid SSR issues with Lottie
const SplashScreen = dynamic(() => import('@/components/layout/SplashScreen'), {
  ssr: false,
});

interface ClientLayoutProps {
  children: React.ReactNode;
}

export default function ClientLayout({ children }: ClientLayoutProps) {
  const [showSplash, setShowSplash] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Check if user has already seen splash in this session
    const hasSeenSplash = sessionStorage.getItem('arcadezone_splash_seen');
    if (hasSeenSplash) {
      setShowSplash(false);
    }
  }, []);

  const handleSplashComplete = () => {
    setShowSplash(false);
    sessionStorage.setItem('arcadezone_splash_seen', 'true');
  };

  // Don't render anything until mounted (avoids hydration issues)
  if (!mounted) {
    return null;
  }

  return (
    <>
      {showSplash && (
        <SplashScreen onComplete={handleSplashComplete} />
      )}
      <div className={showSplash ? 'hidden' : 'block'}>
        {children}
      </div>
    </>
  );
}
