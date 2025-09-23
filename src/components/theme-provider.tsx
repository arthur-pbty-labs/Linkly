"use client"

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'

type Theme = 'light' | 'dark' | 'system'

interface ThemeContextType {
  theme: Theme
  setTheme: (theme: Theme) => void
  actualTheme: 'light' | 'dark'
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>('system')
  const [actualTheme, setActualTheme] = useState<'light' | 'dark'>('light')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    // Charger le thème depuis localStorage
    const savedTheme = localStorage.getItem('linkly-theme') as Theme
    if (savedTheme) {
      setTheme(savedTheme)
    }
  }, [])

  useEffect(() => {
    if (!mounted) return

    const updateActualTheme = () => {
      if (theme === 'system') {
        const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
        setActualTheme(systemTheme)
      } else {
        setActualTheme(theme)
      }
    }

    updateActualTheme()

    if (theme === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
      mediaQuery.addEventListener('change', updateActualTheme)
      return () => mediaQuery.removeEventListener('change', updateActualTheme)
    }
  }, [theme, mounted])

  useEffect(() => {
    if (!mounted) return

    // Appliquer le thème au DOM
    const root = document.documentElement
    root.classList.remove('light', 'dark')
    root.classList.add(actualTheme)
    
    // Mettre à jour la balise meta pour le thème
    const themeColorMeta = document.querySelector('meta[name="theme-color"]')
    if (themeColorMeta) {
      themeColorMeta.setAttribute('content', actualTheme === 'dark' ? '#111827' : '#ffffff')
    }
    
    // Sauvegarder dans localStorage
    localStorage.setItem('linkly-theme', theme)
  }, [theme, actualTheme, mounted])

  const handleSetTheme = (newTheme: Theme) => {
    setTheme(newTheme)
  }

  // Éviter le flash de contenu pendant l'hydratation
  if (!mounted) {
    return (
      <ThemeContext.Provider value={{ theme, setTheme: handleSetTheme, actualTheme }}>
        {children}
      </ThemeContext.Provider>
    )
  }

  return (
    <ThemeContext.Provider value={{ theme, setTheme: handleSetTheme, actualTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}