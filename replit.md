# ERP SaaS - Enterprise Resource Management

## Overview

This is a comprehensive Enterprise Resource Planning (ERP) system built as a SaaS application for managing construction projects and business operations. The application provides modules for project management (chantiers), employee tracking (salariés), equipment management (équipements), purchasing, finances, budgeting, and documentation management.

The system is designed for construction and industrial businesses, offering features like budget tracking, resource allocation, workload planning, and multi-language support (French, Russian, Romanian).

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework & Build System**
- **React 18** with TypeScript for type-safe component development
- **Vite** as the build tool and development server for fast HMR (Hot Module Replacement)
- **Wouter** for lightweight client-side routing instead of React Router
- **TanStack Query v5** for server state management, data fetching, and caching

**UI Component Library**
- **shadcn/ui** components based on Radix UI primitives (New York style variant)
- **Tailwind CSS** for utility-first styling with custom design tokens
- Design system inspired by Carbon Design System and Linear, optimized for dark mode with professional enterprise aesthetics
- Custom color palette using HSL values for dark backgrounds, professional blue primary color, and semantic status colors

**State Management & Data Flow**
- Server state managed via TanStack Query with custom query functions
- Local UI state handled with React hooks
- Form handling with React Hook Form and Zod validation
- Real-time data refetching disabled by default (staleTime: Infinity) for controlled updates

**Internationalization**
- **i18next** with react-i18next for multi-language support
- Language persistence in localStorage
- Support for French (default), Russian, and Romanian

### Backend Architecture

**Server Framework**
- **Express.js** on Node.js for RESTful API endpoints
- ESM (ES Modules) architecture throughout the codebase
- Custom request logging middleware for API calls
- Error handling middleware with standardized JSON error responses

**API Structure**
- RESTful endpoints organized by resource type:
  - `/api/chantiers` - Construction project management
  - `/api/salaries` - Employee management
  - `/api/equipements` - Equipment tracking
  - `/api/depenses` - Expense tracking
- CRUD operations following REST conventions (GET, POST, PATCH, DELETE)
- File upload support via Multer for Excel imports

**Data Validation**
- **Zod schemas** for runtime type validation
- Validation schemas automatically derived from Drizzle ORM table definitions using drizzle-zod
- Request body validation on all POST/PATCH endpoints

**Development Features**
- Vite middleware integration in development mode for HMR
- Replit-specific plugins for development banner and error overlay
- Production build uses esbuild for server bundling

### Data Storage

**Database**
- **PostgreSQL** via Neon serverless database
- **Drizzle ORM** for type-safe database queries and schema management
- Connection pooling with @neondatabase/serverless
- WebSocket support for serverless environments

**Database Schema**
Core tables include:
- `users` - Authentication and user management
- `chantiers` - Construction projects with budget tracking
- `salaries` - Employee records with competencies
- `equipements` - Equipment inventory with status tracking
- `affectations_salaries` - Employee-to-project assignments
- `affectations_equipements` - Equipment-to-project assignments
- `depenses` - Expense tracking linked to projects

**Schema Features**
- UUID primary keys with PostgreSQL `gen_random_uuid()`
- Decimal precision for financial data (12,2 for budgets, 10,2 for rates)
- Array columns for competencies/tags
- Timestamp tracking with automatic `created_at` defaults
- Status enums for workflow states

**Data Import/Export**
- Excel file parsing using xlsx library
- Auto-detection of column mappings for equipment imports
- Bulk insert capabilities for imported data

### External Dependencies

**Core Infrastructure**
- **Neon Database** - Serverless PostgreSQL hosting with WebSocket support
- **Drizzle Kit** - Database migration tool (configured in drizzle.config.ts)

**UI & Visualization Libraries**
- **Recharts** - Data visualization for budget charts and analytics
- **Radix UI** - Headless component primitives (accordion, dialog, dropdown, select, toast, etc.)
- **Lucide React** - Icon library for consistent iconography
- **cmdk** - Command palette component

**Form & Data Handling**
- **React Hook Form** - Form state management
- **@hookform/resolvers** - Zod integration for form validation
- **date-fns** - Date manipulation and formatting
- **xlsx** - Excel file parsing for imports

**Styling & Theming**
- **Tailwind CSS** with PostCSS and Autoprefixer
- **class-variance-authority** - Type-safe variant styling
- **tailwind-merge** - Intelligent Tailwind class merging
- Custom CSS variables for theme tokens (light/dark mode support)

**Development Tools**
- **Replit Vite Plugins** - Development banner, error modal, and cartographer
- **TypeScript** - Type checking across client and server
- **ESBuild** - Production server bundling

**File Upload**
- **Multer** - Multipart form data handling for file uploads
- In-memory storage for Excel imports

**Session Management**
- **connect-pg-simple** - PostgreSQL session store (imported but session setup not visible in provided files)