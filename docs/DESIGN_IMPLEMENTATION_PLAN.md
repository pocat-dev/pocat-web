# Pocat Design System Implementation Plan

Target: Match Gemini mockups (Vercel/Linear aesthetic, dark-first, violet accent)

## Phase Overview

| Phase | Focus | Files | Est. Time |
|-------|-------|-------|-----------|
| 1 | Color Tokens | design-system.css | 15 min |
| 2 | Typography & Effects | design-system.css | 10 min |
| 3 | Core Components | design-system.css | 20 min |
| 4 | Layout Components | New CSS module | 15 min |
| 5 | Page Templates | Route files | Per page |

---

## Phase 1: Color Tokens (Foundation)

Update color palette to match mockups.

### Changes
- [ ] Deep dark background (#09090b, #0f0d1a)
- [ ] Violet-600 as primary accent (#7c3aed)
- [ ] Green for success/viral scores (#22c55e)
- [ ] Subtle borders with low opacity
- [ ] Dark mode as DEFAULT (flip light/dark)

### New Tokens
```css
--bg-base: #09090b        /* Deepest background */
--bg-surface: #0f0d1a     /* Cards, panels */
--bg-elevated: #1a1625    /* Hover states */
--accent-violet: #7c3aed  /* Primary CTA */
--accent-glow: #8b5cf6    /* Glow effects */
--viral-green: #22c55e    /* Viral score badges */
```

---

## Phase 2: Typography & Effects

### Changes
- [ ] Inter font (already set)
- [ ] Larger headline sizes for hero
- [ ] Gradient text utility
- [ ] Glow/blur effects for glassmorphism

### New Utilities
```css
.text-gradient       /* Violet gradient text */
.glow-violet         /* Box glow effect */
.glass               /* Glassmorphism panel */
```

---

## Phase 3: Core Components

### Buttons
- [ ] `.btn-primary` - Violet gradient with glow
- [ ] `.btn-outline` - Transparent with border
- [ ] Hover states with subtle glow

### Cards
- [ ] `.card` - Dark surface with thin border
- [ ] `.card-glass` - Glassmorphism variant
- [ ] `.stat-card` - Big number + label

### Badges
- [ ] `.badge-viral` - Green viral score
- [ ] `.badge-processing` - Violet pulsing
- [ ] `.badge-done` - Green checkmark

### Inputs
- [ ] Dark background inputs
- [ ] Violet focus ring
- [ ] Password toggle icon support

---

## Phase 4: Layout Components

### Sidebar
- [ ] `.sidebar` - Collapsed icon nav
- [ ] `.sidebar-item` - Icon + optional label
- [ ] `.sidebar-item.active` - Violet highlight

### Timeline
- [ ] `.timeline` - Waveform container
- [ ] `.timeline-marker` - Cut point indicator
- [ ] `.timeline-selection` - Selected range

### Tables
- [ ] `.table-dark` - Project list style
- [ ] Row hover states
- [ ] Thumbnail + text alignment

---

## Phase 5: Page Templates

Apply to actual routes:

1. **Login** (`/login`) - Centered card, light bg option
2. **Dashboard** (`/dashboard`) - Sidebar + stat cards + table
3. **Editor** (`/editor`) - 3-column layout
4. **Landing** (`/`) - Hero + features + CTA

---

## Iteration Process

Each phase:
1. Update CSS
2. Test in browser (dev server)
3. Adjust based on visual feedback
4. Commit when satisfied
5. Move to next phase

---

## Current Status

- [x] Phase 0: Design references saved
- [x] Phase 1: Color Tokens
- [x] Phase 2: Typography & Effects
- [x] Phase 3: Core Components
- [x] Phase 4: Layout Components
- [x] Phase 5: Page Templates
