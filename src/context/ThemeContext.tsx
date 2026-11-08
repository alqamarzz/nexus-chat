'use client'

import React, { createContext, useContext, useEffect, useState, useTransition } from 'react'

export type Theme = 'dark' | 'light'

interface ThemeContextType {
  theme: Theme
  isDark: boolean
  setTheme: (theme: Theme) => void
  toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

const THEME_STORAGE_KEY = 'nexus_theme'

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>('dark')
  const [mounted, setMounted] = useState(false)
  const [, startTransition] = useTransition()

  // Apply theme to document element
  const applyTheme = (newTheme: Theme) => {
    if (typeof document === 'undefined') return
    const root = document.documentElement

    if (newTheme === 'light') {
      root.classList.remove('dark')
      root.classList.add('light')
      root.setAttribute('data-theme', 'light')
      root.style.colorScheme = 'light'
    } else {
      root.classList.remove('light')
      root.classList.add('dark')
      root.setAttribute('data-theme', 'dark')
      root.style.colorScheme = 'dark'
    }
  }

  // Initial theme detection on mount
  useEffect(() => {
    setMounted(true)
    try {
      const savedTheme = localStorage.getItem(THEME_STORAGE_KEY) as Theme | null
      if (savedTheme === 'light' || savedTheme === 'dark') {
        setThemeState(savedTheme)
        applyTheme(savedTheme)
      } else {
        // Default to dark as primary design system
        setThemeState('dark')
        applyTheme('dark')
      }
    } catch {
      applyTheme('dark')
    }
  }, [])

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme)
    applyTheme(newTheme)
    try {
      localStorage.setItem(THEME_STORAGE_KEY, newTheme)
    } catch {
      // ignore localStorage errors
    }
  }

  const toggleTheme = () => {
    startTransition(() => {
      const nextTheme: Theme = theme === 'dark' ? 'light' : 'dark'
      setTheme(nextTheme)
    })
  }

  const value: ThemeContextType = {
    theme: mounted ? theme : 'dark',
    isDark: mounted ? theme === 'dark' : true,
    setTheme,
    toggleTheme,
  }

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export function useTheme(): ThemeContextType {
  const context = useContext(ThemeContext)
  if (!context) {
    // Graceful fallback if used outside provider
    return {
      theme: 'dark',
      isDark: true,
      setTheme: () => {},
      toggleTheme: () => {},
    }
  }
  return context
}
