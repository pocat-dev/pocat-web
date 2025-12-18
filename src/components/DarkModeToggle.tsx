import React from 'react'
import { useTheme } from '../contexts/ThemeContext'

export const DarkModeToggle: React.FC = () => {
  const { theme, setTheme, isDark } = useTheme()

  const toggleTheme = () => {
    if (theme === 'system') {
      setTheme(isDark ? 'light' : 'dark')
    } else if (theme === 'light') {
      setTheme('dark')
    } else {
      setTheme('system')
    }
  }

  const getIcon = () => {
    if (theme === 'system') {
      return isDark ? '🌙' : '☀️'
    }
    return theme === 'dark' ? '🌙' : '☀️'
  }

  const getLabel = () => {
    if (theme === 'system') {
      return `System theme (currently ${isDark ? 'dark' : 'light'}). Click to switch to ${isDark ? 'light' : 'dark'} mode.`
    }
    return `${theme === 'dark' ? 'Dark' : 'Light'} mode. Click to ${theme === 'dark' ? 'switch to light mode' : 'switch to dark mode'}.`
  }

  const getStatusText = () => {
    if (theme === 'system') {
      return `Auto (${isDark ? 'Dark' : 'Light'})`
    }
    return theme === 'dark' ? 'Dark' : 'Light'
  }

  return (
    <button
      onClick={toggleTheme}
      className="
        w-12 h-12 flex items-center justify-center rounded-xl
        bg-surface-secondary border border-primary-200
        text-primary-600 hover:text-primary-800 hover:bg-primary-100
        transition-all duration-200 focus-ring
        shadow-sm hover:shadow-md
      "
      aria-label={getLabel()}
      title={getStatusText()}
    >
      <span className="text-lg" role="img" aria-hidden="true">
        {getIcon()}
      </span>
      <span className="sr-only">{getStatusText()}</span>
    </button>
  )
}
