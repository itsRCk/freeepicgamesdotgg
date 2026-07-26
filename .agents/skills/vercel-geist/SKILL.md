---
name: vercel-geist
description: Strictly enforce the Vercel Geist Design System (https://vercel.com/geist) for all web interfaces, components, layouts, and styling in Next.js and Tailwind CSS. Use whenever designing, modifying, or refactoring UI components, pages, or layouts.
---

# Vercel Geist Design System – Master Skill

> Reference: https://vercel.com/geist/introduction

Geist is Vercel's internal design system used to build all Vercel and Next.js products. It prioritises **clarity, precision, and minimal visual noise**. Every design decision should feel intentional and systematic.

## Overview

When this skill is active:
1. Always read the relevant reference file before implementing any component
2. Apply design tokens from `colors.md` for all color decisions
3. Apply type scales from `typography.md` for all text elements
4. Follow component patterns from `components.md` for all UI primitives
5. Follow `dashboard.md` for authenticated app pages
6. Follow `landing-pages.md` for marketing/hero pages
7. Follow `accessibility.md` for all interactive elements
8. Follow `animations.md` for all transitions and motion

## Core Philosophy

- **Systematic over ad-hoc**: Use CSS custom properties (`--ds-*`) and the Tailwind token layer — never arbitrary values
- **Monochromatic base**: The entire gray scale (`--ds-gray-100` → `--ds-gray-1000`) is the primary palette
- **Typography-driven hierarchy**: Text weight and size communicate importance, not color
- **Precision borders**: 1px subpixel borders (`border-white/8` in dark) instead of shadows to separate surfaces
- **Accessible by default**: Every interactive element must meet WCAG AA contrast ratios

## Reference Files in This Skill

| File | When to Read |
|------|-------------|
| `references/colors.md` | Any color, background, or border decision |
| `references/typography.md` | Any text, heading, or font decision |
| `references/components.md` | Building any UI primitive (buttons, inputs, badges, cards) |
| `references/dashboard.md` | Building authenticated app/dashboard pages |
| `references/landing-pages.md` | Building marketing, hero, or public pages |
| `references/accessibility.md` | Adding interactive elements, focus states, or ARIA |
| `references/animations.md` | Adding any transition, animation, or motion |

## Quick Rules (Always Apply)

```
✅ DO:
- Use Geist Sans for all UI text
- Use Geist Mono for code, prices, IDs, metrics
- Use bg-[#0a0a0a] for page root (dark mode)
- Use bg-[#111] for card surfaces
- Use border border-white/8 for card borders
- Use text-white font-semibold tracking-tight for headings
- Use text-[#888] for secondary/muted text
- Use bg-white text-black for primary CTA buttons
- Use h-9 or h-10 for button heights

❌ DON'T:
- Use Bootstrap or Material UI classes
- Apply neon/colorful shadows (shadow-purple-500/50)
- Use gradient borders or glow effects
- Use text-blue-500 or text-green-500 as primary colors
- Use backdrop-blur with high opacity for glassmorphism
- Use arbitrary padding values not on the 4px grid
```
