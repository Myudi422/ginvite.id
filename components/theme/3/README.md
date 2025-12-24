# Theme 3 - Netflix Style Wedding Invitation

## Overview
Theme 3 adalah tema undangan digital dengan gaya Netflix yang modern dan elegan. Theme ini dirancang untuk memberikan pengalaman viewing yang unik seperti menonton trailer film di Netflix, namun untuk undangan pernikahan atau khitanan.

## Features
- 🎬 **Netflix-style interface** - Mirip dengan tampilan Netflix original
- 📱 **Mobile-first design** - Responsive dan optimal untuk smartphone
- 🎨 **Dark theme** - Background hitam dengan aksen merah khas Netflix
- 🖼️ **Image optimization** - Menggunakan Next.js Image component untuk performa optimal
- 💳 **Payment integration** - Terintegrasi dengan sistem pembayaran Midtrans
- 📊 **View tracking** - Mencatat viewer engagement
- 🎵 **Media support** - Mendukung background music dan video
- ⚡ **Lightweight** - HTML-based structure untuk performa cepat

## File Structure
```
theme/3/
├── page.tsx                  # Main theme component
├── NetflixComponents.tsx     # Reusable Netflix-style components
├── NetflixStyleImage.tsx     # Optimized image component
├── animations.tsx            # CSS animation helpers
└── README.md                # Documentation
```

## Components

### Main Components
- `Theme3` - Main theme wrapper component
- `NetflixContainer` - Main layout container with max-width constraint
- `NetflixSection` - Section wrapper with consistent spacing
- `NetflixHeader` - Netflix-style headers with different sizes
- `NetflixText` - Typography component with variants
- `NetflixBadge` - Badge component for tags and labels
- `NetflixStyleImage` - Optimized image component with aspect ratios

### Component Usage

#### NetflixHeader
```tsx
<NetflixHeader size="xl">Main Title</NetflixHeader>
<NetflixHeader size="lg">Section Title</NetflixHeader>
<NetflixHeader size="md">Subsection</NetflixHeader>
```

#### NetflixText
```tsx
<NetflixText>Regular text content</NetflixText>
<NetflixText variant="caption" color="gray">Small gray text</NetflixText>
<NetflixText variant="meta" color="green">Meta information</NetflixText>
```

#### NetflixBadge
```tsx
<NetflixBadge variant="primary">Coming Soon</NetflixBadge>
<NetflixBadge variant="secondary">#romantic</NetflixBadge>
<NetflixBadge variant="success">Active</NetflixBadge>
```

#### NetflixStyleImage
```tsx
<NetflixStyleImage 
  src="/image.jpg" 
  alt="Description"
  aspectRatio="video"
  className="custom-class"
>
  <div>Optional overlay content</div>
</NetflixStyleImage>
```

## Data Integration

Theme 3 menggunakan global data structure dari `@/lib/theme-data.ts`:

```tsx
import { ThemeData, getFirstEvent, createCalendarUrl } from "@/lib/theme-data";

// Get first event from data
const firstEvent = getFirstEvent(data.event);

// Create calendar URL
const calendarUrl = createCalendarUrl(firstEvent, sortedEvents, nickname, data.category_type);
```

## Responsive Design

Theme menggunakan mobile-first approach dengan max-width 400px:
- Optimal untuk smartphone viewing
- Consistent experience across devices
- Center-aligned layout pada desktop

## Styling

### Colors
- **Background**: Black (#000000)
- **Primary**: Netflix Red (#E50913) 
- **Text**: White (#FFFFFF)
- **Secondary Text**: Gray (#A3A1A1)
- **Accent**: Green untuk success states

### Typography
- **Headers**: Bold, various sizes (sm, md, lg, xl)
- **Body Text**: Regular weight, line-height optimized for reading
- **Captions**: Small text for metadata and descriptions

### Layout
- **Spacing**: Consistent spacing using space-y-* utilities
- **Containers**: Max-width constraint with center alignment
- **Sections**: Organized content blocks with proper spacing

## Integration with Existing System

### Props Interface
```tsx
interface Theme3Props {
  data: ThemeData; // Global theme data structure
}
```

### Required Data Fields
- `data.status` - Payment status
- `data.content_user_id` - Unique content ID
- `data.content.children` - Bride/groom or child information
- `data.content.gallery.items` - Image gallery
- `data.event` - Event details (date, time, location)
- `data.category_type` - Event category (wedding, khitanan, etc.)

### Payment Integration
```tsx
const handlePayment = async () => {
  // Midtrans integration
  const mjson = await midtransAction({...});
  // Handle payment flow
};
```

## Performance Optimizations

1. **Image Optimization**: Next.js Image component dengan proper sizing
2. **Lazy Loading**: Components loaded on demand
3. **Minimal JavaScript**: Lightweight interaction logic
4. **CSS Efficiency**: Utility-first approach dengan Tailwind
5. **Bundle Size**: Focused component structure

## Usage Example

```tsx
import Theme3 from "@/components/theme/3/page";
import { ThemeData } from "@/lib/theme-data";

function WeddingInvitation({ invitationData }: { invitationData: ThemeData }) {
  return <Theme3 data={invitationData} />;
}
```

## Customization

### Adding New Sections
1. Create new section in main content area
2. Use NetflixSection wrapper
3. Follow consistent spacing patterns
4. Use appropriate typography components

### Styling Modifications
1. Extend NetflixComponents variants
2. Add new color schemes in component props
3. Modify spacing in main layout

### Animation Support
```tsx
import { fadeIn, slideInLeft, scaleIn } from './animations';

// Use with framer-motion
<motion.div {...fadeIn}>Content</motion.div>
```

## Browser Support
- Modern browsers with ES6+ support
- Mobile Safari iOS 12+
- Chrome/Firefox/Edge latest versions
- Optimized for mobile viewing experience

## Development Notes
- Built with TypeScript for type safety
- Uses Tailwind CSS for styling
- Framer Motion ready for animations
- Next.js 14+ compatible
- Mobile-first responsive design approach