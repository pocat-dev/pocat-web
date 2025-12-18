# Pocat Design System Implementation Plan

Target: Match Gemini mockups (Vercel/Linear aesthetic, dark-first, violet accent)

## Phase Overview

| Phase | Focus | Status | Est. Time |
|-------|-------|--------|-----------|
| 1 | Color Tokens | ✅ Done | 15 min |
| 2 | Typography & Effects | ✅ Done | 10 min |
| 3 | Core Components (CSS) | ✅ Done | 20 min |
| 4 | Layout Components (CSS) | ✅ Done | 15 min |
| 5 | Page Templates | ✅ Done | Per page |
| 6 | Atomic UI Components | 🔄 Current | 30 min |
| 7 | Component Refactor | ⏳ Pending | Per file |

---

## Phase 1: Color Tokens (Foundation) ✅

Update color palette to match mockups.

### Changes
- [x] Deep dark background (#0c0a14 with violet undertone)
- [x] Violet-600 as primary accent (#7c3aed)
- [x] Green for success/viral scores (#22c55e)
- [x] Subtle borders with violet undertone (#2a2735)
- [x] Dark mode as DEFAULT

### Final Tokens
```css
--surface-base: #0c0a14       /* Body bg */
--surface-primary: #13111c    /* Cards, panels */
--surface-secondary: #1c1926  /* Elevated, inputs */
--surface-tertiary: #262333   /* Hover states */
--border-primary: #2a2735     /* Borders */
```

---

## Phase 2: Typography & Effects ✅

### Changes
- [x] Inter font
- [x] Type scale (xs to 7xl for hero)
- [x] Gradient text utility
- [x] Glow/blur effects for glassmorphism

### Utilities Added
```css
.text-gradient       /* Violet gradient text */
.glow-violet         /* Box glow effect */
.glass               /* Glassmorphism panel */
.bg-gradient-hero    /* Hero background */
```

---

## Phase 3: Core Components (CSS) ✅

### Buttons
- [x] `.btn-primary` - Violet gradient with glow
- [x] `.btn-secondary` - Outline style
- [x] `.btn-ghost` - Minimal
- [x] `.btn-outline-violet` - Violet outline
- [x] Sizes: sm, md, lg, xl
- [x] `.btn-icon` - Square icon button

### Cards
- [x] `.card` - Dark surface with thin border
- [x] `.card-glass` - Glassmorphism variant
- [x] `.card-hover` - Lift on hover
- [x] `.card-glow` - Glow on hover
- [x] `.stat-card` - Big number + label
- [x] `.action-card` - Icon + title + desc

### Badges
- [x] `.badge-success/.badge-done` - Green
- [x] `.badge-warning` - Yellow
- [x] `.badge-error` - Red
- [x] `.badge-info` - Blue
- [x] `.badge-processing` - Violet pulsing
- [x] `.badge-viral` - Green viral score
- [x] `.badge-neutral` - Gray

### Inputs
- [x] `.input` - Dark background
- [x] Violet focus ring
- [x] `.input-group` - With icon support
- [x] `.form-input` - Light theme (login)

---

## Phase 4: Layout Components (CSS) ✅

### Sidebar
- [x] `.sidebar` - Collapsed icon nav
- [x] `.sidebar-item` - Icon + optional label
- [x] `.sidebar-item.active` - Violet highlight
- [x] `.dashboard-sidebar` - Dashboard specific

### Timeline
- [x] `.timeline` - Waveform container
- [x] `.timeline-marker` - Cut point indicator
- [x] `.timeline-selection` - Selected range
- [x] `.timeline-playhead` - Current position

### Other Layouts
- [x] `.app-shell` - Main flex container
- [x] `.editor-layout` - 3-column grid
- [x] `.hero` - Landing hero section
- [x] `.container` - Max-width wrapper

---

## Phase 5: Page Templates ✅

| Page | Route | Status |
|------|-------|--------|
| Login | `/login` | ✅ Light theme card |
| Dashboard | `/dashboard` | ✅ Sidebar + stats + table |
| Library | `/library` | ✅ Grid cards |
| Settings | `/settings` | ✅ 2-column layout |
| Editor | `/editor` | ✅ 3-column layout |
| Landing | `/` | ✅ Hero + features |

---

## Phase 6: Atomic UI Components 🔄

Create reusable React components from CSS classes.

### Structure
```
src/components/ui/
├── Button.tsx
├── Input.tsx
├── Select.tsx
├── Card.tsx
├── Badge.tsx
├── Toggle.tsx
├── IconButton.tsx
└── index.ts
```

### Component Specs

#### 6.1 Button
```tsx
interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline'
  size?: 'sm' | 'md' | 'lg'
  leftIcon?: ReactNode
  rightIcon?: ReactNode
  loading?: boolean
  disabled?: boolean
}
```

#### 6.2 Input
```tsx
interface InputProps {
  type?: 'text' | 'password' | 'email'
  size?: 'sm' | 'md' | 'lg'
  leftIcon?: ReactNode
  showPasswordToggle?: boolean
}
```

#### 6.3 Select
```tsx
interface SelectProps {
  options: { value: string; label: string }[]
  size?: 'sm' | 'md' | 'lg'
}
```

#### 6.4 Card
```tsx
interface CardProps {
  variant?: 'default' | 'glass' | 'hover' | 'glow'
}
// + Card.Header, Card.Body compound
```

#### 6.5 Badge
```tsx
interface BadgeProps {
  variant?: 'success' | 'warning' | 'error' | 'info' | 'neutral' | 'processing' | 'viral'
  icon?: ReactNode
}
```

#### 6.6 Toggle
```tsx
interface ToggleProps {
  checked?: boolean
  onChange?: (checked: boolean) => void
  disabled?: boolean
}
```

#### 6.7 IconButton
```tsx
interface IconButtonProps {
  icon: ReactNode
  size?: 'sm' | 'md' | 'lg'
  variant?: 'ghost' | 'outline'
}
```

### Progress
- [x] 6.1 Button
- [x] 6.2 Input
- [x] 6.3 Select
- [x] 6.4 Card
- [x] 6.5 Badge
- [x] 6.6 Toggle
- [x] 6.7 IconButton
- [x] 6.8 Barrel export (index.ts)

---

## Phase 7: Component Refactor ⏳

Replace inline styles/classes with atomic components.

### Target Files
| File | Size | Priority |
|------|------|----------|
| SettingsView.tsx | 12.9KB | High |
| LibraryView.tsx | 4KB | Medium |
| dashboard.tsx | 5.2KB | Medium |
| editor.tsx | 6.8KB | Medium |
| login.tsx | 3.4KB | Low |
| index.tsx | 7.2KB | Low |

### Progress
- [ ] 7.1 SettingsView.tsx
- [ ] 7.2 LibraryView.tsx
- [ ] 7.3 dashboard.tsx
- [ ] 7.4 editor.tsx
- [ ] 7.5 login.tsx
- [ ] 7.6 index.tsx

---

## Iteration Process

Each phase:
1. Update code
2. Test in browser (dev server)
3. Adjust based on visual feedback
4. Commit when satisfied
5. Move to next phase

---

## Commit Log

| Commit | Description |
|--------|-------------|
| `06469eb` | docs: add Gemini design mockups |
| `9e1194e` | docs: add detailed mockups + prompts |
| `81980bc` | feat: design system v3 |
| `810bd35` | fix: navigate useEffect |
| `7ec388b` | fix: color consistency |

---

## Current Status

- [x] Phase 0: Design references saved
- [x] Phase 1: Color Tokens
- [x] Phase 2: Typography & Effects
- [x] Phase 3: Core Components (CSS)
- [x] Phase 4: Layout Components (CSS)
- [x] Phase 5: Page Templates
- [ ] Phase 6: Atomic UI Components ← **START HERE**
- [ ] Phase 7: Component Refactor
