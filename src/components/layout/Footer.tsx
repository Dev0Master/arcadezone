"use client";

import Link from 'next/link';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { href: '/', label: 'الرئيسية' },
    { href: '/categories', label: 'الفئات' },
    { href: '/login', label: 'لوحة التحكم' },
  ];

  const categories = [
    { name: 'ألعاب أكشن', emoji: '⚔️' },
    { name: 'ألعاب مغامرات', emoji: '🗺️' },
    { name: 'ألعاب رياضية', emoji: '⚽' },
    { name: 'ألعاب سباق', emoji: '🏎️' },
  ];

  return (
    <footer className="relative mt-20">
      {/* Decorative Top Border */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[var(--gaming-primary)] to-transparent" />
      
      {/* Glow Effect */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-32 bg-[var(--gaming-primary)]/20 blur-3xl pointer-events-none" />

      <div className="relative bg-gradient-to-b from-[var(--gaming-dark)] to-[var(--gaming-card-bg)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8">
          {/* Main Footer Content */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
            {/* Brand Section */}
            <div className="lg:col-span-2">
              <Link href="/" className="inline-flex items-center gap-3 mb-4 group">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[var(--gaming-primary)] to-[var(--gaming-secondary)] flex items-center justify-center shadow-xl shadow-[var(--gaming-primary)]/20 group-hover:shadow-[var(--gaming-primary)]/40 transition-all duration-300">
                  <span className="text-3xl">🎮</span>
                </div>
                <div>
                  <h3 className="text-2xl font-bold bg-gradient-to-r from-[var(--gaming-primary)] to-[var(--gaming-accent)] bg-clip-text text-transparent">
                    أركيد زون
                  </h3>
                  <p className="text-sm text-[var(--gaming-light)]/60">متجر الألعاب الأول</p>
                </div>
              </Link>
              <p className="text-[var(--gaming-light)]/70 leading-relaxed max-w-md mb-6">
                اكتشف عالماً من الألعاب المذهلة في أركيد زون. نقدم لك أفضل الألعاب بتقييمات حقيقية من اللاعبين.
              </p>
              
              {/* Social Links */}
              <div className="flex items-center gap-3">
                {['🐦', '📘', '📸', '🎬'].map((emoji, i) => (
                  <button
                    key={i}
                    className="w-10 h-10 rounded-xl bg-white/5 hover:bg-gradient-to-br hover:from-[var(--gaming-primary)] hover:to-[var(--gaming-secondary)] flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-[var(--gaming-primary)]/30"
                  >
                    <span className="text-lg">{emoji}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-lg font-bold text-white mb-5 flex items-center gap-2">
                <span className="w-8 h-8 rounded-lg bg-[var(--gaming-primary)]/20 flex items-center justify-center">
                  🔗
                </span>
                روابط سريعة
              </h4>
              <ul className="space-y-3">
                {quickLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-[var(--gaming-light)]/70 hover:text-[var(--gaming-primary)] transition-colors duration-300 flex items-center gap-2 group"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-[var(--gaming-primary)]/50 group-hover:bg-[var(--gaming-primary)] group-hover:scale-150 transition-all duration-300" />
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Categories */}
            <div>
              <h4 className="text-lg font-bold text-white mb-5 flex items-center gap-2">
                <span className="w-8 h-8 rounded-lg bg-[var(--gaming-secondary)]/20 flex items-center justify-center">
                  🎯
                </span>
                فئات الألعاب
              </h4>
              <ul className="space-y-3">
                {categories.map((cat, i) => (
                  <li key={i}>
                    <span className="text-[var(--gaming-light)]/70 flex items-center gap-2">
                      <span>{cat.emoji}</span>
                      {cat.name}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Newsletter Section */}
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[var(--gaming-primary)]/20 to-[var(--gaming-secondary)]/20 p-8 mb-12">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--gaming-primary)]/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-[var(--gaming-secondary)]/10 rounded-full blur-3xl" />
            
            <div className="relative flex flex-col md:flex-row items-center justify-between gap-6">
              <div>
                <h4 className="text-xl font-bold text-white mb-2">📬 اشترك في نشرتنا البريدية</h4>
                <p className="text-[var(--gaming-light)]/70">احصل على آخر أخبار الألعاب والعروض الحصرية</p>
              </div>
              <div className="flex w-full md:w-auto gap-3">
                <input
                  type="email"
                  placeholder="بريدك الإلكتروني"
                  className="flex-1 md:w-64 px-5 py-3 rounded-xl bg-[var(--gaming-dark)]/50 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-[var(--gaming-primary)] transition-colors"
                />
                <button className="px-6 py-3 rounded-xl bg-gradient-to-r from-[var(--gaming-primary)] to-[var(--gaming-secondary)] text-white font-semibold hover:shadow-lg hover:shadow-[var(--gaming-primary)]/30 transition-all duration-300 hover:scale-105">
                  اشترك
                </button>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-8 border-t border-white/10">
            <p className="text-[var(--gaming-light)]/50 text-sm">
              © {currentYear} أركيد زون. جميع الحقوق محفوظة.
            </p>
            <div className="flex items-center gap-6 text-sm text-[var(--gaming-light)]/50">
              <span className="hover:text-[var(--gaming-primary)] cursor-pointer transition-colors">سياسة الخصوصية</span>
              <span className="hover:text-[var(--gaming-primary)] cursor-pointer transition-colors">الشروط والأحكام</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
