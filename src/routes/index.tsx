import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { useAuth } from '../contexts/AuthContext'
import { useEffect, useRef, useState } from 'react'
import { Button } from '../components/ui'

export const Route = createFileRoute('/')({
  component: LandingPage,
})

const features = [
  { icon: 'fa-wand-magic-sparkles', title: 'AI Detection', desc: 'Smart algorithms identify key moments, engaging dialogue, and high-impact scenes with precision.' },
  { icon: 'fa-bolt', title: 'Fast Processing', desc: 'Clip videos at lightning speed. Process hours of footage into shareable content in seconds.' },
  { icon: 'fa-crop', title: 'Multi-Format Export', desc: 'Automatically resize and reformat clips for every platform—vertical, square, or landscape.' },
]

const stats = [
  { value: '10K+', label: 'Videos Processed', icon: 'fa-chart-line' },
  { value: '50%', label: 'Storage Saved', icon: 'fa-cloud' },
  { value: '3X', label: 'Faster Creation', icon: 'fa-rocket' },
]

const steps = [
  { num: '01', title: 'Import Video', desc: 'Paste a YouTube URL or upload your video file directly.' },
  { num: '02', title: 'AI Analysis', desc: 'Our AI scans for viral moments, hooks, and engaging segments.' },
  { num: '03', title: 'Export Clips', desc: 'Download optimized clips ready for TikTok, Shorts, and Reels.' },
]

const planets = [
  { id: 'tiktok', icon: 'fa-tiktok', color: '#000000', orbit: 140, speed: 1.0, startAngle: 0 },
  { id: 'shorts', icon: 'fa-youtube', color: '#FF0000', orbit: 160, speed: 0.8, startAngle: 60, badge: 'S' },
  { id: 'facebook', icon: 'fa-facebook-f', color: '#1877F2', orbit: 130, speed: 1.2, startAngle: 120 },
  { id: 'instagram', icon: 'fa-instagram', color: '#E4405F', orbit: 150, speed: 0.9, startAngle: 180 },
  { id: 'threads', icon: 'fa-threads', color: '#000000', orbit: 135, speed: 1.1, startAngle: 240 },
  { id: 'youtube', icon: 'fa-youtube', color: '#FF0000', orbit: 170, speed: 0.7, startAngle: 300 },
]

function LandingPage() {
  const { isAuthenticated, isLoading } = useAuth()
  const navigate = useNavigate()
  const [sliderValue, setSliderValue] = useState(30)
  const [baseRotation, setBaseRotation] = useState(0)
  const animationRef = useRef<number>()

  useEffect(() => {
    if (!isLoading && isAuthenticated) navigate({ to: '/dashboard' })
  }, [isAuthenticated, isLoading, navigate])

  useEffect(() => {
    let lastTime = performance.now()
    const animate = (time: number) => {
      const delta = (time - lastTime) / 1000
      lastTime = time
      setBaseRotation(prev => (prev + delta * 20) % 360)
      animationRef.current = requestAnimationFrame(animate)
    }
    animationRef.current = requestAnimationFrame(animate)
    return () => { if (animationRef.current) cancelAnimationFrame(animationRef.current) }
  }, [])

  if (isLoading) return <div className="loading-screen"><div className="loading-spinner" /></div>
  if (isAuthenticated) return null

  const sliderOffset = (sliderValue - 50) * 2

  return (
    <div className="landing-page">
      {/* Header */}
      <header className="landing-header">
        <div className="landing-container">
          <div className="landing-logo">
            <div className="landing-logo-icon"><i className="fa-solid fa-play" /></div>
            <span>Pocat</span>
          </div>
          <nav className="landing-nav">
            <a href="#features">Features</a>
            <a href="#how-it-works">How It Works</a>
            <a href="#pricing">Pricing</a>
          </nav>
          <Link to="/login"><Button variant="primary" size="sm">Sign In</Button></Link>
        </div>
      </header>

      {/* Hero */}
      <section className="landing-hero">
        <div className="landing-container landing-hero-grid">
          <div className="landing-hero-content">
            <h1>Transform Videos into Viral Clips</h1>
            <p>Effortlessly extract and optimize video highlights with our advanced AI. Boost engagement across all platforms in minutes.</p>
            <div className="landing-hero-actions">
              <Link to="/login">
                <Button variant="primary" size="lg" rightIcon={<i className="fa-solid fa-arrow-up-right" />}>
                  Get Started Free
                </Button>
              </Link>
              <Button variant="outline" size="lg" leftIcon={<i className="fa-solid fa-play" />}>
                Watch Demo
              </Button>
            </div>
          </div>
          
          {/* Planetary Phone Mockup */}
          <div className="landing-hero-visual">
            <div className="planetary-system">
              {planets.map((planet) => {
                const angle = planet.startAngle + baseRotation * planet.speed + sliderOffset * planet.speed * 0.5
                const rad = (angle * Math.PI) / 180
                const z = Math.cos(rad)
                const isFront = z > 0
                
                return (
                  <div
                    key={planet.id}
                    className={`planet ${isFront ? 'front' : 'back'}`}
                    style={{
                      '--orbit': `${planet.orbit}px`,
                      '--angle': `${angle}deg`,
                      '--z': z,
                      '--color': planet.color,
                    } as React.CSSProperties}
                  >
                    <i className={`fa-brands ${planet.icon}`} />
                    {planet.badge && <span className="planet-badge">{planet.badge}</span>}
                  </div>
                )
              })}
              
              <div className="phone-mockup">
                <div className="phone-notch" />
                <div className="phone-screen">
                  <div className="phone-video">
                    <div className="phone-play"><i className="fa-solid fa-play" /></div>
                  </div>
                  <div className="phone-controls">
                    <span className="phone-time">0:{sliderValue.toString().padStart(2, '0')}</span>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={sliderValue}
                      onChange={(e) => setSliderValue(Number(e.target.value))}
                      className="phone-slider"
                    />
                    <span className="phone-time">1:30</span>
                  </div>
                </div>
              </div>
              
              <div className="planetary-glow" />
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="landing-stats">
        <div className="landing-container landing-stats-grid">
          {stats.map((stat) => (
            <div key={stat.label} className="landing-stat">
              <div className="landing-stat-value">
                {stat.value} <i className={`fa-solid ${stat.icon}`} />
              </div>
              <div className="landing-stat-label">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section id="features" className="landing-features">
        <div className="landing-container">
          <div className="landing-section-header">
            <h2>Powerful Features</h2>
            <p>Everything you need to create viral content at scale</p>
          </div>
          <div className="landing-features-grid">
            {features.map((feature) => (
              <div key={feature.title} className="landing-feature-card">
                <div className="landing-feature-icon">
                  <i className={`fa-solid ${feature.icon}`} />
                </div>
                <h3>{feature.title}</h3>
                <p>{feature.desc}</p>
                <a href="#" className="landing-feature-link">
                  Learn More <i className="fa-solid fa-arrow-right" />
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="landing-steps">
        <div className="landing-container">
          <div className="landing-section-header">
            <h2>How It Works</h2>
            <p>Three simple steps to viral content</p>
          </div>
          <div className="landing-steps-grid">
            {steps.map((step, i) => (
              <div key={step.num} className="landing-step">
                <div className="landing-step-num">{step.num}</div>
                <h3>{step.title}</h3>
                <p>{step.desc}</p>
                {i < steps.length - 1 && <div className="landing-step-arrow"><i className="fa-solid fa-arrow-right" /></div>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="landing-cta">
        <div className="landing-container landing-cta-content">
          <div className="landing-cta-badge">
            <i className="fa-solid fa-sparkles" /> Limited Time Offer
          </div>
          <h2>Ready to Amplify Your Video Content?</h2>
          <p>Join thousands of creators and marketers using Pocat to dominate social media.</p>
          <Link to="/login">
            <Button variant="primary" size="lg">Start Clipping for Free</Button>
          </Link>
          <div className="landing-cta-note">No credit card required • Free forever plan available</div>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <div className="landing-container landing-footer-grid">
          <div className="landing-footer-brand">
            <div className="landing-logo">
              <div className="landing-logo-icon"><i className="fa-solid fa-play" /></div>
              <span>Pocat</span>
            </div>
            <p>AI-powered video clipping for creators and marketers.</p>
          </div>
          <div className="landing-footer-cols">
            <div>
              <h4>Product</h4>
              <a href="#">Features</a>
              <a href="#">Pricing</a>
              <a href="#">Changelog</a>
            </div>
            <div>
              <h4>Company</h4>
              <a href="#">About</a>
              <a href="#">Blog</a>
              <a href="#">Careers</a>
            </div>
            <div>
              <h4>Legal</h4>
              <a href="#">Privacy</a>
              <a href="#">Terms</a>
              <a href="#">Contact</a>
            </div>
          </div>
        </div>
        <div className="landing-container landing-footer-bottom">
          <p>© 2025 Pocat. All rights reserved.</p>
          <div className="landing-footer-social">
            <a href="#"><i className="fa-brands fa-twitter" /></a>
            <a href="#"><i className="fa-brands fa-linkedin" /></a>
            <a href="#"><i className="fa-brands fa-github" /></a>
          </div>
        </div>
      </footer>
    </div>
  )
}
