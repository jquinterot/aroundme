# Icon Library Comparison for AroundMe

## Current State
Using emojis for categories (e.g., 🎵 for music, 🍔 for food)

## Icon Libraries Comparison

### 1. Lucide React ⭐ (Recommended)
- **Icons:** 1500+
- **Style:** Clean, outlined, modern
- **Size:** ~60kb
- **Tree-shaking:** Yes
- **Popularity:** Very popular (used by Vercel, Linear)
- **License:** MIT
- **Example icons:**
  - Music → `Music`
  - Food → `UtensilsCrossed`
  - Sports → `Trophy`
  - Art → `Palette`
  - Tech → `Laptop`
  - Community → `Users`
  - Nightlife → `Moon`
  - Outdoor → `TreePine`
  - Education → `GraduationCap`
  - Restaurant → `UtensilsCrossed`
  - Cafe → `Coffee`
  - Bar → `Wine`
  - Club → `PartyPopper`
  - Park → `TreePine`
  - Museum → `Landmark`
  - Shopping → `ShoppingBag`
  - Hotel → `Bed`
  - Coworking → `Briefcase`

### 2. Heroicons
- **Icons:** 290+
- **Style:** Outline & solid, clean
- **Size:** ~30kb
- **Tree-shaking:** Yes
- **Popularity:** Popular (Tailwind CSS)
- **License:** MIT
- **Example icons:**
  - Music → `MusicalNoteIcon`
  - Food → `CakeIcon`
  - Sports → `TrophyIcon`
  - Art → `PaintBrushIcon`

### 3. Phosphor Icons
- **Icons:** 6000+
- **Style:** Duotone, fill, thin variants
- **Size:** ~150kb (all variants)
- **Tree-shaking:** Yes
- **Popularity:** Growing
- **License:** MIT
- **Note:** Most complete, many style variants

### 4. Feather Icons
- **Icons:** 280+
- **Style:** Minimal, outlined
- **Size:** ~25kb
- **Tree-shaking:** Yes
- **Popularity:** Declining
- **License:** MIT
- **Note:** Simple but limited

### 5. Tabler Icons
- **Icons:** 4700+
- **Style:** Clean, consistent stroke
- **Size:** ~100kb
- **Tree-shaking:** Yes
- **Popularity:** Growing
- **License:** MIT

## Recommendation

**Winner: Lucide React**

Reasons:
1. Clean, modern aesthetic
2. Used by top companies (Vercel, Linear)
3. Good size with tree-shaking
4. Consistent stroke width
5. Easy to use with Tailwind
6. Active maintenance

## Installation
```bash
npm install lucide-react
```

## Usage Example
```tsx
import { Music, Utensils, Trophy } from 'lucide-react';

// With className for sizing and color
<Music className="w-5 h-5 text-purple-600" />

// With custom props
<Utensils className="w-4 h-4" strokeWidth={1.5} />
```

## Migration Plan
1. Backup current emojis ✅
2. Install lucide-react
3. Create icon mapping constants
4. Update components to use icon components
5. Test and verify visual appearance
