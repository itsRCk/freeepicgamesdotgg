# Vercel Geist – Dashboard & App Pages

> Reference: Vercel Dashboard, Vercel Project Overview, Vercel Analytics

Dashboard pages are authenticated, utility-focused interfaces. Geist dashboards prioritise **information density, scanability, and rapid task completion** over visual decoration.

---

## Page Structure

```
┌─────────────────────────────────────────────┐
│  Fixed Top Navigation (h-16)                │
│  bg-[#0a0a0a] border-b border-white/8       │
├──────────────┬──────────────────────────────┤
│              │                              │
│  Sidebar     │  Main Content Area           │
│  w-60        │  flex-1 max-w-full           │
│  (optional)  │                              │
│              │                              │
└──────────────┴──────────────────────────────┘
```

### Top Navigation

```tsx
<header className="sticky top-0 z-50 h-16 border-b border-white/8 bg-[#0a0a0a]/90 backdrop-blur-sm">
  <div className="max-w-7xl mx-auto px-4 md:px-8 h-full flex items-center justify-between">
    {/* Logo + Nav Links */}
    <nav className="flex items-center gap-6">
      <Logo />
      <a href="/dashboard" className="text-sm font-medium text-[#888] hover:text-[#ededed] transition-colors">
        Overview
      </a>
    </nav>
    {/* Actions */}
    <div className="flex items-center gap-2">
      <UserAvatar />
    </div>
  </div>
</header>
```

### Sidebar (Optional)

```tsx
<aside className="w-60 flex-shrink-0 border-r border-white/8 bg-[#0a0a0a] h-full">
  <nav className="p-4 space-y-1">
    {navItems.map(item => (
      <a
        key={item.href}
        href={item.href}
        className={cn(
          "flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors",
          isActive
            ? "bg-white/8 text-white font-medium"
            : "text-[#888] hover:text-[#ededed] hover:bg-white/5"
        )}
      >
        <item.icon className="w-4 h-4 flex-shrink-0" />
        {item.label}
      </a>
    ))}
  </nav>
</aside>
```

---

## Page Header Pattern

Every dashboard page should begin with a consistent header:

```tsx
<div className="border-b border-white/8 px-6 py-8">
  <div className="max-w-7xl mx-auto">
    {/* Breadcrumb */}
    <div className="flex items-center gap-2 text-xs text-[#555] mb-4">
      <a href="/dashboard" className="hover:text-[#888]">Dashboard</a>
      <span>/</span>
      <span className="text-[#888]">Projects</span>
    </div>
    {/* Title + Actions */}
    <div className="flex items-start justify-between">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-white">Projects</h1>
        <p className="text-sm text-[#888] mt-1">Manage your deployments and environments.</p>
      </div>
      <button className="h-9 px-4 bg-white text-black text-sm font-medium rounded-md hover:bg-[#ebebeb] transition-colors">
        New Project
      </button>
    </div>
  </div>
</div>
```

---

## Stat / KPI Cards

Metrics should use `font-mono` for numbers and keep labels muted.

```tsx
<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
  {[
    { label: "Total Deployments", value: "1,284", delta: "+12%" },
    { label: "Avg Response Time", value: "48ms",  delta: "-5ms" },
  ].map(stat => (
    <div key={stat.label} className="bg-[#111] border border-white/8 rounded-xl p-5">
      <p className="text-xs font-medium text-[#555] uppercase tracking-wide mb-3">{stat.label}</p>
      <p className="text-3xl font-semibold font-mono text-white tracking-tight">{stat.value}</p>
      <p className="text-xs text-[#888] mt-1">{stat.delta} vs last 30d</p>
    </div>
  ))}
</div>
```

---

## Data Tables

Follow the component guide table pattern. Additional dashboard rules:

- **Sortable headers**: Show sort icon (`↑↓`) only on hover; active direction always visible
- **Row actions**: Reveal on row hover via `group/row` + `group-hover/row:opacity-100`
- **Empty state**: Never show an empty table body — show a placeholder card instead
- **Pagination**: Use cursor-based (`Previous` / `Next`) or simple page count

```tsx
{/* Row with reveal actions */}
<tr className="group/row border-b border-white/5 hover:bg-white/[0.02] transition-colors">
  <td className="px-4 py-3 text-sm text-[#ededed]">my-app</td>
  <td className="px-4 py-3">
    <span className="text-xs font-mono text-green-400">● Production</span>
  </td>
  <td className="px-4 py-3 text-sm text-[#555] font-mono">2h ago</td>
  {/* Hidden until row hover */}
  <td className="px-4 py-3 text-right opacity-0 group-hover/row:opacity-100 transition-opacity">
    <button className="text-xs text-[#888] hover:text-[#ededed]">View →</button>
  </td>
</tr>
```

---

## Empty States

```tsx
<div className="flex flex-col items-center justify-center py-20 text-center">
  <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-4">
    <FolderIcon className="w-5 h-5 text-[#555]" />
  </div>
  <h3 className="text-base font-semibold text-[#ededed] mb-1">No projects yet</h3>
  <p className="text-sm text-[#555] max-w-xs mb-6">
    Import a Git repository to deploy your first project.
  </p>
  <button className="h-9 px-4 bg-white text-black text-sm font-medium rounded-md hover:bg-[#ebebeb] transition-colors">
    New Project
  </button>
</div>
```

---

## Activity / Log Feed

```tsx
<div className="space-y-0 divide-y divide-white/5">
  {logs.map(log => (
    <div key={log.id} className="flex items-start gap-3 py-3 px-4 hover:bg-white/[0.02]">
      <div className="w-2 h-2 rounded-full bg-green-400 mt-1.5 flex-shrink-0" />
      <div className="flex-1 min-w-0">
        <p className="text-sm text-[#ededed] truncate">{log.message}</p>
        <p className="text-xs text-[#555] font-mono mt-0.5">{log.timestamp}</p>
      </div>
    </div>
  ))}
</div>
```

---

## Layout Spacings

| Region | Padding |
|--------|---------|
| Page horizontal padding | `px-4 md:px-8` |
| Page vertical padding | `py-8 md:py-12` |
| Card internal padding | `p-5` or `p-6` |
| Section gap | `gap-6` or `gap-8` |
| Form row gap | `gap-4` |
| Sidebar nav item gap | `gap-1` (between items) |

---

## What to Avoid

```
❌ Full-width cards that span the entire viewport on large screens (use max-w-7xl)
❌ Nested cards (card inside card) — use table rows or dividers instead
❌ Color-coded sidebar items (use active border/bg only)
❌ Sticky sidebars that obscure main content on mobile — hide on mobile
```
