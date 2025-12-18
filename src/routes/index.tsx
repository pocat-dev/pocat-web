import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  component: HomePage,
})

function HomePage() {
  return (
    <div className="flex-1 flex items-center justify-center bg-surface min-h-screen">
      <div className="text-center max-w-4xl mx-auto px-8 py-12">
        {/* Hero Section */}
        <header className="mb-12">
          <h1 className="text-5xl font-bold mb-6 text-primary">
            Welcome to{' '}
            <span className="text-brand bg-gradient-to-r from-brand-500 to-brand-700 bg-clip-text text-transparent">
              ClipGenius AI
            </span>
          </h1>
          <p className="text-xl text-secondary leading-relaxed max-w-2xl mx-auto">
            Transform long videos into engaging clips with AI-powered analysis. 
            Create viral content for TikTok, Instagram, and YouTube with professional quality.
          </p>
        </header>
        
        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
          <a 
            href="/editor" 
            className="btn-primary inline-flex items-center gap-3 text-lg px-8 py-4"
            aria-describedby="editor-description"
          >
            <i className="fa-solid fa-scissors" aria-hidden="true"></i>
            Start Creating
          </a>
          <a 
            href="/library" 
            className="btn-secondary inline-flex items-center gap-3 text-lg px-8 py-4"
            aria-describedby="library-description"
          >
            <i className="fa-solid fa-folder" aria-hidden="true"></i>
            Browse Projects
          </a>
        </div>

        {/* Hidden descriptions for screen readers */}
        <div className="sr-only">
          <p id="editor-description">
            Open the video editor to start creating clips from your videos
          </p>
          <p id="library-description">
            View and manage your existing video projects
          </p>
        </div>

        {/* Feature Cards */}
        <section aria-labelledby="features-heading">
          <h2 id="features-heading" className="sr-only">Key Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
            <article className="card p-8 hover:shadow-lg transition-all duration-300">
              <div className="text-brand-600 text-3xl mb-4" aria-hidden="true">
                <i className="fa-solid fa-robot"></i>
              </div>
              <h3 className="text-xl font-semibold text-primary mb-3">
                AI-Powered Analysis
              </h3>
              <p className="text-secondary leading-relaxed">
                Automatically detect viral segments and engaging moments in your videos 
                with advanced machine learning algorithms.
              </p>
            </article>
            
            <article className="card p-8 hover:shadow-lg transition-all duration-300">
              <div className="text-brand-600 text-3xl mb-4" aria-hidden="true">
                <i className="fa-solid fa-bolt"></i>
              </div>
              <h3 className="text-xl font-semibold text-primary mb-3">
                Lightning Fast Processing
              </h3>
              <p className="text-secondary leading-relaxed">
                Smart caching and real-time progress tracking ensure efficient workflow 
                and minimal waiting time.
              </p>
            </article>
            
            <article className="card p-8 hover:shadow-lg transition-all duration-300">
              <div className="text-brand-600 text-3xl mb-4" aria-hidden="true">
                <i className="fa-solid fa-mobile-alt"></i>
              </div>
              <h3 className="text-xl font-semibold text-primary mb-3">
                Multi-Platform Export
              </h3>
              <p className="text-secondary leading-relaxed">
                Export to 9:16 (TikTok/Instagram), 16:9 (YouTube), and 1:1 (Square) 
                aspect ratios for all social platforms.
              </p>
            </article>
          </div>
        </section>

        {/* Stats Section */}
        <section className="mt-16 pt-12 border-t border-primary-200" aria-labelledby="stats-heading">
          <h2 id="stats-heading" className="sr-only">Platform Statistics</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-brand-600 mb-2">50%</div>
              <div className="text-secondary">Storage Savings</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-brand-600 mb-2">3x</div>
              <div className="text-secondary">Faster Processing</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-brand-600 mb-2">99%</div>
              <div className="text-secondary">Uptime Reliability</div>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
