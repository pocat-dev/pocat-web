import { createFileRoute, Link } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  component: HomePage,
})

function HomePage() {
  return (
    <div className="flex-1 overflow-auto bg-surface">
      <div className="max-w-5xl mx-auto px-6 py-16">
        {/* Hero */}
        <header className="text-center mb-16">
          <h1 className="text-4xl sm:text-5xl font-bold text-primary tracking-tight mb-4">
            AI Video Clipper
          </h1>
          <p className="text-lg text-secondary max-w-xl mx-auto leading-relaxed">
            Transform long videos into viral clips with AI-powered analysis. 
            Perfect for TikTok, Instagram, and YouTube.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-3 justify-center mt-8">
            <Link to="/editor" className="btn btn-primary btn-lg">
              <i className="fa-solid fa-play" aria-hidden="true" />
              Start Creating
            </Link>
            <Link to="/library" className="btn btn-secondary btn-lg">
              <i className="fa-solid fa-folder-open" aria-hidden="true" />
              My Projects
            </Link>
          </div>
        </header>

        {/* Features */}
        <section className="grid sm:grid-cols-3 gap-6 mb-16">
          {[
            {
              icon: 'fa-wand-magic-sparkles',
              title: 'AI Detection',
              desc: 'Automatically find viral moments and engaging segments.',
            },
            {
              icon: 'fa-bolt',
              title: 'Fast Processing',
              desc: 'Smart caching for efficient workflow and quick exports.',
            },
            {
              icon: 'fa-crop',
              title: 'Multi-Format',
              desc: 'Export to 9:16, 16:9, and 1:1 for all platforms.',
            },
          ].map((feature) => (
            <article key={feature.title} className="card p-6 text-center">
              <div className="w-12 h-12 bg-brand-100 dark:bg-brand-900/30 rounded-xl flex items-center justify-center mx-auto mb-4">
                <i className={`fa-solid ${feature.icon} text-xl text-brand-600 dark:text-brand-400`} aria-hidden="true" />
              </div>
              <h3 className="font-semibold text-primary mb-2">{feature.title}</h3>
              <p className="text-sm text-secondary leading-relaxed">{feature.desc}</p>
            </article>
          ))}
        </section>

        {/* Stats */}
        <section className="grid grid-cols-3 gap-6 py-8 border-t border-b border-primary">
          {[
            { value: '50%', label: 'Storage Saved' },
            { value: '3x', label: 'Faster Export' },
            { value: '99%', label: 'Uptime' },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-2xl sm:text-3xl font-bold text-brand-600">{stat.value}</div>
              <div className="text-sm text-tertiary mt-1">{stat.label}</div>
            </div>
          ))}
        </section>

        {/* Footer */}
        <footer className="text-center mt-12 text-sm text-tertiary">
          Built with ❤️ by{' '}
          <a 
            href="https://twitter.com/sandikodev" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-brand-600 hover:underline"
          >
            @sandikodev
          </a>
        </footer>
      </div>
    </div>
  )
}
