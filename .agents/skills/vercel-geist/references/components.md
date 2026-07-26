# Vercel Geist – UI Components

> Source: https://vercel.com/geist/components

All Geist components share three principles:
1. **Minimal chrome** – the component itself is nearly invisible until interacted with
2. **Consistent sizing** – everything snaps to the 4px grid with fixed height tokens
3. **Keyboard first** – every component must be fully operable without a mouse

---

## Sizing Tokens

| Token | Height | Font Size | Padding (H) | Usage |
|-------|--------|-----------|-------------|-------|
| `small` | `h-7` (28px) | `text-xs` | `px-2.5` | Compact tags, dense UIs |
| `medium` | `h-9` (36px) | `text-sm` | `px-3` | **Default for most UI** |
| `large` | `h-10` (40px) | `text-sm` | `px-4` | Primary CTAs, prominent inputs |

---

## Button

### Primary Button
High-contrast white fill for the single most important action on a page.

```tsx
<button className="
  inline-flex items-center justify-center gap-2
  h-9 px-4 rounded-md
  bg-white text-black text-sm font-medium
  hover:bg-[#ebebeb] active:bg-[#d0d0d0]
  transition-colors duration-150
  focus-visible:outline-none
  focus-visible:ring-2 focus-visible:ring-white/30 focus-visible:ring-offset-2 focus-visible:ring-offset-black
  disabled:opacity-50 disabled:cursor-not-allowed
">
  Get Started
</button>
```

### Secondary Button
Ghost style with a subtle border.

```tsx
<button className="
  inline-flex items-center justify-center gap-2
  h-9 px-4 rounded-md
  bg-transparent border border-white/15 text-[#ededed] text-sm font-medium
  hover:bg-white/5 hover:border-white/25
  transition-colors duration-150
  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30 focus-visible:ring-offset-2 focus-visible:ring-offset-black
">
  Learn More
</button>
```

### Destructive Button
```tsx
<button className="
  inline-flex items-center justify-center gap-2
  h-9 px-4 rounded-md
  bg-red-600/10 border border-red-600/20 text-red-400 text-sm font-medium
  hover:bg-red-600/15 hover:border-red-600/30
  transition-colors duration-150
">
  Delete
</button>
```

### Icon Button
```tsx
<button className="
  inline-flex items-center justify-center
  h-9 w-9 rounded-md
  bg-transparent border border-white/10 text-[#888]
  hover:bg-white/5 hover:text-[#ededed]
  transition-colors duration-150
" aria-label="Settings">
  <SettingsIcon className="w-4 h-4" />
</button>
```

---

## Input / Text Field

```tsx
<input
  type="text"
  placeholder="Search..."
  className="
    h-9 w-full px-3 rounded-md
    bg-[#111] border border-white/10 text-[#ededed] text-sm
    placeholder:text-[#555]
    hover:border-white/20
    focus:outline-none focus:border-white/30 focus:ring-1 focus:ring-white/20
    transition-colors duration-150
    disabled:opacity-50 disabled:cursor-not-allowed
  "
/>
```

---

## Badge / Tag

```tsx
// Neutral badge
<span className="
  inline-flex items-center gap-1
  px-2 py-0.5 rounded-md
  bg-white/5 border border-white/10
  text-xs font-medium font-mono text-[#888]
">
  v1.0.0
</span>

// Status badges
const variants = {
  success: "bg-green-500/10 border-green-500/20 text-green-400",
  warning: "bg-amber-500/10 border-amber-500/20 text-amber-400",
  error:   "bg-red-500/10   border-red-500/20   text-red-400",
  info:    "bg-blue-500/10  border-blue-500/20  text-blue-400",
  neutral: "bg-white/5      border-white/10     text-[#888]",
}
```

---

## Card

```tsx
<div className="
  bg-[#111] border border-white/8 rounded-xl
  p-6
  hover:border-white/15
  transition-colors duration-200
">
  {/* Card content */}
</div>
```

### Clickable Card
```tsx
<a href="#" className="
  block bg-[#111] border border-white/8 rounded-xl p-6
  hover:border-white/15 hover:bg-[#161616]
  transition-colors duration-200
  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30
  group
">
  <p className="text-sm font-semibold text-[#ededed] group-hover:text-white transition-colors">
    Card Title
  </p>
</a>
```

---

## Separator / Divider

```tsx
// Horizontal
<hr className="border-none border-t border-white/8 my-6" />

// With text
<div className="flex items-center gap-4">
  <div className="flex-1 h-px bg-white/8" />
  <span className="text-xs text-[#555]">or</span>
  <div className="flex-1 h-px bg-white/8" />
</div>
```

---

## Select / Dropdown Trigger

```tsx
<button className="
  inline-flex items-center justify-between gap-2
  h-9 px-3 rounded-md w-full
  bg-[#111] border border-white/10 text-sm text-[#ededed]
  hover:border-white/20
  focus:outline-none focus:border-white/30
  transition-colors duration-150
">
  <span>Select option</span>
  <ChevronDownIcon className="w-4 h-4 text-[#555]" />
</button>
```

---

## Table

```tsx
<div className="border border-white/8 rounded-xl overflow-hidden">
  <table className="w-full text-sm">
    <thead>
      <tr className="border-b border-white/8 bg-[#0f0f0f]">
        <th className="text-left px-4 py-3 text-xs font-medium text-[#555] uppercase tracking-wide">
          Name
        </th>
      </tr>
    </thead>
    <tbody className="divide-y divide-white/5">
      <tr className="hover:bg-white/[0.02] transition-colors">
        <td className="px-4 py-3 text-[#ededed]">Row content</td>
      </tr>
    </tbody>
  </table>
</div>
```

---

## Toast / Notification

```tsx
<div className="
  flex items-start gap-3
  bg-[#111] border border-white/10 rounded-lg shadow-lg
  px-4 py-3 max-w-sm
">
  <CheckCircleIcon className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
  <div>
    <p className="text-sm font-medium text-[#ededed]">Saved successfully</p>
    <p className="text-xs text-[#555] mt-0.5">Your changes have been saved.</p>
  </div>
</div>
```

---

## Skeleton Loader

```tsx
<div className="animate-pulse space-y-3">
  <div className="h-4 bg-white/5 rounded w-3/4" />
  <div className="h-4 bg-white/5 rounded w-1/2" />
  <div className="h-4 bg-white/5 rounded w-5/6" />
</div>
```

---

## What to Avoid

```
❌ rounded-full on rectangular buttons (use rounded-md)
❌ shadow-lg or shadow-2xl on cards (use border instead)
❌ bg-blue-600 for primary buttons (use bg-white text-black)
❌ text-base or larger inside badges (use text-xs)
❌ px-8 or larger padding on h-9 buttons (use px-4 max)
```
