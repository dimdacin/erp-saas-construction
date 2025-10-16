# Excel Import System - Documentation

## Overview

This document describes the Excel import functionality implemented for the ERP SAAS Construction system. The import system allows users to import data from Excel files with automatic mapping, validation, and UPSERT logic.

## Features

- ✅ **Generic Import Engine**: Supports multiple sheet types with configurable mappings
- ✅ **UPSERT Logic**: Automatically inserts new records or updates existing ones
- ✅ **Data Transformation**: Supports multiple transformation types for data normalization
- ✅ **Import Tracking**: All imports are logged in the database with detailed statistics
- ✅ **Error Reporting**: Comprehensive error tracking with row-level details
- ✅ **Admin UI**: User-friendly interface for uploading and managing imports

## Architecture

### Components

1. **Backend Service** (`server/xlsxImportService.ts`)
   - Handles Excel parsing using `xlsx` library
   - Applies column mapping and transformations
   - Performs UPSERT operations using Drizzle ORM
   - Logs all import operations

2. **API Routes** (`server/routes.ts`)
   - `POST /api/import/:sheet` - Import data from a specific sheet
   - `POST /api/import/analyze` - Analyze an Excel file and detect sheets
   - `GET /api/import/logs` - Retrieve import history

3. **Frontend UI** (`client/src/pages/AdminImport.tsx`)
   - File upload interface
   - Sheet selection
   - Real-time import progress and results
   - Import history viewer

4. **Configuration** (`attached_assets/mapping_v1.json`)
   - Defines mappings for each sheet type
   - Specifies UPSERT keys
   - Configures data transformations

5. **Database Schema** (`shared/schema.ts`)
   - `import_logs` table for tracking imports

## Excel File Structure

The reference Excel file is located at: `./data/local/alldatatestimport.xlsx`

### Supported Sheets

#### 1. RH (Resources Humaines / Salaries)

**Excel Columns:**
- `Coast_center` → `coastCenter`
- `Division` → `division`
- `Services` → `services`
- `fonctions` → `poste`
- `code_fonction` → `codeFonction`
- `In_num` → `inNum` (UPSERT key)
- `Names` → `nom` (split into `nom` and `prenom`)
- `salary_tarif` → `tauxHoraire`
- `Acord_sup` → `acordSup`
- `salary_w_month` → `salaryMonth`

**Transformations:**
- Name splitting: `Names` field is automatically split into `nom` (last name) and `prenom` (first name)
- Default status: `statut` is set to "disponible" if not provided
- Competences array: Created from `fonctions` field

#### 2. Meca (Machines / Equipements)

**Excel Columns:**
- `id` → `numeroSerie` (UPSERT key)
- `category` → `categorie`
- `model` → `modele`
- `plate_number` → `immatriculation`
- `year` → `year`
- `status` → `statut` (with mapping)
- `operator_name` → `operatorName`
- `gps_unit` → `gpsUnit`
- `meter_unit` → `meterUnit`
- `fuel_type` → `fuelType`
- `hourly_sal_rate_lei` → `salaireHoraireOperateur`
- `fuel_consumption_100km` → `fuelConsumption`
- `annual_maintenance_cost_lei` → `maintenanceCost`

**Transformations:**
- Name concatenation: `nom` is created from `category` + `model`
- Type copy: `type` is copied from `category`
- Status mapping: Empty/Active → "disponible", Inactive → "en_panne"

#### 3. Chantier (Construction Sites)

**Excel Columns:**
- `ID chantier` → `codeProjet` (UPSERT key)
- `denomination` → `nom`
- `beneficiaire` → `beneficiaire`
- `montant contrat sans tva` → `budgetPrevisionnel`
- `maindoeuvre` → `budgetMainDoeuvre`
- `materiaux` → `budgetMateriaux`
- `equipement` → `budgetEquipement`
- `montant MDO reelle` → `budgetReelMainDoeuvre`
- `achat materiaux` → `budgetReelMateriaux`
- `cout mecanisme` → `budgetReelEquipement`

**Transformations:**
- Default status: `statut` is set to "en_cours"
- Default progression: `progression` is set to 0
- Budget sum: `budgetRealise` is calculated from real budgets

## Mapping Configuration

The mapping is defined in `attached_assets/mapping_v1.json` with the following structure:

```json
{
  "SheetName": {
    "tableName": "database_table_name",
    "upsertKey": "unique_field_name",
    "columnMapping": {
      "Excel Column": "database_field",
      "Another Column": null  // null means ignore
    },
    "transformations": {
      "target_field": {
        "type": "transformation_type",
        // transformation-specific options
      }
    }
  }
}
```

### Supported Transformation Types

1. **split_name**: Split full name into first and last name
   ```json
   {
     "type": "split_name",
     "fields": ["nom", "prenom"]
   }
   ```

2. **default**: Set a default value
   ```json
   {
     "type": "default",
     "value": "disponible"
   }
   ```

3. **array_from_field**: Create array from single field
   ```json
   {
     "type": "array_from_field",
     "sourceField": "fonctions"
   }
   ```

4. **concat**: Concatenate multiple fields
   ```json
   {
     "type": "concat",
     "fields": ["category", "model"],
     "separator": " "
   }
   ```

5. **copy**: Copy value from another field
   ```json
   {
     "type": "copy",
     "sourceField": "category"
   }
   ```

6. **map**: Map values from source to target
   ```json
   {
     "type": "map",
     "sourceField": "status",
     "mapping": {
       "": "disponible",
       "Active": "disponible",
       "Inactive": "en_panne"
     },
     "default": "disponible"
   }
   ```

7. **sum**: Sum multiple numeric fields
   ```json
   {
     "type": "sum",
     "fields": ["field1", "field2", "field3"]
   }
   ```

## UPSERT Logic

The import system uses UPSERT (Update or Insert) logic:

1. **For each row:**
   - Check if a record exists with the same UPSERT key value
   - If exists: UPDATE the record with new data
   - If not exists: INSERT a new record

2. **UPSERT Keys by Sheet:**
   - RH → `inNum` (Employee number)
   - Meca → `numeroSerie` (Serial number, mapped from `id`)
   - Chantier → `codeProjet` (Project code, mapped from `ID chantier`)

## Usage

### Via Admin UI

1. Navigate to **Admin > Import Excel** in the sidebar
2. Click **Upload File** and select your Excel file
3. Click **Analyze File** to detect available sheets
4. Select the sheet you want to import
5. Click **Start Import**
6. Review the import report showing:
   - Rows processed
   - Rows inserted (new records)
   - Rows updated (existing records)
   - Rows ignored (empty/invalid)
   - Errors (with details)

### Via API

#### Analyze File
```bash
curl -X POST http://localhost:5000/api/import/analyze \
  -F "file=@./data/local/alldatatestimport.xlsx"
```

#### Import Sheet
```bash
curl -X POST http://localhost:5000/api/import/RH \
  -F "file=@./data/local/alldatatestimport.xlsx"
```

#### Get Import Logs
```bash
curl http://localhost:5000/api/import/logs
```

## Import Logs

All imports are tracked in the `import_logs` table with:

- `sheetName`: Which sheet was imported
- `fileName`: Original file name
- `status`: 'success', 'partial', or 'failed'
- `rowsProcessed`: Total rows processed
- `rowsInserted`: New records created
- `rowsUpdated`: Existing records updated
- `rowsIgnored`: Rows skipped (empty/invalid)
- `rowsErrored`: Rows with errors
- `errors`: JSON string of error details
- `duration`: Import time in milliseconds
- `createdAt`: Timestamp

## Data Quality & Validation

### Automatic Validations

1. **Required Fields**: UPSERT key must be present
2. **Data Types**: Automatic type conversion for numbers and dates
3. **Empty Values**: Empty strings are converted to NULL
4. **Uniqueness**: UPSERT key must be unique per row

### Error Handling

Errors are captured at row level with:
- Row number (Excel row, 1-indexed with header)
- Field name (if applicable)
- Error message
- Original row data (for debugging)

### Quality Checks

- Duplicate detection by UPSERT key
- Invalid date/number format detection
- Missing required column warnings
- Transformation failures

## Database Schema Changes

The following changes were made to support imports:

```sql
-- New table for import logs
CREATE TABLE import_logs (
  id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
  sheet_name VARCHAR(100) NOT NULL,
  file_name VARCHAR(255) NOT NULL,
  status VARCHAR(50) NOT NULL,
  rows_processed INTEGER NOT NULL DEFAULT 0,
  rows_inserted INTEGER NOT NULL DEFAULT 0,
  rows_updated INTEGER NOT NULL DEFAULT 0,
  rows_ignored INTEGER NOT NULL DEFAULT 0,
  rows_errored INTEGER NOT NULL DEFAULT 0,
  errors TEXT,
  duration INTEGER,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);
```

## Testing Scenarios

### Test 1: Fresh Import (All Inserts)
1. Truncate target table
2. Import sheet
3. Expected: All rows inserted

### Test 2: Update Existing (All Updates)
1. Import same file twice
2. Expected: First import inserts, second import updates

### Test 3: Mixed Import (Insert + Update)
1. Import partial data
2. Modify Excel with new and updated rows
3. Import again
4. Expected: Mix of inserts and updates

### Test 4: Error Handling
1. Create Excel with invalid data
2. Import
3. Expected: Errors reported with row details

### Test 5: Different Sheets
1. Import RH sheet
2. Import Meca sheet
3. Import Chantier sheet
4. Expected: Each imports to correct table

## Troubleshooting

### Issue: Sheet Not Found
- **Cause**: Sheet name doesn't match mapping configuration
- **Solution**: Check sheet name in Excel vs mapping_v1.json

### Issue: UPSERT Key Missing
- **Cause**: Required key column is empty or missing
- **Solution**: Ensure all rows have valid UPSERT key values

### Issue: Transformation Fails
- **Cause**: Invalid data for transformation (e.g., can't split name)
- **Solution**: Check error log for specific row and fix data

### Issue: Import Slow
- **Cause**: Large Excel file or many rows
- **Solution**: Consider batching or importing in chunks

## Future Enhancements

1. **Batch Import**: Support for multiple files at once
2. **Scheduled Imports**: Cron-based automatic imports
3. **Custom Validations**: User-defined validation rules
4. **Export Templates**: Generate Excel templates for import
5. **Preview Mode**: See changes before committing
6. **Rollback**: Undo last import operation
7. **Advanced Mapping UI**: Visual mapping editor
8. **Import from CSV**: Support CSV in addition to Excel

## Security Considerations

1. **File Size Limits**: Configured in multer middleware
2. **File Type Validation**: Only .xlsx and .xls allowed
3. **Input Sanitization**: All data validated before insert
4. **SQL Injection**: Using parameterized queries via Drizzle ORM
5. **Access Control**: Admin-only route (add authentication as needed)

## Maintenance

### Updating Mappings

To add or modify mappings:

1. Edit `attached_assets/mapping_v1.json`
2. Add new sheet configuration or modify existing
3. Restart server to load new configuration
4. Test with sample data

### Adding New Sheets

1. Add sheet configuration to mapping_v1.json
2. Ensure target table exists in schema
3. Define UPSERT key
4. Map columns
5. Add transformations if needed
6. Test import

### Database Migrations

When adding new fields to tables:

1. Update schema in `shared/schema.ts`
2. Run `npm run db:push` to update database
3. Update mapping configuration if needed
4. Update transformations to populate new fields

## Support

For issues or questions:
- Check error logs in `import_logs` table
- Review this documentation
- Check mapping configuration
- Verify Excel file structure
- Test with sample data first
