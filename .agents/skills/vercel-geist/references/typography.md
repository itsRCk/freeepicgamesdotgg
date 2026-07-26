# Vercel Geist – Typography System

> Source: https://vercel.com/geist/typography

## Typefaces

Geist uses two custom variable fonts:

| Font | CSS Variable | Tailwind Class | Usage |
|------|-------------|----------------|-------|
| **Geist Sans** | `--font-geist-sans` | `font-sans` | All UI text, headings, body copy |
| **Geist Mono** | `--font-geist-mono` | `font-mono` | Code, prices, metrics, IDs, badges, timestamps |

### Loading in Next.js

```tsx
// app/layout.tsx
import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
```

> ⚠️ Always set `antialiased` on `<body>`. Geist fonts render best with subpixel antialiasing.

---

## Type Scale

Geist uses a modular type scale based on a 4px grid. All sizes are named semantically.

### Heading Scale

| Name | Size | Line Height | Weight | Tracking | Tailwind |
|------|------|-------------|--------|----------|---------|
| `heading-72` | 72px / 4.5rem | 1.05 | 600 | -2px | `text-7xl font-semibold tracking-[-0.04em]` |
| `heading-56` | 56px / 3.5rem | 1.1  | 600 | -1.5px | `text-5xl font-semibold tracking-[-0.03em]` |
| `heading-40` | 40px / 2.5rem | 1.2  | 600 | -1px | `text-4xl font-semibold tracking-tight` |
| `heading-32` | 32px / 2rem   | 1.25 | 600 | -0.8px | `text-3xl font-semibold tracking-tight` |
| `heading-24` | 24px / 1.5rem | 1.3  | 600 | -0.6px | `text-2xl font-semibold tracking-tight` |
| `heading-20` | 20px / 1.25rem| 1.4  | 600 | -0.4px | `text-xl font-semibold tracking-tight` |
| `heading-16` | 16px / 1rem   | 1.5  | 600 | -0.2px | `text-base font-semibold` |

### Body / Copy Scale

| Name | Size | Line Height | Weight | Tailwind |
|------|------|-------------|--------|---------|
| `copy-20` | 20px | 1.6 | 400 | `text-xl font-normal leading-relaxed` |
| `copy-16` | 16px | 1.6 | 400 | `text-base font-normal leading-relaxed` |
| `copy-14` | 14px | 1.6 | 400 | `text-sm font-normal leading-relaxed` |
| `copy-13` | 13px | 1.5 | 400 | `text-[13px] font-normal` |

### Label / UI Scale

| Name | Size | Weight | Tailwind |
|------|------|--------|---------|
| `label-16` | 16px | 500 | `text-base font-medium` |
| `label-14` | 14px | 500 | `text-sm font-medium` |
| `label-12` | 12px | 500 | `text-xs font-medium` |

### Mono / Code Scale

| Usage | Tailwind |
|-------|---------|
| Inline code | `font-mono text-sm bg-[#111] px-1 py-0.5 rounded` |
| Prices / Metrics | `font-mono text-base tabular-nums` |
| Badge labels | `font-mono text-xs` |
| Terminal output | `font-mono text-sm leading-relaxed` |

---

## Typography Rules

### Hierarchy

Use **weight and size** to communicate hierarchy — not color:

```
Page Title    → text-4xl font-semibold tracking-tight text-white
Section Title → text-xl font-semibold tracking-tight text-white  
Card Title    → text-base font-semibold text-[#ededed]
Body Copy     → text-sm font-normal text-[#888]
Caption       → text-xs font-normal text-[#555]
```

### Tracking (Letter Spacing)

Geist uses **negative tracking** on all headings for a crisp, dense look:

```
text-7xl → tracking-[-0.04em]
text-5xl → tracking-[-0.03em]
text-4xl → tracking-tight (tracking-[-0.025em])
text-3xl → tracking-tight
text-2xl → tracking-tight
text-xl  → tracking-tight
text-base → tracking-normal (default)
text-sm  → tracking-normal
```

> ✅ Never use `tracking-wide` or `tracking-wider` on Geist UIs

### Line Length

- **Body text**: max-width `65ch` (`max-w-prose`)
- **UI copy**: no max-width restriction
- **Hero text**: max-width `20ch` to `30ch` for visual impact

### Rendering Numbers

Always use `tabular-nums` for numeric data that may change (prices, counters, metrics):

```tsx
<span className="font-mono tabular-nums text-sm">$29.99</span>
<span className="font-mono tabular-nums text-2xl font-semibold">1,284</span>
```

---

## Code Blocks

```tsx
// Inline code
<code className="font-mono text-sm bg-[#1a1a1a] border border-white/8 px-1.5 py-0.5 rounded text-[#ededed]">
  npm install
</code>

// Block code
<pre className="font-mono text-sm bg-[#111] border border-white/8 rounded-lg p-4 overflow-x-auto leading-relaxed">
  <code>{code}</code>
</pre>
```

---

## What to Avoid

```
❌ font-bold (700) on large headings – use font-semibold (600)
❌ tracking-wide on any heading
❌ text-gray-400 for body text – too light for readability
❌ text-white for body copy – reserve for headings/primary labels
❌ mixing Geist and system fonts in the same UI region
```
