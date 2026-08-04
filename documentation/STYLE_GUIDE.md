# CFN Kurties — Style Guide

## Personality

Elegant · Calm · Premium  
Tone: Confident · Friendly · Professional

## Color

| Token | Hex | Use |
|-------|-----|-----|
| Black | `#0A0A0A` | Primary text, CTAs, footer |
| White | `#FFFFFF` | Backgrounds |
| Off-white | `#FAFAF8` | Soft sections |
| Cream | `#F7F5F0` | Cards, forms, media fallbacks |
| Gold | `#C4A35A` | **Subtle** accent only (eyebrows, stars, badges) |
| Gray scale | `#F0EFEC` → `#1F1E1C` | Borders, muted text |
| Error | `#B33A3A` | Validation |
| Success | `#2D6A4F` | In stock / free shipping |

Avoid bright colors, heavy gradients, and loud effects.

## Typography

| Role | Family | Notes |
|------|--------|-------|
| Headings | **Manrope** | Large, tracking-tight, semibold |
| Body | **Inter** | Comfortable reading, 14–16px |

Utilities: `font-heading`, default `font-sans`.

## Spacing & layout

- Max content width: `max-w-7xl` (`Container`)
- Section vertical rhythm: `py-20 md:py-28`
- Generous white space; avoid clutter

## Components

- **Buttons:** primary (black), outline, gold (hero), ghost
- **Product cards:** 4:5 image, name, fabric, price
- **Motion:** Framer Motion fade/slide only; respect `prefers-reduced-motion`
- **Icons:** Lucide, stroke 1.5

## Do / Don't

**Do:** simplicity, editorial photography, clear CTAs, strong contrast  
**Don't:** excessive animation, random gradients, gimmicks, visual noise

## Accessibility

- Semantic HTML + landmarks
- Focus rings (gold)
- Skip link
- ARIA on dialogs, radiogroups, live regions
- Keyboard: Escape closes menu/search/cart
