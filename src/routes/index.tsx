import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { useAuth } from '../contexts/AuthContext'
import { PublicLayout } from '../layouts/PublicLayout'
import { useEffect } from 'react'

export const Route = createFileRoute('/')({
  component: LandingPage,
})

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
      <div className="h-screen flex items-center justify-center bg-surface">
        <div className="w-8 h-8 border-3 border-brand-200 border-t-brand-600 rounded-full animate-spin" />
      </div>
    )
  }

  if (isAuthenticated) return null

  return (
    <PublicLayout>
      {/* Hero */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-primary tracking-tight mb-6">
            Transform Videos into
            <span className="text-brand-600"> Viral Clips</span>
          </h1>
          <p className="text-lg sm:text-xl text-secondary max-w-2xl mx-auto leading-relaxed mb-8">
            AI-powered video clipper that automatically detects engaging moments. 
            Perfect for TikTok, Instagram Reels, and YouTube Shorts.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/login" className="btn btn-primary btn-lg">
              <i className="fa-solid fa-rocket" aria-hidden="true" />
              Get Started Free
            </Link>
            <a href="#features" className="btn btn-secondary btn-lg">
              <i className="fa-solid fa-play" aria-hidden="true" />
              See How It Works
            </a>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 px-6 bg-surface-secondary">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-primary mb-4">
              Everything You Need
            </h2>
            <p className="text-secondary max-w-xl mx-auto">
              Powerful features to help you create engaging content faster than ever.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: 'fa-wand-magic-sparkles',
                title: 'AI Detection',
                desc: 'Automatically identify viral moments, key highlights, and engaging segments in your videos.',
              },
              {
                icon: 'fa-bolt',
                title: 'Fast Processing',
                desc: 'Smart caching and parallel processing for lightning-fast video exports.',
              },
              {
                icon: 'fa-crop',
                title: 'Multi-Format',
                desc: 'Export to 9:16, 16:9, and 1:1 aspect ratios for all social platforms.',
              },
              {
                icon: 'fa-youtube',
                title: 'YouTube Import',
                desc: 'Import videos directly from YouTube with automatic metadata extraction.',
              },
              {
                icon: 'fa-closed-captioning',
                title: 'Auto Captions',
                desc: 'Generate accurate captions with AI-powered speech recognition.',
              },
              {
                icon: 'fa-cloud',
                title: 'Cloud Storage',
                desc: 'Secure cloud storage with smart caching to save space and bandwidth.',
              },
            ].map((feature) => (
              <div key={feature.title} className="card p-6">
                <div className="w-12 h-12 bg-brand-100 dark:bg-brand-900/30 rounded-xl flex items-center justify-center mb-4">
                  <i className={`fa-solid ${feature.icon} text-xl text-brand-600 dark:text-brand-400`} aria-hidden="true" />
                </div>
                <h3 className="font-semibold text-primary mb-2">{feature.title}</h3>
                <p className="text-sm text-secondary leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-8">
            {[
              { value: '10K+', label: 'Videos Processed' },
              { value: '50%', label: 'Storage Saved' },
              { value: '3x', label: 'Faster Export' },
              { value: '99%', label: 'Uptime' },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl sm:text-4xl font-bold text-brand-600 mb-2">{stat.value}</div>
                <div className="text-sm text-tertiary">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 bg-brand-600">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Create Viral Content?
          </h2>
          <p className="text-brand-100 mb-8">
            Join thousands of creators using Pocat to grow their audience.
          </p>
          <Link to="/login" className="btn bg-white text-brand-600 hover:bg-brand-50 btn-lg">
            Start Creating Now
          </Link>
        </div>
      </section>
    </PublicLayout>
  )
}
