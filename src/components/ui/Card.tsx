import type { ReactNode, HTMLAttributes } from 'react'

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'glass' | 'hover' | 'glow'
  children: ReactNode
}

export const Card = ({ variant = 'default', className = '', children, ...props }: CardProps) => {
  const variantClass = variant === 'default' ? 'card' : `card card-${variant}`
  
  return (
    <div className={`${variantClass} ${className}`.trim()} {...props}>
      {children}
    </div>
  )
}

export const CardHeader = ({ className = '', children, ...props }: HTMLAttributes<HTMLDivElement>) => (
  <div className={`panel-header ${className}`.trim()} {...props}>
    {children}
  </div>
)

export const CardBody = ({ className = '', children, ...props }: HTMLAttributes<HTMLDivElement>) => (
  <div className={`panel-body ${className}`.trim()} {...props}>
    {children}
  </div>
)

Card.Header = CardHeader
Card.Body = CardBody
