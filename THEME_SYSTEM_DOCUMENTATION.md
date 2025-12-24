# Global Theme Management System

## Overview
Sistem manajemen tema global untuk aplikasi undangan digital yang memungkinkan penggunaan multiple theme dengan data structure yang konsisten.

## Architecture

### 1. Global Data Types (`/lib/theme-data.ts`)
Berisi interface dan helper functions yang digunakan oleh semua tema:
- `ThemeData` - Interface utama untuk data undangan
- `EventData` & `ThemeEvent` - Interface untuk event management
- Helper functions: `processFont()`, `getFirstEvent()`, `createCalendarUrl()`
- Default configurations untuk theme dan content

### 2. Theme Structure
```
components/theme/
├── 1/                    # Theme 1 (Original elegant theme)
│   ├── page.tsx         # Main theme component
│   ├── OpeningSection.tsx
│   ├── ProfileSection.tsx
│   ├── EventSection.tsx
│   └── ... (other sections)
├── 3/                    # Theme 3 (Netflix style theme)
│   ├── page.tsx         # Main theme component
│   ├── NetflixComponents.tsx
│   ├── NetflixStyleImage.tsx
│   ├── animations.tsx
│   └── README.md
└── ThemeWrapper.tsx     # Theme router/selector
```

### 3. Global Data Interface
```typescript
interface ThemeData {
  status: string;                    // Payment status
  content_user_id: number;          // Unique content ID
  theme: {                          // Theme configuration
    defaultBgImage1: string;
    accentColor: string;
    textColor: string;
    background: string;
  };
  content: {                        // Content data
    plugin: { /* navbar, rsvp, etc */ };
    opening: { /* title, labels, etc */ };
    children: Array<{ /* bride/groom data */ }>;
    parents: { /* family data */ };
    gallery: { /* images */ };
    // ... other content fields
  };
  event: {                          // Event information
    [key: string]: {
      title?: string;
      date: string;
      time: string;
      location: string;
      mapsLink: string;
    };
  };
  category_type: {                  // Event category
    id: number;
    name: string;
  };
}
```

## Helper Functions

### Font Processing
```typescript
const processedFont = processFont(content?.font?.special);
// Converts "font-family: 'Playfair Display', serif;" → "Playfair Display, serif"
```

### Event Management
```typescript
const firstEvent = getFirstEvent(data.event);
// Returns the earliest event from the events object

const calendarUrl = createCalendarUrl(firstEvent, allEvents, nickname, category_type);
// Generates Google Calendar URL for the event
```

## Creating New Themes

### Step 1: Create Theme Folder
```bash
mkdir components/theme/[number]
cd components/theme/[number]
```

### Step 2: Main Component Structure
```typescript
// page.tsx
"use client";

import { ThemeData } from "@/lib/theme-data";

interface Theme[Number]Props {
  data: ThemeData;
}

export default function Theme[Number]({ data }: Theme[Number]Props) {
  // Use global data structure
  const { theme, content, event, category_type } = data;
  
  // Theme-specific logic here
  
  return (
    // Theme JSX
  );
}
```

### Step 3: Use Global Helpers
```typescript
import { processFont, getFirstEvent, createCalendarUrl } from "@/lib/theme-data";

// Inside component
const specialFont = processFont(content.font?.special);
const firstEvent = getFirstEvent(event);
const calendarUrl = createCalendarUrl(firstEvent, sortedEvents, nickname, category_type);
```

### Step 4: Add to Theme Router
```typescript
// In ThemeWrapper.tsx
case '[number]':
  return <Theme[Number] data={data} />;
```

## Benefits

### 1. Consistency
- Semua theme menggunakan data structure yang sama
- Helper functions yang konsisten across themes
- Standardized props interface

### 2. Maintainability
- Central data management
- Reusable helper functions
- Easy to add new themes without changing existing code

### 3. Performance
- Shared utilities reduce bundle size
- Optimized data processing
- Lazy loading support per theme

### 4. Type Safety
- TypeScript interfaces untuk semua data
- Compile-time error checking
- Better IDE support

## Theme Comparison

| Feature | Theme 1 | Theme 3 |
|---------|---------|---------|
| Style | Elegant/Classic | Netflix/Modern |
| Layout | Multi-section | Netflix-like |
| Performance | Medium | Lightweight |
| Interactivity | High | Medium |
| Mobile Optimization | Responsive | Mobile-first |
| Use Case | Traditional weddings | Modern/Young audience |

## Integration Examples

### Adding Payment Banner (All Themes)
```typescript
{data.status === "tidak" && (
  <div className="fixed top-0 left-0 w-full bg-yellow-300 text-yellow-900 py-1 z-50">
    <PaymentButton onPayment={handlePayment} loading={paymentLoading} />
  </div>
)}
```

### Event Type Detection (All Themes)
```typescript
const isKhitan = (category_type?.name || '').toLowerCase().includes('khitan');
const isWedding = !!content.parents?.groom;

// Conditional rendering based on event type
{isKhitan ? 'Khitanan Content' : 'Wedding Content'}
```

### Font Integration (All Themes)
```typescript
const fonts = {
  special: processFont(content.font?.special),
  body: processFont(content.font?.body),
  heading: processFont(content.font?.heading),
};

<div style={{ fontFamily: fonts.special }}>Special Text</div>
```

## Best Practices

### 1. Data Access
- Always destructure from main data object
- Use helper functions for common operations
- Check for data existence before accessing nested properties

### 2. Performance
- Use lazy loading for heavy components
- Optimize images with Next.js Image component
- Minimize re-renders with proper state management

### 3. Responsiveness
- Follow mobile-first approach
- Use consistent breakpoints across themes
- Test on multiple device sizes

### 4. Accessibility
- Include proper alt texts for images
- Use semantic HTML elements
- Ensure proper color contrast

## Future Enhancements

1. **Theme Marketplace**: Easy installation of new themes
2. **Theme Customizer**: UI for theme configuration
3. **A/B Testing**: Compare theme performance
4. **Template System**: Generate themes from templates
5. **Plugin System**: Modular feature additions