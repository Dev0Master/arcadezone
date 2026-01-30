"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { href: '/', label: 'الرئيسية', icon: '🏠' },
    { href: '/categories', label: 'الفئات', icon: '📂' },
  ];

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled
          ? 'bg-[var(--gaming-dark)]/95 backdrop-blur-xl shadow-2xl shadow-[var(--gaming-primary)]/10 py-2'
          : 'bg-transparent py-3'
      }`}
    >
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="group flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-[var(--gaming-primary)] to-[var(--gaming-secondary)] flex items-center justify-center transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-lg shadow-[var(--gaming-primary)]/30">
                <span className="text-xl sm:text-2xl">🎮</span>
              </div>
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-[var(--gaming-accent)] rounded-full animate-pulse" />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-[var(--gaming-primary)] via-[var(--gaming-secondary)] to-[var(--gaming-accent)] bg-clip-text text-transparent">
                أركيد زون
              </h1>
              <p className="text-[10px] sm:text-xs text-[var(--gaming-light)]/60">متجر الألعاب</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`relative px-5 py-2.5 rounded-xl font-medium transition-all duration-300 group ${
                  isActive(link.href)
                    ? 'bg-gradient-to-r from-[var(--gaming-primary)] to-[var(--gaming-secondary)] text-white shadow-lg shadow-[var(--gaming-primary)]/30'
                    : 'text-[var(--gaming-light)] hover:text-white hover:bg-white/10'
                }`}
              >
                <span className="flex items-center gap-2">
                  <span className="text-lg">{link.icon}</span>
                  {link.label}
                </span>
                {!isActive(link.href) && (
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-[var(--gaming-primary)] to-[var(--gaming-accent)] group-hover:w-3/4 transition-all duration-300 rounded-full" />
                )}
              </Link>
            ))}
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
          >
            <div className="w-6 h-5 flex flex-col justify-between">
              <span className={`h-0.5 bg-[var(--gaming-light)] rounded transition-all duration-300 ${isMobileMenuOpen ? 'rotate-45 translate-y-2' : ''}`} />
              <span className={`h-0.5 bg-[var(--gaming-light)] rounded transition-all duration-300 ${isMobileMenuOpen ? 'opacity-0' : ''}`} />
              <span className={`h-0.5 bg-[var(--gaming-light)] rounded transition-all duration-300 ${isMobileMenuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
            </div>
          </button>
        </div>

        {/* Mobile Menu */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-500 ${
            isMobileMenuOpen ? 'max-h-96 opacity-100 mt-4' : 'max-h-0 opacity-0'
          }`}
        >
          <nav className="bg-[var(--gaming-card-bg)]/80 backdrop-blur-xl rounded-2xl p-4 space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                  isActive(link.href)
                    ? 'bg-gradient-to-r from-[var(--gaming-primary)] to-[var(--gaming-secondary)] text-white'
                    : 'text-[var(--gaming-light)] hover:bg-white/5'
                }`}
              >
                <span className="text-xl">{link.icon}</span>
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
}
