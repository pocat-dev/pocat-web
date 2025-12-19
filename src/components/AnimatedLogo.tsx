import { useState } from 'react'
import { DraggableModal } from './DraggableModal'
import './AnimatedLogo.css'

interface AnimatedLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
}

const sizeMap = {
  sm: 24,
  md: 32,
  lg: 48,
  xl: 64,
}

const easterEggMessages = [
  { 
    title: '👨‍💻 Developer', 
    content: (
      <div>
        <p><strong>@sandikodev</strong> - Full-stack Developer</p>
        <p>🐦 <a href="https://twitter.com/sandikodev" target="_blank">Twitter</a></p>
        <p>🐙 <a href="https://github.com/sandikodev" target="_blank">GitHub</a></p>
        <p>💼 <a href="https://linkedin.com/in/sandikodev" target="_blank">LinkedIn</a></p>
      </div>
    )
  },
  { 
    title: '⭐ Star on GitHub', 
    content: (
      <div>
        <p>Love this project? Give it a star!</p>
        <p>🔗 <a href="https://github.com/pocat-dev/pocat" target="_blank">github.com/pocat-dev/pocat</a></p>
        <p>Help us reach 100 stars! ⭐</p>
      </div>
    )
  },
  { 
    title: '🚀 Contribute', 
    content: (
      <div>
        <p>Want to contribute?</p>
        <p>• 🐛 Report bugs</p>
        <p>• 💡 Suggest features</p>
        <p>• 🔧 Submit PRs</p>
        <p>• 📖 Improve docs</p>
      </div>
    )
  },
]

export function AnimatedLogo({ size = 'md', className = '' }: AnimatedLogoProps) {
  const logoSize = sizeMap[size]
  const [showEasterEgg, setShowEasterEgg] = useState(false)
  const [clickCount, setClickCount] = useState(0)
  
  const handleClick = () => {
    setClickCount(prev => prev + 1)
    setShowEasterEgg(true)
  }
  
  const currentMessage = easterEggMessages[clickCount % easterEggMessages.length]
  
  return (
    <>
      <svg 
        width={logoSize} 
        height={logoSize} 
        viewBox="0 0 32 32" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        className={`animated-logo animated-logo--${size} ${className}`}
        onClick={handleClick}
        style={{ cursor: 'pointer' }}
      >
        <circle 
          cx="16" 
          cy="16" 
          r="14" 
          fill="url(#gradient)" 
          className="logo-bg"
        />
        
        <path 
          d="M12 10L22 16L12 22V10Z" 
          fill="white" 
          className="logo-play"
        />
        
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#8b5cf6" />
            <stop offset="100%" stopColor="#7c3aed" />
          </linearGradient>
        </defs>
      </svg>
      
      <DraggableModal
        isOpen={showEasterEgg}
        onClose={() => setShowEasterEgg(false)}
        title={currentMessage.title}
      >
        {currentMessage.content}
        <div style={{ marginTop: '12px', fontSize: '11px', opacity: 0.8 }}>
          Click #{clickCount} • Click logo again for more!
        </div>
      </DraggableModal>
    </>
  )
}
