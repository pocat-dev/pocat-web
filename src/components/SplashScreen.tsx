import { useEffect, useState } from 'react'
import { AnimatedLogo } from './AnimatedLogo'

interface SplashScreenProps {
  onComplete: () => void
}

export function SplashScreen({ onComplete }: SplashScreenProps) {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(timer)
          setTimeout(onComplete, 300)
          return 100
        }
        return prev + 2
      })
    }, 30)

    return () => clearInterval(timer)
  }, [onComplete])

  return (
    <div className="splash-screen">
      <div className="splash-content">
        <div className="splash-logo">
          <AnimatedLogo size="xl" />
        </div>
        <h1 className="splash-title">Pocat</h1>
        <p className="splash-subtitle">AI Video Clipper</p>
        <div className="splash-progress">
          <div 
            className="splash-progress-bar" 
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  )
}
