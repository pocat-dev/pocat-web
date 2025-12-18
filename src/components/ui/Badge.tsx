import type { ReactNode } from 'react'

export interface BadgeProps {
  variant?: 'success' | 'warning' | 'error' | 'info' | 'neutral' | 'processing' | 'viral' | 'done'
  icon?: ReactNode
  children: ReactNode
  className?: string
}

export const Badge = ({ variant = 'neutral', icon, children, className = '' }: BadgeProps) => {
  const variantClass = variant === 'done' ? 'badge-success' : `badge-${variant}`
  
  return (
    <span className={`badge ${variantClass} ${className}`.trim()}>
      {icon}
      {children}
    </span>
  )
}
