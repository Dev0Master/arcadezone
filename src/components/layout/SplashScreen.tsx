"use client";

import { useState, useEffect } from 'react';
import Lottie from 'lottie-react';

interface SplashScreenProps {
  onComplete: () => void;
}

export default function SplashScreen({ onComplete }: SplashScreenProps) {
  const [fadeOut, setFadeOut] = useState(false);
  const [animationData, setAnimationData] = useState<object | null>(null);

  useEffect(() => {
    // Load the Lottie animation data
    fetch('/GameController.json')
      .then(res => res.json())
      .then(data => setAnimationData(data))
      .catch(err => {
        console.error('Failed to load animation:', err);
        // If animation fails to load, complete after delay
        setTimeout(() => onComplete(), 1000);
      });
  }, [onComplete]);

  const handleAnimationComplete = () => {
    // Start fade out animation
    setFadeOut(true);
    // Wait for fade out to complete before calling onComplete
    setTimeout(() => {
      onComplete();
    }, 500);
  };

  // Show loading state while animation is being fetched
  if (!animationData) {
    return (
      <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-[var(--gaming-dark)]">
        <div className="animate-spin w-12 h-12 border-4 border-[var(--gaming-primary)] border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[var(--gaming-dark)] transition-opacity duration-500 ${
        fadeOut ? 'opacity-0' : 'opacity-100'
      }`}
    >
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-[var(--gaming-primary)]/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-[var(--gaming-secondary)]/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      {/* Lottie Animation */}
      <div className="relative z-10 w-64 h-64 sm:w-80 sm:h-80">
        <Lottie
          animationData={animationData}
          loop={false}
          onComplete={handleAnimationComplete}
          className="w-full h-full"
        />
      </div>

      {/* Logo Text */}
      <div className="relative z-10 mt-6 text-center">
        <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-[var(--gaming-primary)] via-purple-500 to-[var(--gaming-secondary)] bg-clip-text text-transparent animate-pulse">
          أركيد زون
        </h1>
        <p className="mt-2 text-[var(--gaming-light)]/60 text-sm sm:text-base">
          عالم الألعاب بين يديك
        </p>
      </div>

      {/* Loading Bar */}
      <div className="relative z-10 mt-8 w-48 h-1 bg-white/10 rounded-full overflow-hidden">
        <div className="h-full bg-gradient-to-r from-[var(--gaming-primary)] to-[var(--gaming-secondary)] rounded-full animate-loading-bar" />
      </div>
    </div>
  );
}
