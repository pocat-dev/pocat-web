import './AnimatedLogo.css'

interface AnimatedLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
}

const sizeMap = {
  sm: 24,   // sidebar
  md: 32,   // default
  lg: 48,   // medium usage
  xl: 64,   // splash screen
}

export function AnimatedLogo({ size = 'md', className = '' }: AnimatedLogoProps) {
  const logoSize = sizeMap[size]
  
  return (
    <svg 
      width={logoSize} 
      height={logoSize} 
      viewBox="0 0 32 32" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={`animated-logo animated-logo--${size} ${className}`}
    >
      {/* Background circle */}
      <circle 
        cx="16" 
        cy="16" 
        r="14" 
        fill="url(#gradient)" 
        className="logo-bg"
      />
      
      {/* Play triangle */}
      <path 
        d="M12 10L22 16L12 22V10Z" 
        fill="white" 
        className="logo-play"
      />
      
      {/* Gradient definition */}
      <defs>
        <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#8b5cf6" />
          <stop offset="100%" stopColor="#7c3aed" />
        </linearGradient>
      </defs>
    </svg>
  )
}
