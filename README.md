# 🎨 Pocat Frontend - React + TanStack Router

<div align="center">

![Frontend](https://img.shields.io/badge/Frontend-React%20+%20TypeScript-61DAFB?style=for-the-badge&logo=react&logoColor=white)

**Modern video editing interface with AI-powered analysis**

[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-20232A?style=flat&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![TanStack Router](https://img.shields.io/badge/TanStack-Router-FF4154?style=flat&logo=react&logoColor=white)](https://tanstack.com/router)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=flat&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

[🚀 Quick Start](#-quick-start) • [🏗️ Architecture](#️-architecture) • [🤝 Contributing](#-contributing)

</div>

---

## 🌟 Overview

Frontend aplikasi Pocat yang dibangun dengan **React 18**, **TypeScript**, dan **TanStack Router**. Interface modern untuk video editing dengan AI analysis, real-time progress tracking, dan type-safe API integration.

### ✨ Key Features

🎯 **File-based Routing** - TanStack Router dengan type safety  
⚡ **Real-time Updates** - Live progress tracking dan status  
🎨 **Modern UI/UX** - Clean design dengan Tailwind CSS  
🛡️ **Type Safety** - End-to-end TypeScript dengan Tuyau  
📱 **Responsive Design** - Works on desktop dan mobile  
🔄 **Smart Caching** - Intelligent data fetching dan caching  

---

## 🏗️ Architecture

```mermaid
graph TB
    subgraph "🎨 Frontend Components"
        A[App.tsx - Router Provider]
        B[Routes - File-based]
        C[Components - Modular]
        D[Services - API Client]
    end
    
    subgraph "📁 Route Structure"
        E[/__root.tsx - Layout]
        F[/index.tsx - Home]
        G[/editor.tsx - Video Editor]
        H[/library.tsx - Projects]
        I[/settings.tsx - Config]
    end
    
    subgraph "🔧 Services"
        J[Tuyau Client - Type-safe API]
        K[Backend Integration]
        L[Real-time Polling]
    end
    
    A --> B
    B --> E
    B --> F
    B --> G
    B --> H
    B --> I
    C --> D
    D --> J
    J --> K
    K --> L
```

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18+ 
- **pnpm** (recommended) atau npm
- **Backend** running di port 3333

### Installation

```bash
# Clone repository (jika belum)
git clone https://github.com/pocat-dev/pocat.git
cd pocat/frontend

# Install dependencies
pnpm install

# Start development server
pnpm run dev

# Open browser
# http://localhost:3001
```

### Development Commands

```bash
# Development server
pnpm run dev

# Type checking
pnpm run type-check

# Build for production
pnpm run build

# Preview production build
pnpm run preview

# Generate route tree (after adding routes)
npx tsr generate

# Lint code
pnpm run lint

# Format code
pnpm run format
```

---

## 📁 Project Structure

```
frontend/
├── 📁 routes/                 # File-based routes
│   ├── __root.tsx            # Root layout dengan sidebar
│   ├── index.tsx             # Home/landing page
│   ├── editor.tsx            # Video editor interface
│   ├── library.tsx           # Project library
│   └── settings.tsx          # Settings page
├── 📁 components/            # Reusable components
│   ├── Sidebar.tsx           # Navigation sidebar
│   ├── VideoPlayer.tsx       # Video player component
│   ├── EditorView.tsx        # Editor interface
│   ├── LibraryView.tsx       # Library interface
│   ├── SettingsView.tsx      # Settings interface
│   ├── Timeline.tsx          # Video timeline
│   └── AnalysisSidebar.tsx   # AI analysis panel
├── 📁 services/              # API services
│   ├── backend.ts            # Backend API client
│   ├── gemini.ts             # AI analysis service
│   └── gpuProcessor.ts       # GPU processing
├── 📁 types/                 # TypeScript types
│   └── index.ts              # Shared type definitions
├── 📁 public/                # Static assets
│   ├── favicon.ico           # Favicon
│   └── site.webmanifest      # PWA manifest
├── App.tsx                   # Main app component
├── router.ts                 # Router configuration
├── routeTree.gen.ts          # Generated route tree
├── tsr.config.json           # TanStack Router config
├── vite.config.ts            # Vite configuration
├── tailwind.config.js        # Tailwind CSS config
└── package.json              # Dependencies
```

---

## 🎯 Core Components

### 🏠 **Routes (File-based)**

| Route | Component | Purpose |
|-------|-----------|---------|
| `/` | `index.tsx` | Landing page dengan welcome message |
| `/editor` | `editor.tsx` | Video editing interface |
| `/library` | `library.tsx` | Project management |
| `/settings` | `settings.tsx` | Configuration panel |

### 🧩 **Components**

| Component | Purpose | Props |
|-----------|---------|-------|
| `Sidebar` | Navigation menu | Auto-detects active route |
| `VideoPlayer` | Video playback | `src`, `videoRef`, `aspectRatio` |
| `EditorView` | Complete editor UI | Video state, handlers |
| `LibraryView` | Project grid | `projects`, `onRefresh` |
| `SettingsView` | Settings form | Backend URL, connection test |

### 🔧 **Services**

| Service | Purpose | Methods |
|---------|---------|---------|
| `backend.ts` | API communication | `createProject`, `getStatus` |
| `gemini.ts` | AI analysis | `analyzeFrame`, `analyzeSegments` |
| `gpuProcessor.ts` | GPU processing | Frame processing utilities |

---

## 🛠️ Tech Stack

### 🎨 **Frontend Framework**
- **React 18** - UI library dengan hooks
- **TypeScript 5** - Type safety dan developer experience
- **Vite 5** - Lightning fast build tool
- **Tailwind CSS 3** - Utility-first CSS framework

### 🧭 **Routing & State**
- **TanStack Router** - File-based routing dengan type safety
- **TanStack Query** - Server state management (planned)
- **Tuyau Client** - Type-safe API client

### 🎨 **UI & Styling**
- **Tailwind CSS** - Responsive design system
- **Font Awesome** - Icon library
- **Custom Components** - Modular UI components

### 🔧 **Development Tools**
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **TypeScript** - Static type checking
- **Vite DevTools** - Development debugging

---

## 🎮 Usage Examples

### Basic Route Navigation
```typescript
import { Link } from '@tanstack/react-router'

// Type-safe navigation
<Link to="/editor" className="nav-link">
  Go to Editor
</Link>

// Programmatic navigation
const navigate = useNavigate()
navigate({ to: '/library' })
```

### API Integration dengan Tuyau
```typescript
import { tuyau } from '../services/api'

// Type-safe API calls
const createProject = async (youtubeUrl: string) => {
  const response = await tuyau.projects.$post({
    title: "My Project",
    youtubeUrl,
    quality: "720p"
  })
  
  // Response is fully typed
  console.log(response.data.projectId)
}
```

### State Management per Route
```typescript
// routes/editor.tsx
export const Route = createFileRoute('/editor')({
  component: EditorComponent,
})

function EditorComponent() {
  // Local state untuk route ini
  const [videoState, setVideoState] = useState<VideoState>({
    file: null,
    url: null,
    duration: 0,
    currentTime: 0,
    isPlaying: false
  })
  
  return <EditorView videoState={videoState} />
}
```

---

## 🎨 Styling Guide

### 🎨 **Design System**

| Element | Classes | Purpose |
|---------|---------|---------|
| **Primary Button** | `bg-purple-600 hover:bg-purple-500` | Main actions |
| **Secondary Button** | `border border-slate-700 hover:border-slate-600` | Secondary actions |
| **Card** | `bg-slate-900 border border-slate-800 rounded-xl` | Content containers |
| **Input** | `bg-slate-950 border border-slate-700 rounded-lg` | Form inputs |

### 🌈 **Color Palette**
```css
/* Primary Colors */
--purple-500: #8b5cf6;
--purple-600: #7c3aed;

/* Background Colors */
--slate-950: #020617;
--slate-900: #0f172a;
--slate-800: #1e293b;

/* Text Colors */
--white: #ffffff;
--slate-400: #94a3b8;
--slate-500: #64748b;
```

### 📱 **Responsive Breakpoints**
```css
/* Mobile First Approach */
sm: 640px   /* Small devices */
md: 768px   /* Medium devices */
lg: 1024px  /* Large devices */
xl: 1280px  /* Extra large devices */
```

---

## 🧪 Testing

### 🔧 **Setup Testing Environment**
```bash
# Install testing dependencies
pnpm add -D @testing-library/react @testing-library/jest-dom vitest

# Run tests
pnpm run test

# Run tests dengan coverage
pnpm run test:coverage

# Run tests dalam watch mode
pnpm run test:watch
```

### 📝 **Testing Examples**
```typescript
// Component testing
import { render, screen } from '@testing-library/react'
import { Sidebar } from '../components/Sidebar'

test('renders navigation links', () => {
  render(<Sidebar />)
  
  expect(screen.getByTitle('Video Editor')).toBeInTheDocument()
  expect(screen.getByTitle('Project Library')).toBeInTheDocument()
  expect(screen.getByTitle('Settings')).toBeInTheDocument()
})
```

---

## 🚀 Deployment

### 🌐 **Static Hosting (Recommended)**

#### Vercel
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

#### Netlify
```bash
# Build command
pnpm run build

# Publish directory
dist
```

### 🐳 **Docker**
```dockerfile
# Dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN pnpm install
COPY . .
RUN pnpm run build
EXPOSE 3001
CMD ["pnpm", "run", "preview"]
```

### ⚙️ **Environment Variables**
```bash
# .env
VITE_API_URL=http://localhost:3333
VITE_APP_NAME=Pocat
VITE_APP_VERSION=1.0.0
```

---

## 🤝 Contributing

Kami welcome kontribusi untuk frontend! 🎉

### 🌟 **Frontend Contributions**
- 🎨 **UI/UX Improvements** - Design enhancements
- 🧩 **New Components** - Reusable components
- 📱 **Responsive Design** - Mobile optimizations
- ⚡ **Performance** - Bundle size optimizations
- 🧪 **Testing** - Component tests
- 📖 **Documentation** - Component docs

### 📋 **Development Workflow**
```bash
# 1. Fork repository
# 2. Create feature branch
git checkout -b feature/new-component

# 3. Make changes
# 4. Test changes
pnpm run type-check
pnpm run test

# 5. Commit dengan conventional commits
git commit -m "feat: add new video player component"

# 6. Push dan create PR
git push origin feature/new-component
```

### 🎨 **Component Guidelines**
- ✅ Use TypeScript untuk semua components
- ✅ Follow Tailwind CSS design system
- ✅ Add proper prop types dan documentation
- ✅ Include error handling
- ✅ Write tests untuk new components
- ✅ Follow naming conventions

---

## 📊 Performance

### ⚡ **Bundle Analysis**
```bash
# Analyze bundle size
pnpm run build:analyze

# Check bundle size
ls -lh dist/assets/
```

### 🎯 **Optimization Tips**
- **Code Splitting** - TanStack Router automatic splitting
- **Lazy Loading** - Import components dynamically
- **Tree Shaking** - Remove unused code
- **Image Optimization** - Compress images
- **Caching** - Leverage browser caching

### 📈 **Performance Metrics**
- **Bundle Size**: <500KB initial load
- **First Paint**: <1s
- **Time to Interactive**: <2s
- **Lighthouse Score**: 90+ (target)

---

## 🔧 Troubleshooting

### ❓ **Common Issues**

#### Port sudah digunakan
```bash
# Check port usage
lsof -i :3001

# Kill process
kill -9 <PID>

# Atau gunakan port lain
pnpm run dev --port 3002
```

#### TypeScript errors
```bash
# Clear TypeScript cache
rm -rf node_modules/.cache

# Regenerate route tree
npx tsr generate

# Restart TypeScript server (VS Code)
Cmd/Ctrl + Shift + P > "TypeScript: Restart TS Server"
```

#### Build errors
```bash
# Clear build cache
rm -rf dist node_modules/.vite

# Reinstall dependencies
rm -rf node_modules pnpm-lock.yaml
pnpm install

# Try build again
pnpm run build
```

---

## 📖 Resources

### 📚 **Documentation**
- [TanStack Router Docs](https://tanstack.com/router)
- [React Documentation](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Vite Guide](https://vitejs.dev/guide/)

### 🎓 **Learning Resources**
- [React TypeScript Cheatsheet](https://react-typescript-cheatsheet.netlify.app/)
- [TanStack Router Tutorial](https://tanstack.com/router/latest/docs/framework/react/guide/file-based-routing)
- [Tailwind CSS Tutorial](https://tailwindcss.com/docs/utility-first)

### 🛠️ **Tools**
- [VS Code Extensions](https://marketplace.visualstudio.com/items?itemName=bradlc.vscode-tailwindcss)
- [React DevTools](https://react.dev/learn/react-developer-tools)
- [TanStack Router DevTools](https://tanstack.com/router/latest/docs/framework/react/devtools)

---

## 📄 License

Frontend code is licensed under the **MIT License** - see the [LICENSE](../LICENSE) file for details.

---

## 🙏 Credits & Acknowledgments

### 👨‍💻 **Project Initiator**
**[@sandikodev](https://twitter.com/sandikodev)** - *Original creator and project initiator*

*Full-stack developer passionate about AI and video technology*

### 🤝 **Community Contributors**
- Frontend architecture dan component design
- UI/UX improvements dan responsive design
- Performance optimizations dan best practices
- Testing infrastructure dan documentation
- Bug fixes dan feature enhancements

### 🛠️ **Open Source Dependencies**
- **[React](https://reactjs.org/)** - UI library
- **[TanStack Router](https://tanstack.com/router)** - Type-safe routing
- **[Tailwind CSS](https://tailwindcss.com/)** - CSS framework
- **[Vite](https://vitejs.dev/)** - Build tool
- **[TypeScript](https://www.typescriptlang.org/)** - Type safety

---

<div align="center">

**⭐ Star the main repo if you find this helpful!**

**Built with ❤️ by the community • Initiated by [@sandikodev](https://twitter.com/sandikodev)**

[🚀 Get Started](#-quick-start) • [🏗️ Architecture](#️-architecture) • [🤝 Contribute](#-contributing)

</div>
