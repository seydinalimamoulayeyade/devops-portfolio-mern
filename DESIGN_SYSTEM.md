# Design System - DevOps Portfolio MERN

## 🎨 Nouvelle palette de couleurs

### Couleurs principales
- **Primary** : Purple `#8b5cf6` (Violet pour les CTA principaux)
- **Secondary** : Cyan `#06b6d4` (Cyan pour les accents tech)
- **Accent** : Emerald `#10b981` (Success/Active states)
- **Pink** : `#ec4899` (Highlights/Hover)

### Backgrounds
- **Base** : `#0a0118` (Presque noir avec teinte purple)
- **Panel** : `rgba(10, 1, 24, 0.6)` (Glass effect)
- **Card** : `rgba(17, 24, 39, 0.8)` (Dark cards)

### Text
- **Primary** : `#ffffff` (White)
- **Secondary** : `#e2e8f0` (Light gray)
- **Muted** : `#94a3b8` (Gray)
- **Dim** : `#64748b` (Dimmed)

### Gradients
- **Hero** : `linear-gradient(135deg, #a78bfa 0%, #ec4899 50%, #06b6d4 100%)`
- **Card hover** : `linear-gradient(135deg, rgba(139, 92, 246, 0.1), rgba(6, 182, 212, 0.1))`
- **Glow** : `radial-gradient(ellipse, rgba(139, 92, 246, 0.3), transparent)`

## 🎭 Composants UI

### Buttons
**Primary Button**
- Background : `#8b5cf6`
- Hover : `#7c3aed`
- Shadow : `0 4px 14px rgba(139, 92, 246, 0.4)`

**Secondary Button**
- Border : `1px solid rgba(139, 92, 246, 0.3)`
- Hover : border `#8b5cf6`, bg `rgba(139, 92, 246, 0.1)`

### Cards
- Border : `rgba(139, 92, 246, 0.2)`
- Background : `rgba(10, 1, 24, 0.6)`
- Backdrop-filter : `blur(16px)`
- Shadow : `0 8px 32px rgba(139, 92, 246, 0.1)`
- Hover : translateY(-4px), shadow `0 12px 40px rgba(139, 92, 246, 0.2)`

### Badges
**Success**
- Background : `rgba(16, 185, 129, 0.1)`
- Border : `rgba(16, 185, 129, 0.3)`
- Text : `#10b981`

**Info**
- Background : `rgba(6, 182, 212, 0.1)`
- Border : `rgba(6, 182, 212, 0.3)`
- Text : `#06b6d4`

## ✨ Animations

### Float (cards)
```css
animation: float-gentle 6s ease-in-out infinite;
```

### Fade up (sections)
```css
animation: fade-up 0.6s ease-out forwards;
animation-delay: var(--delay, 0ms);
```

### Glow pulse (status indicators)
```css
animation: glow-pulse 2s ease-in-out infinite;
```

### Hover lift (interactive elements)
```css
transform: translateY(-4px);
transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
```

## 📐 Spacing

- **xs** : 0.5rem (8px)
- **sm** : 0.75rem (12px)
- **md** : 1rem (16px)
- **lg** : 1.5rem (24px)
- **xl** : 2rem (32px)
- **2xl** : 3rem (48px)
- **3xl** : 4rem (64px)

## 🔤 Typography

### Font Family
- **Headings** : Space Grotesk, sans-serif
- **Body** : Space Grotesk, Inter, system-ui

### Font Sizes
- **Hero** : 3rem (48px) → 4rem (64px) desktop
- **H2** : 2rem (32px) → 2.5rem (40px) desktop
- **H3** : 1.5rem (24px)
- **Body** : 1rem (16px)
- **Small** : 0.875rem (14px)
- **Tiny** : 0.75rem (12px)

### Font Weights
- Light : 300
- Regular : 400
- Medium : 500
- Semibold : 600
- Bold : 700

## 🎯 Micro-interactions

### Button Click
```css
active:scale-95
transition-transform: 150ms
```

### Card Hover
```css
hover:scale-102
hover:-translate-y-1
transition: 300ms cubic-bezier(0.4, 0, 0.2, 1)
```

### Tool Icon Hover
```css
hover:rotate-12
hover:scale-110
transition: 200ms
```

## 🌟 Effects

### Glass Panel
```css
backdrop-filter: blur(16px);
background: rgba(10, 1, 24, 0.6);
border: 1px solid rgba(139, 92, 246, 0.2);
```

### Gradient Text
```css
background: linear-gradient(135deg, #a78bfa, #ec4899, #06b6d4);
-webkit-background-clip: text;
-webkit-text-fill-color: transparent;
```

### Shadow Layers
- **Subtle** : `0 2px 8px rgba(0, 0, 0, 0.1)`
- **Medium** : `0 8px 32px rgba(139, 92, 246, 0.1)`
- **Heavy** : `0 20px 60px rgba(139, 92, 246, 0.3)`

## 📱 Responsive

### Breakpoints
- **sm** : 640px
- **md** : 768px
- **lg** : 1024px
- **xl** : 1280px
- **2xl** : 1536px

### Mobile-first approach
Tout est pensé mobile d'abord, puis adapté au desktop.

---

**Version** : 2.0  
**Date** : 12 Juin 2026  
**Theme** : Modern Glassmorphism DevOps
