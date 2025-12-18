# CSS Modular Architecture Plan

> Rencana refactor design-system.css menjadi struktur modular

## 🎯 Tujuan

1. **Separation of Concerns** - Setiap file punya tanggung jawab spesifik
2. **LLM Friendly** - File kecil (~200-300 lines) mudah diproses AI agent
3. **Maintainability** - Mudah menemukan dan mengedit style
4. **Scalability** - Mudah menambah fitur baru tanpa file membengkak

## 📁 Struktur Direktori

```
frontend/src/styles/
├── index.css              # Entry point - imports semua modules
│
├── base/                  # Foundation styles
│   ├── reset.css          # CSS reset & normalize (~50 lines)
│   ├── tokens.css         # CSS variables - colors, spacing, fonts (~150 lines)
│   └── typography.css     # Font styles, headings, text utilities (~100 lines)
│
├── components/            # Reusable UI components
│   ├── buttons.css        # Button variants (~100 lines)
│   ├── inputs.css         # Form inputs, selects, toggles (~150 lines)
│   ├── cards.css          # Card styles (~80 lines)
│   └── badges.css         # Badge variants (~60 lines)
│
├── layouts/               # Page layout structures
│   ├── dashboard.css      # Dashboard layout, sidebar (~200 lines)
│   ├── editor.css         # Editor 3-column layout (~250 lines)
│   └── auth.css           # Login/register pages (~100 lines)
│
├── pages/                 # Page-specific styles
│   ├── landing.css        # Landing page (~350 lines)
│   ├── settings.css       # Settings page (~100 lines)
│   └── library.css        # Library grid (~80 lines)
│
└── utilities/             # Helper classes
    └── helpers.css        # Utility classes (~100 lines)
```

## 📊 Perbandingan

| Aspek | Sebelum (Monolith) | Sesudah (Modular) |
|-------|-------------------|-------------------|
| Total files | 1 | 13 |
| Lines per file | ~3000+ | ~100-350 |
| LLM token usage | High (full file) | Low (targeted file) |
| Find & edit | Scroll/search | Direct file access |
| Git conflicts | High risk | Low risk |
| Code review | Difficult | Easy |

## 📝 Entry Point: index.css

```css
/* ============================================
   POCAT DESIGN SYSTEM
   Modular CSS Architecture
   ============================================ */

/* Base - Foundation */
@import './base/reset.css';
@import './base/tokens.css';
@import './base/typography.css';

/* Components - Reusable UI */
@import './components/buttons.css';
@import './components/inputs.css';
@import './components/cards.css';
@import './components/badges.css';

/* Layouts - Page Structures */
@import './layouts/dashboard.css';
@import './layouts/editor.css';
@import './layouts/auth.css';

/* Pages - Page Specific */
@import './pages/landing.css';
@import './pages/settings.css';
@import './pages/library.css';

/* Utilities - Helpers */
@import './utilities/helpers.css';
```

## 🔄 Migration Strategy

### Phase 1: Landing Page (Current Focus)
- [ ] Extract landing page styles ke `pages/landing.css`
- [ ] Test build & verify no regressions

### Phase 2: Base Styles
- [ ] Extract CSS variables ke `base/tokens.css`
- [ ] Extract reset styles ke `base/reset.css`
- [ ] Extract typography ke `base/typography.css`

### Phase 3: Components
- [ ] Extract button styles ke `components/buttons.css`
- [ ] Extract input styles ke `components/inputs.css`
- [ ] Extract card styles ke `components/cards.css`
- [ ] Extract badge styles ke `components/badges.css`

### Phase 4: Layouts
- [ ] Extract dashboard layout ke `layouts/dashboard.css`
- [ ] Extract editor layout ke `layouts/editor.css`
- [ ] Extract auth layout ke `layouts/auth.css`

### Phase 5: Pages & Utilities
- [ ] Extract settings styles ke `pages/settings.css`
- [ ] Extract library styles ke `pages/library.css`
- [ ] Extract utility classes ke `utilities/helpers.css`

### Phase 6: Cleanup
- [ ] Remove old design-system.css
- [ ] Update imports in main app
- [ ] Verify all pages render correctly
- [ ] Run production build test

## 📋 File Content Guidelines

### Naming Convention
```css
/* File: components/buttons.css */

/* ============================================
   BUTTONS
   ============================================ */

/* Base Button */
.btn { ... }

/* Variants */
.btn-primary { ... }
.btn-secondary { ... }

/* Sizes */
.btn-sm { ... }
.btn-lg { ... }

/* States */
.btn:hover { ... }
.btn:disabled { ... }
```

### Comment Structure
```css
/* ============================================
   SECTION NAME
   ============================================ */

/* Sub-section */
.class { ... }

/* Another sub-section */
.another-class { ... }
```

## ⚠️ Important Notes

1. **Vite handles @import** - No need for build tools, Vite bundles automatically
2. **Order matters** - Base → Components → Layouts → Pages → Utilities
3. **No duplicate selectors** - Each selector should exist in only one file
4. **CSS Variables in tokens.css** - All variables defined in one place

## 🔧 Vite Configuration

Tidak perlu konfigurasi tambahan. Vite secara otomatis:
- Resolve @import statements
- Bundle semua CSS menjadi satu file di production
- Tree-shake unused styles (jika pakai PurgeCSS)

## ✅ Current Status

- [x] Plan documented
- [x] Phase 1: Landing page extraction (`styles/pages/landing.css` - 605 lines)
- [ ] Phase 2: Base styles extraction
- [ ] Phase 3: Components extraction
- [ ] Phase 4: Layouts extraction
- [ ] Phase 5: Pages & utilities extraction
- [ ] Phase 6: Cleanup & verification

---

*Last updated: 2025-12-19*
