# AGENTS.md — Mini App Design & Development Guide

> This file is the primary reference for design rules, development conventions, and Agent behavior in this project. Read it fully before making any changes.

---

## 1. General Design Principles

### 1.1 Responsiveness
- All elements must be responsive.
- The mini app must adapt to different device sizes (mobile, tablet, laptop).
- Users must be able to view the entire mini app comfortably, regardless of screen size.

### 1.2 Mobile-First Approach
- Design and develop for the smallest screen first (mobile).
- Then scale up for larger screens (tablet, web, etc.).
- Never work desktop-first.

### 1.3 Breakpoints
| Name | Min width | Tailwind prefix |
|------|-----------|-----------------|
| Mobile | < 640px | (default) |
| Small tablet | ≥ 640px | `sm:` |
| Tablet | ≥ 768px | `md:` |
| Laptop | ≥ 1024px | `lg:` |
| Large desktop | ≥ 1280px | `xl:` |

---

## 2. Color & Theme

### 2.1 Dark & Light Theme
- Respect the user's device theme (dark/light) when choosing colors.
- Theme is managed via the `dark` class on `<html>`.
- Support `prefers-color-scheme` and `prefers-reduced-motion`.

### 2.2 Semantic Tokens (Mandatory)
- Use only semantic tokens:
  - `bg-background`, `text-foreground`
  - `bg-primary`, `text-primary-foreground`
  - `bg-muted`, `text-muted-foreground`
  - `bg-card`, `border-border`, `ring-ring`
- ❌ Hardcoded colors (e.g. `#fff`, `bg-white`, `text-black`) are forbidden.
- ❌ `!important` is forbidden.

---

## 3. Animation & Performance

### 3.1 Animation Rules
- Animations must be smooth and ideally run at 60 FPS.
- Only animate `transform` and `opacity` (GPU-accelerated).
- ❌ Animating `width`, `height`, `top`, `left`, `margin` is forbidden.
- Animation duration: 150–300ms (max 400ms).
- Recommended easing: `ease-out` or `cubic-bezier(0.4, 0, 0.2, 1)`.

### 3.2 Low-Performance Devices
- Minimize animations and visual effects on low-performance devices.
- Reduce heavy `blur`, `backdrop-filter`, and `box-shadow` on mobile.
- Use `will-change` only when truly needed.
- Disable animations under `prefers-reduced-motion: reduce`.

### 3.3 Images & Assets
- Images: lazy-load + WebP/AVIF format + `srcset`.
- Use heavy animation libraries (e.g. GSAP) only when absolutely necessary.

---

## 4. UX & Accessibility Rules

### 4.1 Touch Area & Sizing
- Minimum font size: `14px` on mobile.
- Input font size: at least `16px` (to prevent auto-zoom on iOS).
- Minimum tap target: `44×44px`.
- Minimum spacing between interactive elements: `8px`.

### 4.2 Accessibility
- Every icon-only button must have an `aria-label`.
- Keyboard focus must be available on all interactive elements.
- Color contrast: at least WCAG AA (4.5:1 ratio for text).
- Use `env(safe-area-inset-*)` to respect iOS Safe Area.

### 4.3 Back Button
- Every inner page must include a "Back" button.
- Use `history.back()` or `router.back()`.
- If possible, manage the native back button via the platform SDK.

---

## 5. Platform Constraints (Bale / Telegram Mini App)

- Mini app button width in the Bale input bar on Android: **max 20 characters**.
- Account for the mini app header height in viewport calculations.
- Use `100dvh` instead of `100vh`.
- Read the app theme via the SDK (`themeParams`).
- Interact through the mini app SDK, not the browser API alone.

---

## 6. Project Structure & Code Rules

### 6.1 Structure
- UI components: `@/components/ui`
- App components: `@/components`
- Pages: `@/app`

### 6.2 Rules
- Use `cn()` for merging `className`.
- TypeScript strict mode.
- Use named exports, not default (except for pages).
- One component per file.
- Avoid inline styles; use Tailwind or CSS variables only.
- Before creating a new component, check `@/components/ui` first.

---

## 7. Don'ts

- ❌ Don't hardcode colors.
- ❌ Don't use `!important`.
- ❌ Don't create animations longer than 400ms.
- ❌ Don't break layout with `position: fixed`.
- ❌ Don't use new UI libraries without permission.
- ❌ Don't build an inner page without a back button.
- ❌ Don't work desktop-first.
- ❌ Don't animate layout properties.
- ❌ Don't use inline styles or raw hex colors.
- ❌ Don't use `100vh` (use `100dvh` instead).

---

## 8. Concrete Examples

### 8.1 Creating a New Page
✅ **Correct:**
- Write mobile-first, then add `sm: md: lg:`.
- Use `<Button variant="default">` from shadcn components.
- Place a back button at the top of the page.
- Use `bg-background text-foreground`.

❌ **Wrong:**
- Writing desktop-first.
- `<button className="bg-blue-500 text-white">`
- No back button.
- Using `100vh` instead of `100dvh`.

### 8.2 Animation
✅ **Correct:**
```css
transition: transform 200ms ease-out, opacity 200ms ease-out;