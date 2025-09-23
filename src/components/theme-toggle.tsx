"use client"

import { Sun, Moon, Monitor } from 'lucide-react'
import { useTheme } from './theme-provider'

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()

  const toggleTheme = () => {
    const themes = ['light', 'dark', 'system'] as const
    const currentIndex = themes.indexOf(theme)
    const nextIndex = (currentIndex + 1) % themes.length
    setTheme(themes[nextIndex])
  }

  const getIcon = () => {
    switch (theme) {
      case 'light':
        return <Sun className="h-5 w-5" />
      case 'dark':
        return <Moon className="h-5 w-5" />
      case 'system':
        return <Monitor className="h-5 w-5" />
    }
  }

  const getLabel = () => {
    switch (theme) {
      case 'light':
        return 'Mode clair'
      case 'dark':
        return 'Mode sombre'
      case 'system':
        return 'Mode système'
    }
  }

  return (
    <button
      onClick={toggleTheme}
      className="relative p-2 rounded-md transition-all duration-200 hover:bg-accent text-muted-foreground hover:text-accent-foreground"
      title={getLabel()}
      aria-label={getLabel()}
    >
      <div className="relative">
        {getIcon()}
        <span className="sr-only">{getLabel()}</span>
      </div>
    </button>
  )
}