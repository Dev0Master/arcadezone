"use client";

import { useState, useEffect } from 'react';
import SearchBar from '@/components/search/SearchBar';

interface HeroSectionProps {
  onSearch?: (query: string) => void;
  gamesCount?: number;
}

export default function HeroSection({ onSearch, gamesCount = 0 }: HeroSectionProps) {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth - 0.5) * 20,
        y: (e.clientY / window.innerHeight - 0.5) * 20,
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const floatingEmojis = ['🎮', '🕹️', '👾', '🎯', '⚔️', '🏆', '💎', '🔥'];

  return (
    <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden pt-20">
      {/* Animated Background */}
      <div className="absolute inset-0">
        {/* Gradient Orbs */}
        <div
          className="absolute top-1/4 right-1/4 w-96 h-96 bg-[var(--gaming-primary)]/30 rounded-full blur-3xl transition-transform duration-300"
          style={{ transform: `translate(${mousePosition.x}px, ${mousePosition.y}px)` }}
        />
        <div
          className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-[var(--gaming-secondary)]/20 rounded-full blur-3xl transition-transform duration-300"
          style={{ transform: `translate(${-mousePosition.x}px, ${-mousePosition.y}px)` }}
        />
        <div
          className="absolute top-1/2 left-1/2 w-64 h-64 bg-[var(--gaming-accent)]/20 rounded-full blur-3xl transition-transform duration-300"
          style={{ transform: `translate(${mousePosition.x * 0.5}px, ${mousePosition.y * 0.5}px)` }}
        />

        {/* Grid Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div
            className="w-full h-full"
            style={{
              backgroundImage: `linear-gradient(var(--gaming-primary) 1px, transparent 1px),
                               linear-gradient(90deg, var(--gaming-primary) 1px, transparent 1px)`,
              backgroundSize: '50px 50px',
            }}
          />
        </div>

        {/* Floating Emojis */}
        {floatingEmojis.map((emoji, i) => (
          <div
            key={i}
            className="absolute animate-float text-4xl opacity-20"
            style={{
              top: `${15 + (i * 12) % 70}%`,
              left: `${5 + (i * 13) % 90}%`,
              animationDelay: `${i * 0.5}s`,
              animationDuration: `${4 + (i % 3)}s`,
            }}
          >
            {emoji}
          </div>
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm mb-8 animate-fadeInUp">
          <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          <span className="text-sm text-[var(--gaming-light)]/80">+{gamesCount} لعبة متاحة الآن</span>
        </div>

        {/* Main Title */}
        <h1 className="text-5xl md:text-7xl font-black mb-6 animate-fadeInUp animation-delay-100">
          <span className="bg-gradient-to-r from-[var(--gaming-primary)] via-[var(--gaming-secondary)] to-[var(--gaming-accent)] bg-clip-text text-transparent">
            أركيد زون
          </span>
          <br />
          <span className="text-white">للألعاب الرائعة</span>
        </h1>

        {/* Subtitle */}
        <p className="text-xl md:text-2xl text-[var(--gaming-light)]/70 mb-10 max-w-2xl mx-auto leading-relaxed animate-fadeInUp animation-delay-200">
          استكشف مجموعة ضخمة من الألعاب، شارك تقييمك، واكتشف ما يحبه اللاعبون حول العالم
        </p>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-10 animate-fadeInUp animation-delay-300">
          <div className="relative">
            <SearchBar onSearch={onSearch} />
          </div>
        </div>

        {/* Stats */}
        <div className="flex flex-wrap justify-center gap-8 animate-fadeInUp animation-delay-400">
          {[
            { value: `${gamesCount}+`, label: 'لعبة', icon: '🎮' },
            { value: '1000+', label: 'مراجعة', icon: '⭐' },
            { value: '50+', label: 'فئة', icon: '📂' },
          ].map((stat, i) => (
            <div
              key={i}
              className="flex items-center gap-3 px-6 py-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm hover:bg-white/10 hover:border-[var(--gaming-primary)]/30 transition-all duration-300 group"
            >
              <span className="text-2xl group-hover:scale-125 transition-transform duration-300">{stat.icon}</span>
              <div className="text-right">
                <div className="text-2xl font-bold text-white">{stat.value}</div>
                <div className="text-sm text-[var(--gaming-light)]/60">{stat.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-8 h-12 rounded-full border-2 border-white/20 flex justify-center pt-2">
            <div className="w-1.5 h-3 rounded-full bg-[var(--gaming-primary)] animate-scroll" />
          </div>
        </div>
      </div>
    </section>
  );
}
