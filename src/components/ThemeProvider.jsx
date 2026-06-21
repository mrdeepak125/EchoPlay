'use client';
import React, { useEffect } from 'react';

export const themes = {
  purple: {
    name: 'Purple Velvet',
    primary: '#a855f7',
    secondary: '#ec4899',
    glow: 'rgba(168, 85, 247, 0.35)',
  },
  emerald: {
    name: 'Emerald Forest',
    primary: '#10b981',
    secondary: '#06b6d4',
    glow: 'rgba(16, 185, 129, 0.35)',
  },
  sunset: {
    name: 'Sunset Glow',
    primary: '#f97316',
    secondary: '#ef4444',
    glow: 'rgba(249, 115, 22, 0.35)',
  },
  ocean: {
    name: 'Ocean Breeze',
    primary: '#3b82f6',
    secondary: '#06b6d4',
    glow: 'rgba(59, 130, 246, 0.35)',
  },
  rose: {
    name: 'Rose Romance',
    primary: '#f43f5e',
    secondary: '#d946ef',
    glow: 'rgba(244, 63, 94, 0.35)',
  },
};

export function applyTheme(themeKey) {
  if (typeof window === 'undefined') return;
  const theme = themes[themeKey] || themes.purple;
  const root = document.documentElement;
  
  root.style.setProperty('--accent-primary', theme.primary);
  root.style.setProperty('--accent-secondary', theme.secondary);
  root.style.setProperty('--accent-glow', theme.glow);
  
  localStorage.setItem('site-theme', themeKey);
}

export default function ThemeProvider({ children }) {
  useEffect(() => {
    const savedTheme = localStorage.getItem('site-theme') || 'purple';
    applyTheme(savedTheme);
  }, []);

  return <>{children}</>;
}
