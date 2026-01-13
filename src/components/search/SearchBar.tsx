"use client";

import { useState, useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

interface SearchBarProps {
  placeholder?: string;
  onSearch?: (query: string) => void;
}

export default function SearchBar({ placeholder = "ابحث عن الألعاب...", onSearch }: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const urlQuery = searchParams.get('q');
    if (urlQuery) {
      setQuery(urlQuery);
    }
  }, [searchParams]);

  useEffect(() => {
    if (query.length > 2) {
      fetchSuggestions();
    } else {
      setSuggestions([]);
    }
  }, [query]);

  const fetchSuggestions = async () => {
    try {
      const response = await fetch(`/api/games/search?q=${encodeURIComponent(query)}&limit=5`);
      if (response.ok) {
        const data = await response.json();
        const titles = data.games.map((game: any) => game.title);
        setSuggestions(titles);
      }
    } catch (error) {
      console.error('Error fetching suggestions:', error);
    }
  };

  const handleSearch = (searchQuery: string = query) => {
    if (onSearch) {
      onSearch(searchQuery);
    } else {
      const params = new URLSearchParams();
      if (searchQuery.trim()) {
        params.set('q', searchQuery.trim());
      }
      const queryString = params.toString();
      router.push(queryString ? `/?${queryString}` : '/');
    }
    setShowSuggestions(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch();
  };

  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion);
    handleSearch(suggestion);
  };

  return (
    <div className="relative w-full max-w-2xl">
      <form onSubmit={handleSubmit} className="relative">
        {/* Glow Effect */}
        <div className={`absolute -inset-1 bg-gradient-to-r from-[var(--gaming-primary)] via-[var(--gaming-secondary)] to-[var(--gaming-accent)] rounded-2xl blur-lg transition-opacity duration-500 ${isFocused ? 'opacity-50' : 'opacity-0'}`} />
        
        {/* Search Container */}
        <div className={`relative flex items-center bg-[var(--gaming-dark)]/90 backdrop-blur-xl border rounded-2xl transition-all duration-300 ${isFocused ? 'border-[var(--gaming-primary)]/50 shadow-lg shadow-[var(--gaming-primary)]/20' : 'border-white/10'}`}>
          {/* Search Icon */}
          <div className="pr-5 pl-4">
            <svg
              className={`w-6 h-6 transition-colors duration-300 ${isFocused ? 'text-[var(--gaming-primary)]' : 'text-[var(--gaming-light)]/50'}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>

          {/* Input */}
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => { setShowSuggestions(true); setIsFocused(true); }}
            onBlur={() => { setTimeout(() => setShowSuggestions(false), 200); setIsFocused(false); }}
            placeholder={placeholder}
            className="flex-grow py-4 bg-transparent text-white text-lg placeholder-[var(--gaming-light)]/40 focus:outline-none"
          />

          {/* Clear Button */}
          {query && (
            <button
              type="button"
              onClick={() => {
                setQuery('');
                handleSearch('');
                inputRef.current?.focus();
              }}
              className="p-2 ml-2 text-[var(--gaming-light)]/50 hover:text-white transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}

          {/* Search Button */}
          <button
            type="submit"
            className="m-1.5 px-6 py-2.5 rounded-xl bg-gradient-to-r from-[var(--gaming-primary)] to-[var(--gaming-secondary)] text-white font-semibold hover:shadow-lg hover:shadow-[var(--gaming-primary)]/30 transition-all duration-300 hover:scale-105"
          >
            بحث
          </button>
        </div>
      </form>

      {/* Suggestions Dropdown */}
      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute top-full mt-3 w-full bg-[var(--gaming-dark)]/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl shadow-black/50 overflow-hidden z-50 animate-fadeInUp">
          <div className="p-2">
            <p className="px-4 py-2 text-xs text-[var(--gaming-light)]/50 uppercase tracking-wider">اقتراحات البحث</p>
            {suggestions.map((suggestion, index) => (
              <button
                key={index}
                onClick={() => handleSuggestionClick(suggestion)}
                className="w-full flex items-center gap-3 px-4 py-3 text-white rounded-xl hover:bg-white/5 transition-colors group"
              >
                <span className="w-8 h-8 rounded-lg bg-[var(--gaming-primary)]/10 flex items-center justify-center text-[var(--gaming-primary)] group-hover:bg-[var(--gaming-primary)]/20 transition-colors">
                  🎮
                </span>
                <span className="text-right flex-grow">{suggestion}</span>
                <svg className="w-4 h-4 text-[var(--gaming-light)]/30 group-hover:text-[var(--gaming-primary)] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}