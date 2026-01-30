"use client";

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

// Dynamic import Lottie to avoid SSR issues
const Lottie = dynamic(() => import('lottie-react'), { ssr: false });

interface LoadingSpinnerProps {
  text?: string;
  size?: 'sm' | 'md' | 'lg';
  fullScreen?: boolean;
  showHeader?: boolean;
}

export default function LoadingSpinner({ 
  text = "جارٍ التحميل...", 
  size = 'md',
  fullScreen = false,
  showHeader = false
}: LoadingSpinnerProps) {
  const [animationData, setAnimationData] = useState<object | null>(null);

  useEffect(() => {
    fetch('/GameController.json')
      .then(res => res.json())
      .then(data => setAnimationData(data))
      .catch(err => console.error('Failed to load animation:', err));
  }, []);

  const sizeClasses = {
    sm: 'w-24 h-24',
    md: 'w-48 h-48',
    lg: 'w-64 h-64'
  };

  const textSizeClasses = {
    sm: 'text-sm',
    md: 'text-xl',
    lg: 'text-2xl'
  };

  const content = (
    <div className="text-center">
      <div className={`${sizeClasses[size]} mx-auto mb-4`}>
        {animationData ? (
          <Lottie
            animationData={animationData}
            loop={true}
            className="w-full h-full"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="w-16 h-16 border-4 border-[var(--gaming-primary)] border-t-transparent rounded-full animate-spin" />
          </div>
        )}
      </div>
      <p className={`${textSizeClasses[size]} text-[var(--gaming-light)]/80 animate-pulse`}>{text}</p>
    </div>
  );

  if (fullScreen) {
    return (
      <div className="min-h-screen bg-[var(--gaming-dark)] flex items-center justify-center">
        {content}
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center p-8">
      {content}
    </div>
  );
}
