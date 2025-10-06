# Design Guidelines: ERP SaaS - Enterprise Resource Management

## Design Approach: Carbon Design System + Linear Influence

**Rationale**: Enterprise data-heavy application requiring clarity, efficiency, and scalability. Carbon Design System provides robust patterns for complex data visualization and workflows, while Linear's typography and modern aesthetic elevate the professional experience.

---

## Core Design Elements

### A. Color Palette

**Dark Mode (Primary)**
- Background Base: `220 13% 9%` (Deep slate, professional depth)
- Surface Elevated: `220 13% 12%` (Cards, panels)
- Surface Interactive: `220 13% 15%` (Hover states, dropdowns)
- Border Default: `220 10% 20%` (Subtle separation)
- Border Emphasis: `220 10% 30%` (Active elements)

**Brand & Accent Colors**
- Primary Brand: `217 91% 60%` (Professional blue - CTAs, active states)
- Success: `142 76% 45%` (Budget on track, completed tasks)
- Warning: `38 92% 50%` (Approaching deadlines, attention needed)
- Danger: `0 84% 60%` (Over budget, critical alerts)
- Info: `199 89% 48%` (Neutral information, tooltips)

**Text Hierarchy**
- Primary Text: `220 9% 96%`
- Secondary Text: `220 9% 70%`
- Tertiary Text: `220 9% 50%`
- Disabled: `220 9% 30%`

### B. Typography

**Font Stack**: Inter (primary), SF Pro (fallback)
- Headings: Font weights 600-700, tight letter-spacing (-0.02em)
- Body: Font weight 400, relaxed line-height (1.6)
- Data Tables: Font weight 500, tabular-nums for numeric alignment
- Labels: Font weight 500, uppercase with letter-spacing (0.05em)

**Scale**
- H1: 32px (Dashboard section titles)
- H2: 24px (Module headers)
- H3: 18px (Card titles, sub-sections)
- Body: 14px (Primary content)
- Small: 12px (Meta info, captions)
- Micro: 11px (Table headers, badges)

### C. Layout System

**Spacing Primitives**: Tailwind units of 2, 4, 6, 8, 12, 16
- Micro spacing (2, 4): Within components, icon-text gaps
- Content spacing (6, 8): Between related elements, card padding
- Section spacing (12, 16): Module separation, dashboard grid gaps

**Grid System**
- Dashboard: 12-column grid with 4-6 gap
- Data tables: Full-width with internal column grid
- Forms: 2-column layout on desktop (lg:grid-cols-2), single on mobile

### D. Component Library

**Navigation**
- Sidebar: Collapsible left navigation (280px expanded, 64px collapsed)
- Top bar: Breadcrumb navigation + user profile + notifications
- Module tabs: Horizontal pill navigation for sub-sections

**Data Display**
- Tables: Striped rows, sticky headers, sortable columns, row actions menu
- KPI Cards: Metric value, trend indicator, sparkline chart, period selector
- Status Badges: Pill-shaped with subtle background tint matching status color
- Charts: Apex Charts or Chart.js for budget comparison and workload visualization

**Forms & Inputs**
- Input fields: Contained style with subtle border, focus state with primary glow
- Dropdowns: Search-enabled for long lists (employees, equipment)
- Date pickers: Calendar overlay with range selection capability
- Multi-select: Tag-style chips with remove option

**Interactive Elements**
- Primary buttons: Solid primary color fill, white text
- Secondary buttons: Transparent with border, hover background tint
- Icon buttons: 40px square, hover background circle
- Action menus: Kebab menu (three dots) for row-level actions

**Overlays**
- Modals: Center-screen with backdrop blur, max-width 768px
- Slide-over panels: Right-side drawer for quick edits (448px width)
- Tooltips: Dark background, white text, 8px arrow
- Toast notifications: Top-right stack, auto-dismiss after 5s

### E. Animations

**Minimal, Purposeful Motion**
- Page transitions: None (instant navigation for data-heavy app)
- Component interactions: 150ms ease-out for hover/focus states
- Loading states: Subtle pulse on skeleton screens
- Data updates: 200ms fade-in for new rows/values

---

## Module-Specific Patterns

**Dashboard Layout**
- Hero section: KPI grid (4 columns desktop, 2 tablet, 1 mobile) featuring: Active projects count, utilization rate, budget variance, upcoming deadlines
- Active projects table: Condensed view with quick actions
- Workload chart: Horizontal bar chart showing resource allocation
- Recent activity feed: Timeline-style list in sidebar area

**Planning Interface**
- Calendar view: Week/month toggle, resource rows, assignment blocks with drag-drop
- Timeline: Gantt-style chart for project durations and dependencies
- Resource panel: Sidebar with filterable employee/equipment list

**Data Tables (Employees/Equipment/Projects)**
- Search bar: Top-left with instant filtering
- Column filters: Dropdown per column header
- Bulk actions: Checkbox selection with action bar
- Pagination: Bottom-right, showing "1-25 of 156 items"

**Budget Tracking**
- Comparison cards: Side-by-side prévisionnel/réalisé values
- Variance visualization: Progress bar with color coding (green under, red over)
- Line chart: Monthly spending trend with forecast line
- Cost breakdown: Pie chart or stacked bar by category

---

## Responsive Strategy

**Breakpoints**
- Mobile: < 768px - Stack all layouts, hide secondary navigation
- Tablet: 768-1024px - 2-column grids, collapsible sidebar
- Desktop: > 1024px - Full layout with expanded sidebar and multi-column tables

**Mobile-First Adjustments**
- Replace complex tables with card-based views
- Bottom navigation bar for primary modules
- Swipeable tabs for sub-sections
- Full-screen modals instead of slide-overs

---

## Images

**No hero images**: This is a data-centric enterprise tool focused on efficiency, not marketing. Visual emphasis on clean data visualization, charts, and functional UI components rather than decorative imagery.

**Iconography**: Use Heroicons (outline style) throughout for consistency - navigation items, status indicators, action buttons, empty states.