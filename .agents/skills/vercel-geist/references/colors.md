# Vercel Geist – Color System

> Source: https://vercel.com/geist/colors

## CSS Custom Properties

Geist uses a design token layer exposed as CSS custom properties. In Tailwind v4, these are declared via `@theme` in `globals.css`.

### Gray Scale (Primary Palette)

The gray scale is the backbone of all Geist UIs. It is monochromatic and works in both light and dark themes.

| Token | Dark Mode Value | Light Mode Value | Usage |
|-------|----------------|-----------------|-------|
| `--ds-background-100` | `#0a0a0a` | `#ffffff` | Page root background |
| `--ds-background-200` | `#111111` | `#fafafa` | Secondary background |
| `--ds-gray-100` | `#1a1a1a` | `#f2f2f2` | Subtle fills / hover states |
| `--ds-gray-200` | `#222222` | `#ebebeb` | Subtle borders |
| `--ds-gray-300` | `#2a2a2a` | `#e2e2e2` | Disabled backgrounds |
| `--ds-gray-400` | `#3a3a3a` | `#d0d0d0` | Default border color |
| `--ds-gray-500` | `#555555` | `#ababab` | Placeholder text |
| `--ds-gray-600` | `#666666` | `#898989` | Muted icons |
| `--ds-gray-700` | `#888888` | `#666666` | Secondary/muted text |
| `--ds-gray-800` | `#999999` | `#444444` | Tertiary text |
| `--ds-gray-900` | `#b0b0b0` | `#2a2a2a` | Body/copy text |
| `--ds-gray-1000` | `#ededed` | `#111111` | Primary text |

### Alpha Variants

Use alpha gray variants for overlays, hover states, and subtle fills without affecting background blending:

| Token | Value | Usage |
|-------|-------|-------|
| `--ds-gray-alpha-100` | `rgba(255,255,255,0.04)` | Subtle hover overlay |
| `--ds-gray-alpha-200` | `rgba(255,255,255,0.06)` | Button hover |
| `--ds-gray-alpha-400` | `rgba(255,255,255,0.12)` | Border color |
| `--ds-gray-alpha-600` | `rgba(255,255,255,0.24)` | Active border |

### Accent Colors

Geist uses minimal accent colors. Use them sparingly and only for specific semantic meaning:

| Color | Token / Tailwind Class | Usage |
|-------|----------------------|-------|
| **Blue (Brand)** | `text-blue-600` / `#0070f3` | Links, informational states |
| **Green (Success)** | `text-green-600` / `#10b981` | Success badges, "free" labels |
| **Red (Error)** | `text-red-600` / `#ee0000` | Errors, destructive actions |
| **Amber (Warning)** | `text-amber-500` / `#f5a623` | Warnings, cautions |
| **Purple (AI/Premium)** | `text-purple-600` / `#8b5cf6` | AI features only |

> ⚠️ Never use accent colors as backgrounds on large areas. Keep them to badges, icons, and inline text.

## Tailwind Mapping (Dark Mode)

```css
/* In globals.css – define under @layer base or @theme */
:root {
  --ds-background-100: #0a0a0a;
  --ds-background-200: #111111;
  --ds-gray-100:  #1a1a1a;
  --ds-gray-200:  #222222;
  --ds-gray-400:  #3a3a3a;
  --ds-gray-700:  #888888;
  --ds-gray-900:  #b0b0b0;
  --ds-gray-1000: #ededed;
  --ds-gray-alpha-400: rgba(255,255,255,0.12);
}
```

## Surface Hierarchy (Dark Mode)

```
#0a0a0a   ← Page / root canvas
  └─ #111111   ← Cards, panels, sidebars
       └─ #1a1a1a   ← Nested cards, inputs, hover targets
            └─ #222222   ← Active selections, code blocks
```

## Border Rules

- **Default border**: `border border-white/8` → `rgba(255,255,255,0.08)` (1px)
- **Hover border**: `border-white/15` 
- **Active / selected border**: `border-white/30` or `border-white`
- **Separator lines**: `border-t border-white/8` or `divide-y divide-white/8`

> ✅ Use 1px borders, never 2px borders (except focus rings)

## Focus Ring

```css
/* Standard Geist focus ring */
.focus-ring {
  outline: none;
  box-shadow: 0 0 0 2px var(--ds-background-100),
              0 0 0 4px var(--ds-gray-400);
}
```

In Tailwind: `focus-visible:ring-2 focus-visible:ring-white/30 focus-visible:ring-offset-2 focus-visible:ring-offset-black`

## What to Avoid

```
❌ bg-purple-900/50 with neon purple border
❌ from-blue-500 to-purple-600 gradient backgrounds  
❌ shadow-lg shadow-blue-500/30 glow effects
❌ backdrop-blur-xl bg-white/10 heavy glassmorphism
❌ orange-400, pink-500, or other saturated colors as primary UI colors
```
