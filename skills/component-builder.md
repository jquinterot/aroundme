---
name: component-builder
description: Create React components with Tailwind CSS, dark mode support, and data-testid attributes. Use for building UI components, forms, cards, and interactive elements.
---

This skill guides creation of React components for the AroundMe application. Follow these patterns for consistent, accessible, and testable UI components.

## Component Location

- `src/components/ui/` - Reusable UI primitives
- `src/components/layout/` - Header, Footer, Hero
- `src/components/events/` - Event-specific components
- `src/components/places/` - Place-specific components
- `src/components/activities/` - Activity-specific components
- `src/components/map/` - Map components
- `src/components/forms/` - Form components

## Component Pattern

```typescript
'use client'; // Only if interactive (useState, useEffect, onClick)

import { SomeIcon } from 'lucide-react';

interface ComponentNameProps {
  title: string;
  description?: string;
  onClick?: () => void;
  testId?: string;
}

export function ComponentName({ 
  title, 
  description, 
  onClick,
  testId 
}: ComponentNameProps) {
  return (
    <div 
      className="..." 
      data-testid={testId}
      onClick={onClick}
    >
      <h2>{title}</h2>
      {description && <p>{description}</p>}
    </div>
  );
}
```

## Dark Mode Pattern

Always include both light and dark variants:

```typescript
className="
  bg-white dark:bg-gray-800
  text-gray-900 dark:text-gray-100
  border-gray-200 dark:border-gray-700
  hover:bg-gray-50 dark:hover:bg-gray-700
"
```

### Common Dark Mode Classes
```
Background: bg-white dark:bg-gray-800
Text: text-gray-900 dark:text-gray-100
Secondary text: text-gray-500 dark:text-gray-400
Border: border-gray-200 dark:border-gray-700
Input: bg-white dark:bg-gray-700
Card: bg-white dark:bg-gray-800 shadow-sm
```

## Color Scheme Pattern

The app uses three color schemes:

### Events (Indigo)
```
Primary: bg-indigo-600, text-indigo-600
Light: bg-indigo-50 dark:bg-indigo-900/30
Border: border-indigo-500
Hover: hover:bg-indigo-700
```

### Places (Teal)
```
Primary: bg-teal-600, text-teal-600
Light: bg-teal-50 dark:bg-teal-900/30
Border: border-teal-500
Hover: hover:bg-teal-700
```

### Activities (Amber)
```
Primary: bg-amber-600, text-amber-600
Light: bg-amber-50 dark:bg-amber-900/30
Border: border-amber-500
Hover: hover:bg-amber-700
```

## Data Test ID Pattern

ALWAYS add data-testid for E2E testing:

### Page containers
```typescript
<div data-testid="page-name-page-container">
```

### Form elements
```typescript
<input data-testid="field-name-input" />
<select data-testid="field-name-select" />
<button data-testid="action-button" />
```

### Cards
```typescript
<div data-testid="event-card-{id}" />
<div data-testid="place-card-{id}" />
<div data-testid="activity-card-{id}" />
```

### Interactive elements
```typescript
<button data-testid="filter-category-music" />
<a data-testid="nav-events-link" />
<div data-testid="user-menu-dropdown" />
```

## Icon Pattern

Use Lucide React icons:

```typescript
import { Calendar, MapPin, Clock, Users, Heart, Share } from 'lucide-react';

// Consistent sizing
<Icon className="w-4 h-4" />  // Small (inline)
<Icon className="w-5 h-5" />  // Medium (default)
<Icon className="w-6 h-6" />  // Large (headers)
```

## Spacing Pattern

```typescript
// Section spacing
className="space-y-6"  // Between form sections
className="space-y-4"  // Between related items
className="gap-4"      // Grid/flex gaps

// Padding
className="p-4"   // Card padding
className="p-6"   // Section padding
className="px-4 py-2.5"  // Button padding
className="px-4 py-3"    // Input padding
```

## Animation Pattern

```typescript
// Transitions
className="transition-colors"  // Color changes
className="transition-all"     // All properties
className="transition-transform" // Transform only

// Hover effects
className="hover:scale-105 transition-transform"
className="hover:shadow-lg transition-shadow"

// Loading spinner
<Loader2 className="w-5 h-5 animate-spin" />
```

## Card Component Pattern

```typescript
<div className="
  bg-white dark:bg-gray-800
  rounded-xl shadow-sm
  border border-gray-200 dark:border-gray-700
  overflow-hidden
  hover:shadow-md transition-shadow
">
  {/* Image */}
  <div className="relative h-48 bg-gray-200 dark:bg-gray-700">
    {imageUrl && <Image src={imageUrl} alt={title} fill className="object-cover" />}
  </div>
  
  {/* Content */}
  <div className="p-4">
    <h3 className="font-semibold text-gray-900 dark:text-gray-100">{title}</h3>
    <p className="text-sm text-gray-500 dark:text-gray-400">{description}</p>
  </div>
</div>
```

## Form Input Pattern

```typescript
<div>
  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
    Label {required && <span className="text-red-500">*</span>}
  </label>
  {helperText && (
    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">{helperText}</p>
  )}
  <input
    type="text"
    className="
      w-full px-4 py-2.5
      border border-gray-300 dark:border-gray-600
      rounded-lg
      bg-white dark:bg-gray-800
      text-gray-900 dark:text-gray-100
      focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500
    "
    data-testid="field-input"
  />
</div>
```

## Barrel Export Pattern

Each component folder has an `index.ts`:

```typescript
// src/components/events/index.ts
export { EventCard } from './EventCard';
export { EventFilters } from './EventFilters';
export { EventDetailHeader } from './EventDetailHeader';
```

## Checklist for New Components

- [ ] Has `'use client'` directive only if interactive
- [ ] Has TypeScript interface for props
- [ ] Includes dark mode styles
- [ ] Has data-testid attribute
- [ ] Uses Lucide icons
- [ ] Follows color scheme (indigo/teal/amber)
- [ ] Has proper spacing (space-y, gap, p)
- [ ] Exported from index.ts barrel
- [ ] Responsive (mobile-first)
- [ ] Accessible (proper labels, roles)
