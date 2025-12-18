import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline'
  size?: 'sm' | 'md' | 'lg'
  leftIcon?: ReactNode
  rightIcon?: ReactNode
  loading?: boolean
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', leftIcon, rightIcon, loading, disabled, className = '', children, ...props }, ref) => {
    const baseClass = 'btn'
    const variantClass = `btn-${variant}`
    const sizeClass = size !== 'md' ? `btn-${size}` : ''
    
    return (
      <button
        ref={ref}
        className={`${baseClass} ${variantClass} ${sizeClass} ${className}`.trim()}
        disabled={disabled || loading}
        {...props}
      >
        {loading ? (
          <i className="fa-solid fa-spinner animate-spin" aria-hidden="true" />
        ) : leftIcon}
        {children}
        {!loading && rightIcon}
      </button>
    )
  }
)

Button.displayName = 'Button'
