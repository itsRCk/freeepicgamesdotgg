# Vercel Geist – Motion & Animations

> Reference: Vercel Design System motion principles

Geist motion is **purposeful and restrained**. Animations serve to orient the user — they never exist purely as decoration. Every transition should be fast, physics-based where appropriate, and always respect `prefers-reduced-motion`.

---

## Core Principles

1. **Speed**: UI transitions should feel instant. Use `150ms–300ms` durations. Never exceed `500ms` for UI transitions.
2. **Easing**: Prefer `ease-in-out` for state changes, `ease-out` for entrances, `ease-in` for exits.
3. **Purpose**: Every animated element should have a clear reason (e.g., confirming a click, guiding the eye, preventing layout shift).
4. **Subtlety**: Opacity and translate are preferred over scale and rotate. Scale above 1.05 feels excessive for Geist.

---

## Duration Scale

| Token | Duration | Usage |
|-------|----------|-------|
| `instant` | `0ms` | Focus rings, active states |
| `fast` | `100ms` | Button hover fills, icon swaps |
| `normal` | `150ms` | **Default for most UI transitions** |
| `moderate` | `200ms` | Card hover borders, dropdown open |
| `slow` | `300ms` | Panel slide-ins, modal appearance |
| `deliberate` | `500ms` | Page transitions, large reveals |

---

## Easing Functions

```css
/* Geist standard easings */
--ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);   /* Standard — state changes */
--ease-out:    cubic-bezier(0, 0, 0.2, 1);       /* Enter — elements appearing */
--ease-in:     cubic-bezier(0.4, 0, 1, 1);       /* Exit — elements disappearing */
--ease-spring: cubic-bezier(0.34, 1.56, 0.64, 1); /* Subtle overshoot — interactive */
```

In Tailwind: `ease-in-out`, `ease-out`, `ease-in`  
For spring: `transition: transform 300ms cubic-bezier(0.34, 1.56, 0.64, 1)`

---

## Hover Transitions

Apply to all interactive elements. Keep durations short:

```tsx
// Card border reveal
className="border border-white/8 hover:border-white/20 transition-colors duration-200"

// Button fill
className="bg-white hover:bg-[#ebebeb] transition-colors duration-150"

// Link colour
className="text-[#888] hover:text-[#ededed] transition-colors duration-150"

// Icon opacity
className="text-[#555] hover:text-[#888] transition-colors duration-150"

// Subtle lift (use sparingly)
className="hover:-translate-y-0.5 transition-transform duration-200"
```

> ⚠️ Avoid `hover:scale-105` on large cards — it causes layout shift and feels heavy

---

## Entrance Animations (Framer Motion)

All entrance animations should be **subtle opacity + translate**:

```tsx
import { motion } from 'framer-motion';

// Standard fade-in-up (most common)
const fadeInUp = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.3, ease: [0, 0, 0.2, 1] },
};

<motion.div {...fadeInUp}>
  <Card />
</motion.div>

// Staggered list entrance
const container = {
  animate: { transition: { staggerChildren: 0.05 } },
};

const item = {
  initial: { opacity: 0, y: 6 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.25, ease: 'easeOut' } },
};

<motion.ul variants={container} initial="initial" animate="animate">
  {items.map(i => (
    <motion.li key={i.id} variants={item}>{i.label}</motion.li>
  ))}
</motion.ul>
```

---

## Exit Animations

```tsx
import { AnimatePresence, motion } from 'framer-motion';

// Modal / dialog
<AnimatePresence>
  {isOpen && (
    <motion.div
      key="modal"
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.97 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
    />
  )}
</AnimatePresence>

// Dropdown / popover
<AnimatePresence>
  {isOpen && (
    <motion.div
      initial={{ opacity: 0, y: -4 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -4 }}
      transition={{ duration: 0.15, ease: 'easeOut' }}
    />
  )}
</AnimatePresence>
```

---

## Toast / Notification

```tsx
<AnimatePresence>
  {toasts.map(toast => (
    <motion.div
      key={toast.id}
      layout
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.95 }}
      transition={{ duration: 0.25, ease: [0, 0, 0.2, 1] }}
    >
      <Toast {...toast} />
    </motion.div>
  ))}
</AnimatePresence>
```

---

## Page Transitions (Next.js App Router)

Use minimal cross-fade for route changes:

```tsx
// In a layout wrapper
<motion.main
  key={pathname}
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  transition={{ duration: 0.2 }}
>
  {children}
</motion.main>
```

> ✅ Keep page transitions to opacity only. Sliding pages feel sluggish and disorienting.

---

## Loading States

```tsx
// Pulse skeleton (CSS only — no JS needed)
<div className="animate-pulse">
  <div className="h-4 rounded bg-white/5 w-3/4 mb-2" />
  <div className="h-4 rounded bg-white/5 w-1/2" />
</div>

// Spinner
<svg className="animate-spin w-4 h-4 text-[#555]" viewBox="0 0 24 24" fill="none">
  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
</svg>
```

---

## Reduced Motion

**Always** include a reduced-motion fallback:

```tsx
// Using Tailwind
className="transition-transform motion-reduce:transition-none"

// Using CSS
@media (prefers-reduced-motion: reduce) {
  .animated-element {
    animation: none !important;
    transition: none !important;
  }
}

// Using Framer Motion
import { useReducedMotion } from 'framer-motion';

function AnimatedCard() {
  const reduceMotion = useReducedMotion();
  return (
    <motion.div
      initial={reduceMotion ? false : { opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
    />
  );
}
```

---

## What to Avoid

```
❌ duration > 500ms for UI transitions
❌ scale > 1.05 on hover for cards
❌ Sliding page transitions (left/right/up/down)
❌ Continuous / looping animations (blinking, spinning decorations)
❌ Parallax effects that move content at different speeds during scroll
❌ Multiple simultaneous animations on the same element
❌ Bounce/overshoot (spring) on large containers — only on small interactive elements
```
