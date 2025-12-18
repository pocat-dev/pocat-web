import { forwardRef, type InputHTMLAttributes } from 'react'

export interface ToggleProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'onChange'> {
  checked?: boolean
  onChange?: (checked: boolean) => void
}

export const Toggle = forwardRef<HTMLInputElement, ToggleProps>(
  ({ checked, onChange, disabled, className = '', ...props }, ref) => {
    return (
      <label className={`settings-toggle ${className}`.trim()}>
        <input
          ref={ref}
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange?.(e.target.checked)}
          disabled={disabled}
          {...props}
        />
        <span className="settings-toggle-slider" />
      </label>
    )
  }
)

Toggle.displayName = 'Toggle'
