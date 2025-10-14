# ERP SaaS - Enterprise Resource Management

## Overview

This is a comprehensive Enterprise Resource Planning (ERP) system built as a SaaS application for managing construction projects and business operations. The application provides modules for project management (chantiers), employee tracking (salariés), equipment management (équipements), purchasing, finances, budgeting, and documentation management.

The system is designed for construction and industrial businesses, offering features like budget tracking, resource allocation, workload planning, and multi-language support (French, Russian, Romanian).

## Recent Changes

**October 14, 2025 - Real Business Data Integration & Complete UI Adaptation**
- Successfully imported and integrated real business data from client's Excel files
- **Data Import Results:**
  - 161 employees (salariés) imported from RH sheet
  - 193 equipment items (équipements) imported from Meca sheet, 57 with assigned operators
  - 6 construction projects (chantiers) imported from Chantier sheet
- **Database Schema Extensions:**
  - Extended `salaries` table with 7 organizational columns:
    - `coastCenter` (text) - Cost center assignment
    - `division` (text) - Division/department
    - `services` (text) - Service line
    - `codeFonction` (text) - Function code
    - `inNum` (text) - Internal employee number
    - `salaryMonth` (decimal 10,2) - Monthly salary
    - `acordSup` (decimal 10,2) - Supplementary allowance
  - Extended `equipements` table with 8 metadata columns:
    - `year` (integer) - Manufacturing year
    - `fuelType` (text) - Fuel type (Diesel, Electric, etc.)
    - `gpsUnit` (text) - GPS unit identifier
    - `meterUnit` (text) - Odometer/hour meter reading
    - `hourlyRate` (decimal 10,2) - Hourly rate in lei
    - `fuelConsumption` (decimal 10,2) - Fuel consumption L/100km
    - `maintenanceCost` (decimal 10,2) - Annual maintenance cost in lei
    - `operatorId` (FK → salaries.id) - Assigned driver/operator relationship
  - Extended `chantiers` table with 9 project management columns:
    - `codeProjet` (text) - Project code
    - `beneficiaire` (text) - Project beneficiary/client
    - `responsableId` (FK → salaries.id) - Project manager relationship
    - Detailed budget breakdown (3 planned + 3 actual):
      - `budgetMainDoeuvre` / `budgetReelMainDoeuvre` - Labor budget/actual
      - `budgetMateriaux` / `budgetReelMateriaux` - Materials budget/actual
      - `budgetEquipement` / `budgetReelEquipement` - Equipment budget/actual
- **Intelligent Import Script (server/import-data.ts):**
  - Smart name matching algorithm: splits full names, handles case variations
  - Automatic operator-to-equipment relationship creation via name matching
  - Column mapping from Excel structure to database schema
  - Successful migration: `npm run db:push` applied all changes without --force flag
- **Complete UI Implementation:**
  - **New Salaries Page (client/src/pages/Salaries.tsx):**
    - Displays all imported employee data with organizational structure
    - Columns: Name, Function, Division, Service, Cost Center, Hourly Rate, inNum, codeFonction
    - Full internationalization (FR/RU/RO)
  - **Updated Equipements Page:**
    - Extended to show ALL metadata columns: ID, Model, Year, Plate, Fuel Type, Driver, GPS/Meter, Hourly Rate, Fuel Consumption, **Maintenance Cost**
    - Displays operator relationships (linked via operatorId FK)
  - **Enhanced Chantiers/ProjectsTable:**
    - Shows project code, beneficiary, detailed budget breakdown
    - Budget columns display: MDO (labor), Matériaux (materials), Équipement (equipment)
    - Each budget column shows planned (line 1) and actual (line 2, greyed)
    - Project manager relationship displayed via responsableId FK
- **Critical Zero-Value Fix:**
  - All numeric fields use `!== undefined && !== null` checks instead of truthy checks
  - Ensures legitimate zero values (€0 budgets, 0 lei rates, etc.) are displayed correctly
  - Applied across: Equipements table, ProjectsTable, Chantiers mapper
  - Guarantees complete budget transparency and data accuracy

**October 2025 - Purchase Reception Workflow (Achat/Stocks)**
- Implemented complete purchase reception workflow with operator validation and invoice photo attachments
- Extended `depenses` table schema with reception tracking fields:
  - `statut_reception` enum: 'en_attente' (pending) | 'receptionne' (received)
  - `date_reception` - Date when items were received and validated
  - `operateur_reception` - Name of operator who validated the reception
  - `photo_facture_path` - Base64 data URL of invoice photo
- Created secure file upload API endpoint `/api/upload-facture`:
  - Filename sanitization using regex to prevent path traversal attacks
  - Base64 storage with buffer management (production: consider S3/Cloudinary)
  - Returns data URL for immediate display in UI
- Built two new dialog components using React Hook Form + Zod validation:
  - **NewPurchaseDialog**: Create purchases with stock item selection, quantity, amount, level (admin/chantier), optional chantier
  - **ReceptionDialog**: Validate received items with operator name, reception date, and invoice photo upload
- API routes:
  - `POST /api/depenses` - Create new purchase (initializes with statut_reception='en_attente')
  - `PATCH /api/depenses/:id/reception` - Validate reception and update status to 'receptionne'
- Enhanced Purchases tab UI:
  - Status badges with color coding (yellow for pending, green for received)
  - Reception metadata columns (date, operator name)
  - "View Invoice" button to display uploaded photos in new tab
  - "Réceptionner" action button for pending purchases (opens ReceptionDialog)
- Complete i18n coverage for new workflow (FR/RU/RO):
  - Dialog titles, descriptions, form labels, placeholders
  - Status labels, toast notifications, error messages
  - Removed hard-coded French validation messages to support all locales

**October 2025 - Achat/Stocks Module Implementation**
- Renamed "Achats" module to "Achat/Stocks" in all 3 languages (French, Russian, Romanian)
- Created stock management infrastructure:
  - New `usines` table for factory/production facility management
  - New `stock_items` table for inventory tracking with itemId, name, factory reference, quantity, unit
  - Enhanced `depenses` table with `niveau` field (admin/chantier) and `stockItemId` reference
  - Made `depenses.chantierId` nullable to support admin-level purchases
- Implemented full CRUD API routes:
  - `/api/usines` - Factory management (GET, POST, DELETE)
  - `/api/stock-items` - Stock inventory (GET, POST, PATCH, DELETE)
- Updated Achats page with 3 tabs:
  - **Stock Items**: Displays ID, name, factory, quantity, unit with full i18n
  - **Purchases**: Shows purchase tracking with niveau badges (Admin/Chantier), linked to chantiers
  - **Factories**: Lists production facilities with article counts
- Complete internationalization across all UI elements and empty states

**October 2025 - Equipment Management Improvements**
- Cleaned database from duplicate equipment imports (921 → 183 unique items)
- Simplified equipment table to display 4 essential columns: ID (serial number), Model, Plate Number, Driver Name
- Fixed ImportEquipmentDialog TypeScript error with null check for errors array
- Standardized Excel import process with single-import guarantee
- Prepared infrastructure for future assignment functionality (equipment-to-site tracking with driver assignments)

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