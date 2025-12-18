import { forwardRef, type SelectHTMLAttributes } from 'react'

export interface SelectOption {
  value: string
  label: string
}

export interface SelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'size'> {
  options: SelectOption[]
  size?: 'sm' | 'md' | 'lg'
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ options, size = 'md', className = '', ...props }, ref) => {
    return (
      <select ref={ref} className={`settings-select ${className}`.trim()} {...props}>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    )
  }
)

Select.displayName = 'Select'
