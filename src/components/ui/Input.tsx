import { forwardRef, useState, type InputHTMLAttributes, type ReactNode } from 'react'

export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  size?: 'sm' | 'md' | 'lg'
  leftIcon?: ReactNode
  showPasswordToggle?: boolean
  error?: boolean
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ size = 'md', leftIcon, showPasswordToggle, error, type = 'text', className = '', ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false)
    const isPassword = type === 'password'
    const inputType = isPassword && showPassword ? 'text' : type

    const sizeClass = size === 'lg' ? 'input-lg' : ''
    const hasIcon = leftIcon || (isPassword && showPasswordToggle)

    if (hasIcon) {
      return (
        <div className="input-group">
          <input
            ref={ref}
            type={inputType}
            className={`input ${sizeClass} ${className}`.trim()}
            {...props}
          />
          {isPassword && showPasswordToggle && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="input-group-icon"
              tabIndex={-1}
            >
              <i className={`fa-solid ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`} aria-hidden="true" />
            </button>
          )}
        </div>
      )
    }

    return (
      <input
        ref={ref}
        type={inputType}
        className={`input ${sizeClass} ${className}`.trim()}
        {...props}
      />
    )
  }
)

Input.displayName = 'Input'
