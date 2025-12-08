# Theme Structure Documentation

## Overview
This documentation explains the structure of themes in the Papunda invitation system. Each theme is a collection of React components that render different sections of a digital invitation.

## Theme Directory Structure
```
components/theme/[theme_number]/
├── page.tsx                    # Main theme component (entry point)
├── OpeningSection.tsx          # Landing/cover section
├── ProfileSection.tsx          # Couple profile display
├── QuoteSection.tsx           # Quote/verse section
├── InvitationTextSection.tsx  # Invitation text
├── FamilySection.tsx          # Family information
├── TurutSection.tsx           # Turut (accompanies) section
├── CountdownSection.tsx       # Event countdown timer
├── EventSection.tsx           # Event details (akad, resepsi, etc.)
├── OurStorySection.tsx        # Love story timeline
├── GallerySection.tsx         # Photo gallery
├── videosection.tsx           # Video section
├── BankSection.tsx            # Bank transfer info
├── rsmpsection.tsx            # RSVP section
├── ClosingSection.tsx         # Closing/thank you
├── FooterSection.tsx          # Footer
├── animasi.tsx                # Animation components
└── ImportantEventSection.tsx  # Important events
```

## Main Theme Component (page.tsx)

### Props Structure
```typescript
interface Theme1Props {
  data: {
    theme: ThemeConfig;
    content: ContentData;
    decorations: DecorationData;
    event: EventData;
    category_type: CategoryType;
    status: string;
    content_user_id: string;
  };
}
```

### Key Data Structures

#### Theme Config
```typescript
interface ThemeConfig {
  defaultBgImage1: string;    // Primary background image
  defaultBgImage: string;     // Secondary background
  accentColor: string;        // Primary accent color
  textColor: string;          // Text color
}
```

#### Content Data
```typescript
interface ContentData {
  opening: {
    title: string;
    toLabel: string;
  };
  children: Array<{
    name: string;
    nickname?: string;
  }>;
  parents?: {
    groom?: ParentInfo;
    bride?: ParentInfo;
  };
  gallery: {
    items: string[];
    enabled?: boolean;
  };
  music: {
    url: string;
    enabled: boolean;
  };
  our_story: StoryItem[];
  our_story_enabled: boolean;
  bank_transfer: {
    enabled: boolean;
    accounts: BankAccount[];
  };
  plugin: {
    navbar?: boolean;
    rsvp?: boolean;
    gift?: boolean;
    youtube_link?: string;
  };
  font: {
    special: string;
    body: string;
    heading: string;
  };
  turut: {
    enabled: boolean;
    list: string[];
  };
  quote: string;
  quote_enabled: boolean;
  gallery_enabled: boolean;
  invitation: string;
  title: string;
}
```

#### Event Data
```typescript
interface EventData {
  [eventKey: string]: {
    date: string;
    time: string;
    location: string;
    mapsLink: string;
    note?: string;
    title?: string;
  };
}
```

## Component Props Pattern

### Standard Props
All section components typically receive:
- `theme: ThemeConfig` - Theme configuration
- `specialFontFamily?: string` - Special font family
- `BodyFontFamily?: string` - Body font family  
- `HeadingFontFamily?: string` - Heading font family

### Section-Specific Props
Each section receives relevant data from the main `data` object:
- `OpeningSection`: opening, gallery, decorations, childrenData
- `ProfileSection`: gallery, opening, childrenData, event info
- `EventSection`: events array, sectionTitle
- `GallerySection`: gallery data
- `BankSection`: bank_transfer data
- etc.

## Theme Features

### Responsive Design
- Mobile-first approach
- Desktop layout: 70% left cover image, 30% right content
- Mobile layout: Full-width stacked sections

### Lazy Loading
- Heavy components (MusicPlayer, VideoSection, etc.) are dynamically loaded
- Gallery and Our Story sections use LazyHydrate wrapper

### Animation
- Framer Motion for smooth transitions
- Loading animation with Lottie
- Scroll-based animations

### Font Processing
Fonts are processed to remove CSS syntax:
```typescript
const processedFont = content?.font?.special
  ?.replace('font-family:', '')
  .trim()
  .replace(';', '') || 'sans-serif';
```

### Conditional Rendering
Sections render based on:
- Feature flags (`gallery_enabled`, `our_story_enabled`)
- Data availability (`gallery?.items?.length > 0`)
- Plugin settings (`plugin.rsvp`, `plugin.gift`)

## Event Type Detection
The system detects event types (wedding, khitanan, etc.) based on:
```typescript
const isWedding = !!parents?.groom;
const isKhitan = lowerCategory.includes('khitan') || 
                 lowerEventTitle.includes('khitan') || 
                 anyEventTitleMentionsKhitan;
```

## Payment Integration
- Midtrans payment gateway integration
- Status-based feature availability
- Trial/preview mode for unpaid invitations

## Navigation
- Fixed navigation for enabled features
- Section-based scrolling
- Responsive mobile navigation

## Available Themes

### Theme 1 (Default)
- Classic elegant design
- Split layout: 70% left image, 30% right content on desktop
- Traditional wedding invitation styling
- Soft animations and transitions
- Support for all event types

### Theme 2 (Netflix Style)
- Modern dark theme inspired by Netflix design
- Full-screen layout with card-based sections
- Dark background (#0f0f0f) with red accents (#e50914)
- Netflix-style hover animations and transitions
- Card-based content presentation
- Gradient overlays and backdrop blur effects
- Responsive grid layouts
- Enhanced visual hierarchy

## Netflix Theme Features (Theme 2)

### Design Characteristics:
- **Color Scheme**: Dark background with red accent colors
- **Typography**: Bold headings with good contrast
- **Layout**: Card-based sections with rounded corners
- **Animations**: Smooth hover effects and scale transitions
- **Visual Elements**: Gradient overlays, backdrop blur, border accents

### Responsive Design:
- Mobile-first approach
- Flexible grid systems (1/2/3/4 columns)
- Adaptive typography scaling
- Touch-friendly interactive elements
- Optimized spacing for different screen sizes

### Interactive Elements:
- Hover scale effects (1.05x)
- Card lift animations
- Smooth color transitions
- Loading spinners with brand colors
- Copy-to-clipboard functionality with visual feedback

## Creating New Themes

### Steps:
1. Create new directory: `components/theme/[number]/`
2. Copy base structure from theme 1 or 2
3. Modify styling and layout while maintaining prop interfaces
4. Ensure responsive design
5. Test with different data configurations

### Best Practices:
- Maintain consistent prop interfaces across themes
- Use theme colors from `theme.accentColor` and `theme.textColor`
- Implement responsive breakpoints
- Support all content types (wedding, khitanan, etc.)
- Handle missing data gracefully
- Optimize for performance with lazy loading
- Follow design system principles (Netflix theme as example)
- Ensure accessibility standards
- Test on multiple devices and screen sizes

### Netflix Theme Implementation Notes:
- Uses extended theme object with additional color properties
- Implements consistent card design patterns
- Utilizes Framer Motion for animations
- Includes comprehensive error handling
- Supports dark mode by design
- Optimized for performance with lazy loading

## API Data Integration
The theme system is designed to work with existing API data structure without modifications. All themes should:
- Accept the same data format
- Handle optional fields gracefully  
- Provide fallback values for missing data
- Support all event types and categories
- Maintain backward compatibility with existing themes