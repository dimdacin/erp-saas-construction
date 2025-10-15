# 🏭 Factory Dashboard - Implementation Summary

## Overview

This implementation adds a comprehensive factory operations dashboard to the ERP system, enabling tracking of energy consumption, production metrics, and employee assignments across multiple factory sites.

## What Has Been Implemented

### 1. Database Schema (3 New Tables)

#### `usine_consommations` - Energy Consumption Tracking
- Tracks daily electricity and gas consumption per factory
- Flexible unit support (kWh, MWh, m³)
- Foreign key to `usines` table

#### `usine_productions` - Production Metrics
- Tracks tonnes received and sold by merchandise type
- Client association for sales tracking
- Support for multiple product types per factory per day

#### `usine_affectations_salaries` - Employee Assignments
- Tracks daily employee assignments to factories
- Records hours worked per day
- Links to existing `salaries` table

### 2. Backend APIs (20+ Endpoints)

#### Consumption Endpoints
- `GET /api/usine-consommations` - List all consumptions
- `GET /api/usine-consommations/usine/:usineId` - By factory
- `GET /api/usine-consommations/date/:date` - By date
- `POST /api/usine-consommations` - Create
- `DELETE /api/usine-consommations/:id` - Delete

#### Production Endpoints
- `GET /api/usine-productions` - List all productions
- `GET /api/usine-productions/usine/:usineId` - By factory
- `GET /api/usine-productions/date/:date` - By date
- `POST /api/usine-productions` - Create
- `DELETE /api/usine-productions/:id` - Delete

#### Employee Assignment Endpoints
- `GET /api/usine-affectations-salaries` - List all
- `GET /api/usine-affectations-salaries/usine/:usineId` - By factory
- `GET /api/usine-affectations-salaries/date/:date` - By date
- `POST /api/usine-affectations-salaries` - Create
- `DELETE /api/usine-affectations-salaries/:id` - Delete

#### Import/Export Endpoints
- `POST /api/factory-data/import?mode=append|replace` - Import Excel
- `GET /api/factory-data/export?format=excel|csv|json&date=YYYY-MM-DD` - Export

### 3. Frontend Components

#### Main Components
1. **FactoryDashboard.tsx**
   - Main dashboard view
   - Displays all factory metrics
   - Real-time data visualization
   - Date-based filtering

2. **AddFactoryDataDialog.tsx**
   - Multi-tab form (Consumption, Production, Personnel)
   - Input validation
   - Toast notifications
   - Auto-refresh after submit

3. **ImportFactoryDataDialog.tsx**
   - Excel file upload
   - Mode selection (append/replace)
   - Format instructions
   - Error handling

4. **ExportFactoryDataButton.tsx**
   - Multi-format export (Excel, CSV, JSON)
   - Date-based filtering
   - Download trigger

#### Dashboard Integration
- New "Usines" tab in main Dashboard
- Toggle between "Général" and "Usines" views
- Seamless navigation

### 4. Data Import/Export

#### Excel Import Structure
The system expects 3 sheets:

**Consommations Sheet:**
```
Usine ID | Date | Électrique (kWh) | Gaz (kWh) | Unite
```

**Productions Sheet:**
```
Usine ID | Date | Type Marchandise | Tonnes Reçues | Tonnes Vendues | Client | Notes
```

**Affectations Sheet:**
```
Usine ID | Salarié ID | Date | Heures/Jour | Notes
```

#### Export Formats
- **Excel (.xlsx)**: Structured with 3 separate sheets
- **CSV (.csv)**: Simple comma-separated format
- **JSON (.json)**: API-ready format

### 5. Key Features

✅ **Energy Consumption Tracking**
- Electricity consumption (kWh/MWh)
- Gas consumption (kWh/m³)
- Historical data by date

✅ **Production Metrics**
- Tonnes received by product type
- Tonnes sold with client tracking
- Multiple products per factory per day

✅ **Employee Management**
- Daily assignments to factories
- Hours worked tracking
- Link to existing employee records

✅ **Data Entry Options**
- Manual entry via forms
- Bulk import via Excel
- API integration ready

✅ **Data Export**
- Excel for reporting
- CSV for data analysis
- JSON for system integration

## How to Use

### Initial Setup

1. **Create Factories** (if not already done):
   - Go to "Achats" → "Usines" tab
   - Add your factory locations

2. **Ensure Employees Exist**:
   - Go to "Salariés" 
   - Verify employee records

### Adding Data Manually

1. **Navigate to Dashboard** → "Usines" tab

2. **Click "Ajouter Données Usine"**

3. **Fill in the appropriate tab**:
   - **Consommation**: Energy usage
   - **Production**: Materials received/sold
   - **Personnel**: Employee assignments

4. **Click "Ajouter"**

### Importing from Excel

1. **Prepare Excel file** following template structure (see `TEMPLATE_IMPORT_USINES.md`)

2. **Click "Importer Excel"**

3. **Select file and mode**:
   - Append: Adds to existing data
   - Replace: ⚠️ Clears all and imports

4. **Click "Importer"**

### Exporting Data

1. **Click "Exporter"**

2. **Choose format**:
   - Excel for reports
   - CSV for spreadsheets
   - JSON for APIs

3. **File downloads automatically**

## File Structure

```
client/src/components/
├── FactoryDashboard.tsx          # Main dashboard component
├── AddFactoryDataDialog.tsx      # Manual data entry form
├── ImportFactoryDataDialog.tsx   # Excel import dialog
└── ExportFactoryDataButton.tsx   # Export functionality

client/src/pages/
└── Dashboard.tsx                 # Updated with Usines tab

server/
├── routes.ts                     # Added 20+ new endpoints
├── storage.ts                    # Added CRUD methods
└── import.ts                     # Excel parsing logic

shared/
└── schema.ts                     # Database schema & types

Documentation:
├── README.md                     # Updated with features
├── TESTING_FACTORY_DASHBOARD.md # Testing guide
└── attached_assets/
    └── TEMPLATE_IMPORT_USINES.md # Import template
```

## Database Migration

To apply the new schema to your database:

```bash
npm run db:push
```

This creates the 3 new tables with proper relationships.

## API Examples

### Create Consumption
```bash
POST /api/usine-consommations
Content-Type: application/json

{
  "usineId": "uuid-123",
  "date": "2025-01-15",
  "consommationElectrique": "1500.50",
  "consommationGaz": "800.25",
  "unite": "kWh"
}
```

### Get Production by Date
```bash
GET /api/usine-productions/date/2025-01-15
```

### Import Excel
```bash
POST /api/factory-data/import?mode=append
Content-Type: multipart/form-data

file: [Excel file]
```

### Export as JSON
```bash
GET /api/factory-data/export?format=json&date=2025-01-15
```

## Testing

Follow the comprehensive testing guide in `TESTING_FACTORY_DASHBOARD.md`:

- ✅ Manual form entry
- ✅ Excel import (append/replace modes)  
- ✅ Multi-format export
- ✅ Data validation
- ✅ Error handling
- ✅ UI/UX verification

## Benefits

1. **Centralized Factory Data**: All factory operations in one place
2. **Energy Tracking**: Monitor and optimize energy consumption
3. **Production Insights**: Track material flow and client relationships
4. **Labor Management**: See employee distribution across factories
5. **Flexible Data Entry**: Manual forms or bulk imports
6. **Easy Reporting**: Export to Excel, CSV, or JSON
7. **Type-Safe**: Full TypeScript coverage
8. **Validated**: Zod schema validation on all inputs

## Next Steps

1. **Run Database Migration**: `npm run db:push`
2. **Create Test Factory**: In Achats → Usines
3. **Add Sample Data**: Use the manual form or import template
4. **Verify Dashboard**: Check the Usines tab displays correctly
5. **Test Export**: Export data in different formats

## Technical Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS, shadcn/ui
- **Backend**: Express, Drizzle ORM, PostgreSQL
- **Validation**: Zod schemas
- **State**: TanStack Query (React Query)
- **Data**: xlsx library for Excel handling
- **UI**: Radix UI components

## Support

For issues or questions:
1. Check `TESTING_FACTORY_DASHBOARD.md` for testing scenarios
2. Review `attached_assets/TEMPLATE_IMPORT_USINES.md` for import format
3. See API Reference in README for endpoint details

---

**Implementation completed successfully! 🎉**

The factory dashboard is now fully integrated and ready to use. All features have been implemented, documented, and are ready for testing.
