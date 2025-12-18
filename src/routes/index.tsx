import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { useAuth } from '../contexts/AuthContext'
import { useEffect } from 'react'

export const Route = createFileRoute('/')({
  component: LandingPage,
})

const features = [
  { icon: 'fa-wand-magic-sparkles', title: 'AI Detection', desc: 'Smart algorithms identify key moments and high-impact scenes with precision.' },
  { icon: 'fa-bolt', title: 'Fast Processing', desc: 'Process hours of footage into shareable content in seconds.' },
  { icon: 'fa-crop', title: 'Multi-Format Export', desc: 'Automatically resize for every platform—vertical, square, or landscape.' },
]

const stats = [
  { value: '10K+', label: 'Videos Processed', icon: 'fa-chart-line' },
  { value: '50%', label: 'Storage Saved', icon: 'fa-cloud' },
  { value: '3X', label: 'Faster Creation', icon: 'fa-rocket' },
]

function LandingPage() {
  const { isAuthenticated, isLoading } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      navigate({ to: '/dashboard' })
    }
  }, [isAuthenticated, isLoading, navigate])

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-base">
        <div className="w-8 h-8 border-2 border-violet-500/30 border-t-violet-500 rounded-full animate-spin" />
      </div>
    )
  }

  if (isAuthenticated) return null

  return (
    <div className="min-h-screen bg-gradient-hero">
      {/* Header */}
      <header className="header border-b-0 bg-transparent">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-gradient-to-br from-violet-500 to-violet-700 rounded-lg flex items-center justify-center">
            <i className="fa-solid fa-play text-white text-sm" aria-hidden="true" />
          </div>
          <span className="font-semibold text-lg text-primary">Pocat</span>
        </div>
        <nav className="header-nav">
          <a href="#features" className="header-nav-item">Features</a>
          <a href="#pricing" className="header-nav-item">Pricing</a>
          <a href="#resources" className="header-nav-item">Resources</a>
          <Link to="/login" className="btn btn-secondary btn-sm">Sign In</Link>
        </nav>
      </header>

      {/* Hero */}
      <section className="hero">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="hero-content">
              <h1 className="hero-title">
                Transform Videos<br />into Viral Clips
              </h1>
              <p className="hero-subtitle">
                Effortlessly extract and optimize video highlights with our advanced AI. 
                Boost engagement across all platforms in minutes.
              </p>
              <div className="hero-actions">
                <Link to="/login" className="btn btn-primary btn-lg">
                  Get Started Free
                  <i className="fa-solid fa-arrow-right" aria-hidden="true" />
                </Link>
                <button className="btn btn-secondary btn-lg">
                  <i className="fa-solid fa-play" aria-hidden="true" />
                  Watch Demo
                </button>
              </div>
            </div>

            {/* Hero Visual */}
            <div className="relative hidden lg:block">
              <div className="card-glass p-6 rounded-2xl">
                <div className="aspect-video bg-surface-base rounded-xl flex items-center justify-center mb-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-violet-500 to-violet-700 rounded-full flex items-center justify-center glow-violet-lg">
                    <i className="fa-solid fa-play text-white text-2xl ml-1" aria-hidden="true" />
                  </div>
                </div>
                <div className="h-12 bg-surface-secondary rounded-lg flex items-center gap-2 px-4">
                  <div className="flex-1 h-6 bg-violet-500/30 rounded" />
                  <div className="w-20 h-6 bg-violet-500/50 rounded" />
                  <div className="flex-1 h-6 bg-violet-500/30 rounded" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 border-y border-primary">
        <div className="container">
          <div className="grid grid-cols-3 gap-8">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="flex items-center justify-center gap-3 mb-2">
                  <span className="text-4xl font-bold text-primary">{stat.value}</span>
                  <i className={`fa-solid ${stat.icon} text-2xl text-violet-500`} aria-hidden="true" />
                </div>
                <div className="text-sm text-secondary">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="section">
        <div className="container">
          <div className="grid md:grid-cols-3 gap-6">
            {features.map((feature) => (
              <div key={feature.title} className="card card-hover p-6">
                <div className="stat-card-icon mb-4">
                  <i className={`fa-solid ${feature.icon}`} aria-hidden="true" />
                </div>
                <h3 className="font-semibold text-primary mb-2">{feature.title}</h3>
                <p className="text-sm text-secondary leading-relaxed mb-4">{feature.desc}</p>
                <a href="#" className="text-sm text-brand-400 hover:text-brand-300 inline-flex items-center gap-1">
                  Learn More <i className="fa-solid fa-arrow-right text-xs" />
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section bg-surface-primary">
        <div className="container text-center">
          <h2 className="text-3xl font-bold text-primary mb-4">
            Ready to Amplify Your Video Content?
          </h2>
          <p className="text-secondary mb-8 max-w-xl mx-auto">
            Join thousands of creators and marketers using Pocat to dominate social media.
          </p>
          <Link to="/login" className="btn btn-primary btn-lg">
            Start Clipping for Free
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-primary">
        <div className="container">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-tertiary">© 2024 Pocat. All rights reserved.</p>
            <div className="flex gap-4">
              <a href="#" className="text-tertiary hover:text-secondary"><i className="fa-brands fa-twitter" /></a>
              <a href="#" className="text-tertiary hover:text-secondary"><i className="fa-brands fa-linkedin" /></a>
              <a href="#" className="text-tertiary hover:text-secondary"><i className="fa-brands fa-github" /></a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
