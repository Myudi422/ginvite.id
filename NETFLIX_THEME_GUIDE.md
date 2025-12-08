# Netflix Theme (Theme 2) - Integration Guide

## Overview
Theme 2 is a modern, dark-themed invitation design inspired by Netflix's visual aesthetic. It features a sophisticated card-based layout with smooth animations and a contemporary feel.

## Key Features

### Visual Design
- **Dark Theme**: Black background (#0f0f0f) with red accents (#e50914)
- **Card-Based Layout**: All sections use consistent card design
- **Netflix-Style Animations**: Smooth hover effects and transitions
- **Responsive Design**: Mobile-first approach with flexible grids
- **Modern Typography**: Bold headings with excellent contrast

### Components Structure
```
Theme 2 Components:
├── page.tsx                    # Main theme entry point
├── OpeningSection.tsx          # Netflix-style hero section
├── ProfileSection.tsx          # Couple profile cards
├── QuoteSection.tsx           # Quote with elegant styling
├── InvitationTextSection.tsx  # Invitation text card
├── FamilySection.tsx          # Family information cards
├── TurutSection.tsx           # Turut list with grid layout
├── CountdownSection.tsx       # Animated countdown timer
├── EventSection.tsx           # Event details cards
├── OurStorySection.tsx        # Timeline-style love story
├── GallerySection.tsx         # Netflix-style photo grid
├── videosection.tsx           # Video player with thumbnail
├── BankSection.tsx            # Bank transfer information
├── rsmpsection.tsx            # RSVP form with validation
├── ClosingSection.tsx         # Thank you section
├── FooterSection.tsx          # Simple footer
├── ImportantEventSection.tsx  # Important events timeline
└── animasi.tsx                # Animation utilities
```

## Usage

### 1. Import Theme Component
```tsx
import Theme2 from '@/components/theme/2/page';

// Use in your page
<Theme2 data={invitationData} />
```

### 2. Data Requirements
The theme uses the same data structure as Theme 1:

```typescript
interface InvitationData {
  theme: ThemeConfig;
  content: ContentData;
  decorations: DecorationData;
  event: EventData;
  category_type: CategoryType;
  status: string;
  content_user_id: string;
}
```

### 3. Theme Customization
The Netflix theme automatically applies its color scheme but respects the accent color from your theme configuration:

```typescript
// Theme colors are extended with Netflix-style palette
const netflixTheme = {
  ...originalTheme,
  backgroundColor: '#0f0f0f',
  accentColor: originalTheme.accentColor || '#e50914',
  textColor: '#ffffff',
  cardColor: '#1a1a1a',
  mutedText: '#b3b3b3'
};
```

## Responsive Design

### Breakpoints
- **Mobile**: < 768px - Single column layout
- **Tablet**: 768px - 1024px - 2-column grid where appropriate
- **Desktop**: > 1024px - Full multi-column layouts

### Grid Systems
```css
/* Gallery: 2-3-4 column responsive grid */
grid-cols-2 md:grid-cols-3 lg:grid-cols-4

/* Events: 1-2-3 column responsive grid */
grid-cols-1 md:grid-cols-2 lg:grid-cols-3

/* Family/Content: 1-2 column responsive grid */
grid-cols-1 md:grid-cols-2
```

## Animations

### Hover Effects
- **Cards**: Scale up to 105% on hover
- **Buttons**: Scale and color transitions
- **Images**: Scale up to 110% on hover

### Scroll Animations
- **Fade In**: Opacity 0 to 1 with y-axis movement
- **Stagger**: Sequential animation delays for lists
- **Scale**: Scale from 0.8 to 1.0

### Loading States
- **Spinner**: Rotating border animation
- **Skeleton**: Placeholder content while loading

## Accessibility Features

### Visual Accessibility
- High contrast ratios (white text on dark background)
- Clear visual hierarchy
- Consistent interactive element styling
- Focus states for keyboard navigation

### Interaction
- Touch-friendly button sizes (minimum 44px)
- Clear hover and focus indicators
- Semantic HTML structure
- Screen reader friendly

## Performance Optimizations

### Lazy Loading
- Gallery images load on scroll
- Heavy components (Video, Gallery) use dynamic imports
- Animation libraries loaded conditionally

### Image Optimization
- Next.js Image component for automatic optimization
- Responsive images with proper sizing
- Blur placeholders during loading

## Event Type Support

### Wedding Events
- Dual profile cards for bride and groom
- Family sections for both sides
- Romantic styling with heart icons

### Khitanan Events
- Single profile card
- Family section for child's family only
- Appropriate terminology and styling

### General Events
- Flexible layout adaptation
- Event type detection and theming
- Appropriate icon and text selection

## Common Patterns

### Card Design
```tsx
<div className="rounded-2xl p-8 backdrop-blur-sm border border-opacity-20">
  <Content />
</div>
```

### Section Headers
```tsx
<span className="px-6 py-3 rounded-full text-sm font-bold tracking-wider uppercase">
  Section Title
</span>
```

### Animation Wrapper
```tsx
<motion.div
  initial={{ opacity: 0, y: 50 }}
  whileInView={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.8 }}
  viewport={{ once: true }}
>
  <Content />
</motion.div>
```

## Troubleshooting

### Common Issues
1. **Hydration Mismatch**: Ensure client-side only components use `useState` for client detection
2. **Image Loading**: Verify all image URLs are accessible
3. **Font Loading**: Check font availability and fallbacks
4. **Animation Performance**: Reduce motion for users who prefer reduced motion

### Debug Tips
- Check browser console for errors
- Verify data structure matches expected format
- Test on different screen sizes
- Validate color contrast ratios

## Browser Support
- Modern browsers with CSS Grid support
- Fallbacks for older browsers where possible
- Progressive enhancement approach

This theme provides a modern, professional look suitable for contemporary digital invitations while maintaining full compatibility with the existing data structure and API.