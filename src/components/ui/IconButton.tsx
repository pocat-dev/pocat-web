import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react'

export interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon: ReactNode
  size?: 'sm' | 'md' | 'lg'
  variant?: 'ghost' | 'outline'
}

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ icon, size = 'md', variant = 'ghost', className = '', ...props }, ref) => {
    const sizeClass = size !== 'md' ? `btn-${size}` : ''
    
    return (
      <button
        ref={ref}
        className={`btn btn-${variant} btn-icon ${sizeClass} ${className}`.trim()}
        {...props}
      >
        {icon}
      </button>
    )
  }
)

IconButton.displayName = 'IconButton'
