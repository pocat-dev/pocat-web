import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  component: () => (
    <div className="flex-1 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Welcome to ClipGenius AI</h1>
        <p className="text-slate-400 mb-8">Transform long videos into engaging clips with AI-powered analysis</p>
        <div className="space-x-4">
          <a href="/editor" className="px-6 py-3 bg-purple-600 hover:bg-purple-500 rounded-lg transition-colors">
            Start Editing
          </a>
          <a href="/library" className="px-6 py-3 border border-slate-700 hover:border-slate-600 rounded-lg transition-colors">
            Browse Library
          </a>
        </div>
      </div>
    </div>
  ),
})
