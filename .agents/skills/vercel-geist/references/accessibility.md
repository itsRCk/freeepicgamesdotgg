# Vercel Geist – Accessibility

> Reference: https://vercel.com/geist/accessibility  
> Standard: WCAG 2.1 Level AA

Geist treats accessibility as a **non-negotiable baseline**, not a feature. Every component and page must meet or exceed WCAG AA standards.

---

## Colour Contrast Requirements

| Text Type | Minimum Ratio | Geist Dark Mode Pass |
|-----------|--------------|---------------------|
| Normal text (`< 18px` or `< 14px bold`) | 4.5 : 1 | `text-[#888]` on `#0a0a0a` ✅ (5.2:1) |
| Large text (`≥ 18px` or `≥ 14px bold`) | 3 : 1 | `text-[#555]` on `#0a0a0a` ✅ (3.1:1) |
| UI components (borders, icons) | 3 : 1 | `border-white/15` on `#111` ✅ |
| Disabled (decorative) | None | N/A |

> ❗ Never use `text-[#333]` or `text-[#444]` on dark backgrounds — fails contrast
> ✅ Use `text-[#888]` minimum for body copy on `#0a0a0a` backgrounds

### Quick Contrast Reference

```
#ededed on #0a0a0a → 15.4:1  ✅ AAA (primary text)
#888888 on #0a0a0a →  5.2:1  ✅ AA  (secondary text)
#555555 on #0a0a0a →  3.1:1  ✅ AA (large text / icons only)
#3a3a3a on #0a0a0a →  1.6:1  ❌ FAIL (never use for text)
```

---

## Focus Management

Every interactive element must have a visible focus ring:

```tsx
// Standard Geist focus ring
className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
```

### Rules
- Use `focus-visible:` (not `focus:`) — only show ring for keyboard navigation
- Ring offset background must match the parent surface colour
- Never use `outline-none` without providing an alternative focus indicator
- Focus must move logically in DOM order — avoid `tabindex > 0`

---

## Keyboard Navigation

| Component | Expected Behaviour |
|-----------|-------------------|
| Button | `Enter` / `Space` to activate |
| Link | `Enter` to activate |
| Select/Dropdown | `Space` to open, `↑↓` to navigate, `Enter` to select, `Escape` to close |
| Modal/Dialog | `Escape` to close, focus trapped inside |
| Tab list | `←→` to switch tabs (roving tabindex) |
| Menu | `↑↓` to navigate, `Enter` to select, `Escape` to close |

### Roving Tabindex (Tab Lists)

```tsx
// Only the active tab is tabbable; others navigate with arrow keys
<div role="tablist">
  {tabs.map((tab, i) => (
    <button
      key={tab.id}
      role="tab"
      tabIndex={activeTab === tab.id ? 0 : -1}
      aria-selected={activeTab === tab.id}
      aria-controls={`panel-${tab.id}`}
      onKeyDown={(e) => {
        if (e.key === 'ArrowRight') focusNextTab(i);
        if (e.key === 'ArrowLeft') focusPrevTab(i);
      }}
    >
      {tab.label}
    </button>
  ))}
</div>
```

---

## ARIA Patterns

### Buttons vs Links
- Use `<button>` for actions (submit, toggle, delete)
- Use `<a href>` for navigation
- Never use `<div onClick>` — always a real `<button>` or `<a>`

### Icon-Only Buttons

```tsx
<button aria-label="Close dialog" className="...">
  <XIcon className="w-4 h-4" aria-hidden="true" />
</button>
```

### Status Badges

```tsx
<span role="status" aria-label="Deployment status: Ready">
  <span className="text-green-400">● Ready</span>
</span>
```

### Loading States

```tsx
<button disabled aria-busy="true" aria-label="Saving changes...">
  <Spinner aria-hidden="true" />
  Saving...
</button>
```

### Error Messages

```tsx
<div>
  <input
    id="email"
    aria-describedby="email-error"
    aria-invalid={!!error}
    className={cn("...", error && "border-red-500/50")}
  />
  {error && (
    <p id="email-error" role="alert" className="text-xs text-red-400 mt-1">
      {error}
    </p>
  )}
</div>
```

---

## Screen Reader Utilities

```tsx
// Visually hidden but readable by screen readers
<span className="sr-only">Expand section</span>

// Hide from screen readers (decorative)
<svg aria-hidden="true" focusable="false">...</svg>
```

---

## Semantic HTML

Use appropriate HTML5 elements:

| Element | When to Use |
|---------|------------|
| `<main>` | Primary page content (one per page) |
| `<nav>` | Navigation lists |
| `<aside>` | Sidebars, supplementary content |
| `<section>` | Logically grouped page sections (with heading) |
| `<article>` | Self-contained content (cards, blog posts) |
| `<header>` | Page or section header |
| `<footer>` | Page or section footer |
| `<h1>–<h6>` | Heading hierarchy — one `<h1>` per page |
| `<ul>/<ol>` | Lists — never `<div>` chains for list items |

---

## Motion & Reduced Motion

Always respect the `prefers-reduced-motion` media query:

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

In Tailwind:
```tsx
className="transition-opacity motion-reduce:transition-none"
```

See `animations.md` for full motion guidelines.

---

## Testing Checklist

Before shipping any UI:

- [ ] All text passes WCAG AA contrast (use browser DevTools → Accessibility)
- [ ] All buttons and links are reachable and activatable via keyboard
- [ ] Focus ring is visible on all interactive elements
- [ ] Screen reader announces role, state, and label for all interactive elements
- [ ] No `div` or `span` elements with click handlers missing `role` and `tabIndex`
- [ ] `aria-label` on all icon-only buttons
- [ ] `role="alert"` on dynamically injected error messages
- [ ] Modal/dialog traps focus and returns it on close
- [ ] Motion is disabled when `prefers-reduced-motion: reduce` is active
