# Livestock Health Meter - Design Guidelines

## Design Approach Selection: Reference-Based (Agricultural Technology)
Drawing inspiration from agricultural technology platforms like FarmLogs, AgriWebb, and veterinary management systems, with emphasis on data clarity and operational efficiency.

## Core Design Elements

### A. Color Palette
**Primary Colors:**
- Light Mode: Green primary (120 85% 35%) for healthy/positive indicators
- Dark Mode: Green primary (120 75% 45%) for better contrast
- Critical alerts: Red (0 85% 55%) for urgent health issues
- Warning states: Orange (35 90% 50%) for moderate concerns
- Neutral grays: Cool gray scale (220 15% 15% to 220 5% 95%)

**Health Status Colors:**
- Healthy: Green (120 60% 45%)
- Sick: Orange (35 80% 50%)
- Critical: Red (0 75% 50%)

### B. Typography
**Primary Font:** Inter (Google Fonts) for English content
**Secondary Font:** Noto Sans Arabic for Urdu/RTL support
- Headings: 600-700 weight
- Body text: 400 weight
- Data labels: 500 weight
- Small text/captions: 400 weight

### C. Layout System
**Tailwind Spacing Units:** Consistent use of 2, 4, 6, 8, 12, 16 units
- Component padding: p-4, p-6
- Section margins: m-8, m-12
- Card spacing: gap-4, gap-6
- Grid layouts: grid-cols-1 md:grid-cols-2 lg:grid-cols-3

### D. Component Library

**Dashboard Cards:**
- Health status cards with colored left borders
- Alert banners with appropriate severity colors
- Metric cards showing counts and percentages

**Data Tables:**
- Clean, minimal styling with alternating row colors
- Action buttons (view, edit, delete) consistently placed
- Sortable headers with subtle indicators

**Forms:**
- Grouped form sections with clear labels
- Multi-step forms for complex data entry
- File upload areas with drag-and-drop styling

**Navigation:**
- Sidebar navigation for desktop (collapsible)
- Bottom tab navigation for mobile
- Breadcrumb navigation for deep pages

**Charts and Analytics:**
- Clean, minimal chart styling using Recharts
- Consistent color usage across all visualizations
- Tooltip styling matching overall design system

### E. Mobile-First Responsive Strategy
- Stack cards vertically on mobile
- Horizontal scrolling for wide tables
- Touch-friendly button sizes (min 44px)
- Collapsible sections for dense information

## Bilingual (English/Urdu) Design Considerations
- Text direction switching (LTR/RTL) support
- Icon positioning adjustments for RTL
- Form layout mirroring for RTL languages
- Navigation menu positioning for both directions

## Agricultural Context Visual Elements
- Earth-tone accent colors where appropriate
- Clean, clinical aesthetic for health-related sections
- Professional, trustworthy appearance for blockchain/sales sections
- Data-dense layouts optimized for quick scanning

## Images Section
**Primary Images Needed:**
- **Cattle profile photos:** Placeholder rectangular images (4:3 ratio) for individual animal profiles
- **Dashboard icons:** Health status indicators, alert icons, and navigation icons from Heroicons library
- **Disease detection interface:** Upload area placeholder for cattle images
- **No large hero image required** - Focus on functional, data-driven interface

**Image Treatment:**
- Rounded corners (rounded-lg) for profile photos
- Subtle shadows for card elevation
- Consistent aspect ratios across similar content types
- Placeholder images should suggest agricultural/livestock context

## Key Interaction Patterns
- Hover states for clickable elements with subtle color shifts
- Loading states for AI disease detection results
- Success/error states for form submissions
- Confirmation modals for critical actions (isolate cattle, update health status)

This design system prioritizes data clarity, operational efficiency, and cultural accessibility while maintaining a professional, trustworthy appearance appropriate for agricultural technology and livestock management.