# CSS Modular Optimization Strategy

## 🎯 Current Issues & Solutions

### **1. File Size Ambiguity**
**Problem**: Large page files (670+ lines) defeat LLM-friendly purpose

**Solution**: Split by feature domains
```
pages/landing/
├── hero.css (planetary system)
├── features.css (feature sections)  
├── layout.css (page structure)
└── index.css (imports)

pages/editor/
├── panels.css (left/right panels)
├── timeline.css (video timeline)
├── toolbar.css (editing tools)
└── index.css (imports)
```

### **2. Component Misplacement**
**Problem**: `tables.css` contains non-table components

**Solution**: Rename and reorganize
```
components/
├── data-display.css (tables, lists, grids)
├── feedback.css (progress, tooltips, alerts)
├── media.css (avatars, thumbnails, clips)
└── navigation.css (breadcrumbs, pagination)
```

### **3. Layout vs Page Confusion**
**Problem**: `dashboard.css` (layout) vs `overview.css` (page)

**Solution**: Clear separation
```
layouts/
├── app-shell.css (header, sidebar, main)
├── auth-layout.css (signin/signup structure)
└── dashboard-layout.css (dashboard structure)

pages/
├── dashboard-home.css (overview content)
├── dashboard-library.css (library content)
└── dashboard-settings.css (settings content)
```

## 🚀 Implementation Phases

### **Phase A: Component Reorganization**
1. Split `tables.css` → `data-display.css` + `feedback.css` + `media.css`
2. Move reusable components from pages to components
3. Create `navigation.css` for nav-related components

### **Phase B: Page Splitting**
1. Split `landing.css` → feature-based modules
2. Split `editor.css` → panel-based modules  
3. Create index files for imports

### **Phase C: Layout Clarification**
1. Rename `dashboard.css` → `app-shell.css`
2. Move page content from layouts to pages
3. Clear layout vs page boundaries

## 📊 Target Structure

```
src/styles/
├── design-system.css (31 lines - imports only)
├── base/ (5 files - foundation)
├── components/ (8 files - reusable UI)
├── layouts/ (3 files - structure only)
└── pages/ (12 files - content only, max 300 lines each)
```

## 🎯 Success Metrics

- ✅ No file > 300 lines (LLM-friendly)
- ✅ Clear component boundaries
- ✅ Zero duplicate selectors
- ✅ Logical file naming
- ✅ Easy to find & modify styles

## 🔄 Migration Strategy

1. **Backward compatible** - keep old imports during transition
2. **Gradual migration** - one component at a time
3. **Build verification** - ensure no styling breaks
4. **Documentation** - update component map

## 🎨 Naming Convention

- **Components**: `{domain}.css` (forms, navigation, feedback)
- **Pages**: `{page-name}.css` (landing, editor, settings)  
- **Layouts**: `{layout-type}.css` (app-shell, auth-layout)
- **Features**: `{page}/{feature}.css` (landing/hero, editor/timeline)
