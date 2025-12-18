# CSS Naming Convention - Pocat Design System

## 🎯 Naming Strategy

### **Component Naming**
```css
.component-name { }           /* Base component */
.component-name-element { }   /* Child element */
.component-name.modifier { }  /* Variant/state */
```

### **Layout Naming**
```css
.layout-name { }              /* Layout container */
.layout-name-section { }      /* Layout section */
```

### **Page Naming**
```css
.page-name-element { }        /* Page-specific element */
```

## 📁 File Organization

### **Components** (`/components/`)
- **Purpose**: Reusable UI components
- **Naming**: `component-domain.css`
- **Examples**: `buttons.css`, `forms.css`, `navigation.css`

### **Layouts** (`/layouts/`)
- **Purpose**: Page structure and shell
- **Naming**: `layout-type.css`
- **Examples**: `app-shell.css`, `auth-layout.css`

### **Pages** (`/pages/`)
- **Purpose**: Page-specific styles
- **Naming**: `page-name.css`
- **Examples**: `landing.css`, `overview.css`, `settings.css`

### **Base** (`/base/`)
- **Purpose**: Foundation styles
- **Naming**: `foundation-type.css`
- **Examples**: `tokens.css`, `reset.css`, `utilities.css`

## 🎨 Component Categories

### **Navigation Components**
```css
.app-nav { }                  /* Main app navigation */
.horizontal-nav { }           /* Horizontal navigation */
.breadcrumb { }               /* Breadcrumb navigation */
.tab-nav { }                  /* Tab navigation */
.pagination { }               /* Pagination controls */
```

### **Layout Components**
```css
.app-layout { }               /* Main app layout */
.app-sidebar { }              /* Sidebar layout */
.app-main { }                 /* Main content area */
.grid-layout { }              /* Grid layouts */
```

### **Content Components**
```css
.page-header { }              /* Page headers */
.media-card { }               /* Media/video cards */
.empty-state { }              /* Empty state displays */
.action-grid { }              /* Action button grids */
```

### **Form Components**
```css
.form-group { }               /* Form field groups */
.input-group { }              /* Input with addons */
.settings-input { }           /* Settings-specific inputs */
```

### **Data Components**
```css
.data-table { }               /* Data tables */
.project-row { }              /* Project list rows */
.clip-item { }                /* Video clip items */
```

## 🔧 Modifier Patterns

### **Size Modifiers**
```css
.component.sm { }             /* Small variant */
.component.lg { }             /* Large variant */
.component.xl { }             /* Extra large variant */
```

### **State Modifiers**
```css
.component.active { }         /* Active state */
.component.disabled { }       /* Disabled state */
.component.loading { }        /* Loading state */
```

### **Color Modifiers**
```css
.component.primary { }        /* Primary color */
.component.secondary { }      /* Secondary color */
.component.danger { }         /* Danger/error color */
```

### **Layout Modifiers**
```css
.grid-layout.cols-3 { }       /* 3 column grid */
.grid-layout.auto-fit { }     /* Auto-fit grid */
.action-group.vertical { }    /* Vertical layout */
```

## 📊 Naming Examples

### **Good Examples**
```css
/* Clear, descriptive, consistent */
.media-card-thumbnail { }
.dashboard-action-icon { }
.settings-section-header { }
.app-nav-item.active { }
.grid-layout.cols-3 { }
```

### **Avoid**
```css
/* Too generic or unclear */
.card { }
.item { }
.container { }
.wrapper { }
.box { }
```

## 🎯 Consistency Rules

1. **Use kebab-case** for all class names
2. **Be descriptive** but not verbose
3. **Follow component-element-modifier** pattern
4. **Use consistent prefixes** for related components
5. **Avoid abbreviations** unless widely understood
6. **Use semantic names** over visual descriptions

## 🔄 Migration Guidelines

When updating existing components:
1. **Keep backward compatibility** during transition
2. **Add new classes** alongside old ones
3. **Update documentation** with new patterns
4. **Test thoroughly** before removing old classes
5. **Communicate changes** to team members
