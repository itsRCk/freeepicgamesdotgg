# Vercel Geist – Landing Pages & Marketing

> Reference: https://vercel.com, https://vercel.com/home

Landing pages in the Geist system are bold and editorial. They use **large typography, deliberate negative space, and restrained motion** to communicate confidence and clarity.

---

## Structural Layout

```
┌───────────────────────────────────────────┐
│  Fixed/Sticky Header (transparent → solid)│
├───────────────────────────────────────────┤
│                                           │
│  Hero Section (100vh or tall)             │
│  ── Eyebrow Tag                           │
│  ── H1 (48–72px, tracking-tight)          │
│  ── Subheadline (text-lg text-[#888])     │
│  ── CTA Buttons (primary + ghost)         │
│                                           │
├───────────────────────────────────────────┤
│  Social Proof / Trust Bar                 │
│  (logos, user counts)                     │
├───────────────────────────────────────────┤
│  Feature Sections (alternating)           │
├───────────────────────────────────────────┤
│  Pricing Section                          │
├───────────────────────────────────────────┤
│  Footer                                   │
└───────────────────────────────────────────┘
```

---

## Hero Section

```tsx
<section className="min-h-[85vh] flex flex-col items-center justify-center text-center px-4 py-24">
  {/* Eyebrow tag */}
  <div className="inline-flex items-center gap-2 px-3 py-1 mb-8 rounded-full border border-white/10 bg-white/5 text-xs font-medium text-[#888]">
    <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
    Now in production
  </div>

  {/* Headline */}
  <h1 className="max-w-3xl text-5xl md:text-7xl font-semibold tracking-[-0.04em] text-white leading-[1.05] mb-6">
    Deploy with confidence
  </h1>

  {/* Subheadline */}
  <p className="max-w-xl text-lg md:text-xl text-[#888] leading-relaxed mb-10">
    The platform for frontend developers. Build, deploy, and scale your apps with zero configuration.
  </p>

  {/* CTAs */}
  <div className="flex flex-wrap items-center justify-center gap-3">
    <a href="/signup" className="h-11 px-6 bg-white text-black text-sm font-medium rounded-md hover:bg-[#ebebeb] transition-colors inline-flex items-center">
      Start Deploying
    </a>
    <a href="/docs" className="h-11 px-6 bg-transparent border border-white/15 text-[#ededed] text-sm font-medium rounded-md hover:bg-white/5 transition-colors inline-flex items-center gap-2">
      Read the docs <ArrowRightIcon className="w-4 h-4" />
    </a>
  </div>
</section>
```

---

## Feature Section

Two-column alternating layout:

```tsx
<section className="max-w-7xl mx-auto px-4 md:px-8 py-24">
  <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
    {/* Text column */}
    <div>
      <p className="text-xs font-medium text-[#555] uppercase tracking-widest mb-4">Deployments</p>
      <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-white mb-4">
        Ship faster with every push
      </h2>
      <p className="text-base text-[#888] leading-relaxed mb-8">
        Every push to Git triggers a new deployment preview. Share it with your team before going live.
      </p>
      <ul className="space-y-3">
        {features.map(f => (
          <li key={f} className="flex items-center gap-3 text-sm text-[#888]">
            <CheckIcon className="w-4 h-4 text-green-400 flex-shrink-0" />
            {f}
          </li>
        ))}
      </ul>
    </div>
    {/* Visual column */}
    <div className="bg-[#111] border border-white/8 rounded-xl overflow-hidden aspect-video">
      {/* Product screenshot / demo */}
    </div>
  </div>
</section>
```

---

## Feature Grid (3-Column Cards)

```tsx
<section className="max-w-7xl mx-auto px-4 md:px-8 py-24">
  <div className="text-center mb-16">
    <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-white mb-3">
      Everything you need
    </h2>
    <p className="text-base text-[#888] max-w-xl mx-auto">
      One platform. All the primitives.
    </p>
  </div>

  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
    {features.map(feature => (
      <div key={feature.title} className="bg-[#111] border border-white/8 rounded-xl p-6">
        <div className="w-9 h-9 rounded-lg bg-white/5 border border-white/8 flex items-center justify-center mb-4">
          <feature.Icon className="w-4 h-4 text-[#888]" />
        </div>
        <h3 className="text-base font-semibold text-[#ededed] mb-2">{feature.title}</h3>
        <p className="text-sm text-[#555] leading-relaxed">{feature.description}</p>
      </div>
    ))}
  </div>
</section>
```

---

## Pricing Cards

```tsx
<div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-5xl mx-auto">
  {plans.map(plan => (
    <div
      key={plan.name}
      className={cn(
        "rounded-xl border p-8 flex flex-col",
        plan.featured
          ? "bg-white text-black border-white"
          : "bg-[#111] border-white/8 text-[#ededed]"
      )}
    >
      <p className="text-sm font-medium mb-1">{plan.name}</p>
      <div className="flex items-baseline gap-1 mb-6">
        <span className="text-4xl font-semibold font-mono tracking-tight">{plan.price}</span>
        <span className="text-sm text-[#555]">/mo</span>
      </div>
      <ul className="space-y-3 flex-1 mb-8">
        {plan.features.map(f => (
          <li key={f} className="flex items-center gap-2 text-sm">
            <CheckIcon className="w-4 h-4 flex-shrink-0" />
            {f}
          </li>
        ))}
      </ul>
      <a href={plan.href} className={cn(
        "h-10 px-4 rounded-md text-sm font-medium inline-flex items-center justify-center transition-colors",
        plan.featured
          ? "bg-black text-white hover:bg-[#111]"
          : "bg-white text-black hover:bg-[#ebebeb]"
      )}>
        {plan.cta}
      </a>
    </div>
  ))}
</div>
```

---

## Trust / Logo Bar

```tsx
<section className="border-t border-b border-white/8 py-12">
  <p className="text-center text-xs font-medium text-[#555] uppercase tracking-widest mb-8">
    Trusted by the world's best teams
  </p>
  <div className="flex flex-wrap items-center justify-center gap-10 opacity-40">
    {logos.map(logo => <img key={logo.name} src={logo.src} alt={logo.name} className="h-5 grayscale brightness-200" />)}
  </div>
</section>
```

> ✅ Logos should always be `grayscale` + `brightness-200` to blend with the dark background

---

## Footer

```tsx
<footer className="border-t border-white/8 py-12">
  <div className="max-w-7xl mx-auto px-4 md:px-8">
    <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
      <div className="col-span-2 md:col-span-1">
        <Logo />
      </div>
      {footerSections.map(section => (
        <div key={section.title}>
          <p className="text-xs font-semibold text-[#ededed] uppercase tracking-wider mb-3">{section.title}</p>
          <ul className="space-y-2">
            {section.links.map(link => (
              <li key={link.label}>
                <a href={link.href} className="text-sm text-[#555] hover:text-[#888] transition-colors">{link.label}</a>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
    <div className="border-t border-white/8 pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
      <p className="text-xs text-[#555]">© 2025 Acme Inc. All rights reserved.</p>
      <div className="flex items-center gap-4">
        <a href="/privacy" className="text-xs text-[#555] hover:text-[#888]">Privacy</a>
        <a href="/terms" className="text-xs text-[#555] hover:text-[#888]">Terms</a>
      </div>
    </div>
  </div>
</footer>
```

---

## What to Avoid

```
❌ Gradient hero backgrounds (aurora, mesh gradients, rainbow blobs)
❌ Multiple competing CTA buttons of the same visual weight
❌ Bright colored section backgrounds (use border + white/8 to separate)
❌ Centered text for feature sections — use alternating left-aligned columns
❌ Auto-playing video without mute controls
```
