import * as XLSX from 'xlsx';
import { db } from './db';
import { chantiers, salaries, equipements, importLogs } from '@shared/schema';
import { eq } from 'drizzle-orm';
import fs from 'fs';
import path from 'path';

interface ColumnMapping {
  [excelColumn: string]: string | null;
}

interface Transformation {
  type: 'split_name' | 'default' | 'array_from_field' | 'concat' | 'copy' | 'map' | 'sum';
  fields?: string[];
  sourceField?: string;
  value?: any;
  separator?: string;
  mapping?: { [key: string]: any };
  default?: any;
}

interface SheetMapping {
  tableName: string;
  upsertKey: string;
  columnMapping: ColumnMapping;
  transformations?: { [targetField: string]: Transformation };
}

interface ImportMapping {
  [sheetName: string]: SheetMapping;
}

interface ImportResult {
  success: boolean;
  sheetName: string;
  rowsProcessed: number;
  rowsInserted: number;
  rowsUpdated: number;
  rowsIgnored: number;
  rowsErrored: number;
  errors: Array<{ row: number; field?: string; message: string; data?: any }>;
  duration: number;
}

export class XlsxImportService {
  private mapping: ImportMapping;

  constructor(mappingPath?: string) {
    const defaultMappingPath = path.join(process.cwd(), 'attached_assets', 'mapping_v1.json');
    const finalPath = mappingPath || defaultMappingPath;
    
    if (!fs.existsSync(finalPath)) {
      throw new Error(`Mapping file not found: ${finalPath}`);
    }
    
    this.mapping = JSON.parse(fs.readFileSync(finalPath, 'utf-8'));
  }

  async importSheet(
    fileBuffer: Buffer,
    sheetName: string,
    fileName: string = 'upload.xlsx'
  ): Promise<ImportResult> {
    const startTime = Date.now();
    const result: ImportResult = {
      success: true,
      sheetName,
      rowsProcessed: 0,
      rowsInserted: 0,
      rowsUpdated: 0,
      rowsIgnored: 0,
      rowsErrored: 0,
      errors: [],
      duration: 0,
    };

    try {
      // Parse Excel file
      const workbook = XLSX.read(fileBuffer, { type: 'buffer' });
      
      if (!workbook.SheetNames.includes(sheetName)) {
        throw new Error(`Sheet "${sheetName}" not found in Excel file. Available sheets: ${workbook.SheetNames.join(', ')}`);
      }

      const sheetMapping = this.mapping[sheetName];
      if (!sheetMapping) {
        throw new Error(`No mapping configuration found for sheet "${sheetName}"`);
      }

      const worksheet = workbook.Sheets[sheetName];
      const rawData: any[] = XLSX.utils.sheet_to_json(worksheet, { defval: '' });

      console.log(`Processing sheet "${sheetName}" with ${rawData.length} rows`);

      // Process each row
      for (let i = 0; i < rawData.length; i++) {
        const row = rawData[i];
        result.rowsProcessed++;

        try {
          const transformedRow = this.transformRow(row, sheetMapping);
          
          // Validate required fields
          if (!transformedRow || Object.keys(transformedRow).length === 0) {
            result.rowsIgnored++;
            continue;
          }

          // UPSERT logic
          const upserted = await this.upsertRow(transformedRow, sheetMapping);
          
          if (upserted.isNew) {
            result.rowsInserted++;
          } else {
            result.rowsUpdated++;
          }
        } catch (error: any) {
          result.rowsErrored++;
          result.errors.push({
            row: i + 2, // +2 for Excel row number (1-indexed + header)
            message: error.message || 'Unknown error',
            data: row,
          });
          console.error(`Error processing row ${i + 2}:`, error);
        }
      }

      result.duration = Date.now() - startTime;
      result.success = result.rowsErrored === 0;

      // Log import to database
      await this.logImport(fileName, result);

      return result;
    } catch (error: any) {
      result.success = false;
      result.errors.push({
        row: 0,
        message: error.message || 'Fatal error during import',
      });
      result.duration = Date.now() - startTime;

      // Log failed import
      await this.logImport(fileName, result);

      throw error;
    }
  }

  private transformRow(row: any, sheetMapping: SheetMapping): any {
    const transformed: any = {};

    // Apply column mapping
    for (const [excelCol, dbCol] of Object.entries(sheetMapping.columnMapping)) {
      if (dbCol && row[excelCol] !== undefined) {
        let value = row[excelCol];
        
        // Clean empty strings
        if (value === '') {
          value = null;
        }

        transformed[dbCol] = value;
      }
    }

    // Apply transformations
    if (sheetMapping.transformations) {
      for (const [targetField, transformation] of Object.entries(sheetMapping.transformations)) {
        transformed[targetField] = this.applyTransformation(row, transformed, transformation);
      }
    }

    return transformed;
  }

  private applyTransformation(originalRow: any, transformedRow: any, transformation: Transformation): any {
    switch (transformation.type) {
      case 'split_name':
        if (transformation.fields && transformation.fields.length === 2) {
          const fullName = transformedRow[transformation.fields[0]] || originalRow.Names || '';
          const parts = fullName.trim().split(/\s+/);
          if (parts.length >= 2) {
            const prenom = parts.pop() || '';
            const nom = parts.join(' ');
            transformedRow[transformation.fields[0]] = nom;
            transformedRow[transformation.fields[1]] = prenom;
            return nom;
          }
          transformedRow[transformation.fields[0]] = fullName;
          transformedRow[transformation.fields[1]] = '';
          return fullName;
        }
        return null;

      case 'default':
        return transformation.value;

      case 'array_from_field':
        if (transformation.sourceField) {
          const value = originalRow[transformation.sourceField] || '';
          return value ? [value] : [];
        }
        return [];

      case 'concat':
        if (transformation.fields) {
          const values = transformation.fields
            .map(field => transformedRow[field] || originalRow[field] || '')
            .filter(v => v);
          return values.join(transformation.separator || ' ');
        }
        return '';

      case 'copy':
        if (transformation.sourceField) {
          return transformedRow[transformation.sourceField] || originalRow[transformation.sourceField] || null;
        }
        return null;

      case 'map':
        if (transformation.sourceField && transformation.mapping) {
          const sourceValue = transformedRow[transformation.sourceField] || originalRow[transformation.sourceField] || '';
          return transformation.mapping[sourceValue] || transformation.default || sourceValue;
        }
        return transformation.default || null;

      case 'sum':
        if (transformation.fields) {
          return transformation.fields.reduce((sum, field) => {
            const value = parseFloat(transformedRow[field]) || 0;
            return sum + value;
          }, 0);
        }
        return 0;

      default:
        return null;
    }
  }

  private async upsertRow(data: any, sheetMapping: SheetMapping): Promise<{ isNew: boolean; record: any }> {
    const { tableName, upsertKey } = sheetMapping;
    const upsertValue = data[upsertKey];

    if (!upsertValue) {
      throw new Error(`UPSERT key "${upsertKey}" is missing or empty in row data`);
    }

    // Select table
    let table;
    let keyColumn;
    
    switch (tableName) {
      case 'chantiers':
        table = chantiers;
        keyColumn = chantiers.codeProjet;
        break;
      case 'salaries':
        table = salaries;
        keyColumn = salaries.inNum;
        break;
      case 'equipements':
        table = equipements;
        keyColumn = equipements.numeroSerie;
        break;
      default:
        throw new Error(`Unknown table: ${tableName}`);
    }

    // Check if record exists
    const existing = await db.select().from(table).where(eq(keyColumn, String(upsertValue))).limit(1);

    if (existing.length > 0) {
      // UPDATE
      const updated = await db.update(table).set(data).where(eq(keyColumn, String(upsertValue))).returning();
      return { isNew: false, record: updated[0] };
    } else {
      // INSERT
      const inserted = await db.insert(table).values(data).returning();
      return { isNew: true, record: inserted[0] };
    }
  }

  private async logImport(fileName: string, result: ImportResult): Promise<void> {
    try {
      const status = result.success ? 'success' : (result.rowsInserted > 0 || result.rowsUpdated > 0 ? 'partial' : 'failed');
      
      await db.insert(importLogs).values({
        sheetName: result.sheetName,
        fileName,
        status,
        rowsProcessed: result.rowsProcessed,
        rowsInserted: result.rowsInserted,
        rowsUpdated: result.rowsUpdated,
        rowsIgnored: result.rowsIgnored,
        rowsErrored: result.rowsErrored,
        errors: result.errors.length > 0 ? JSON.stringify(result.errors) : null,
        duration: result.duration,
      });
    } catch (error) {
      console.error('Error logging import:', error);
    }
  }

  getAvailableSheets(fileBuffer: Buffer): string[] {
    const workbook = XLSX.read(fileBuffer, { type: 'buffer' });
    return workbook.SheetNames.filter(name => this.mapping[name] !== undefined);
  }

  getSheetColumns(fileBuffer: Buffer, sheetName: string): string[] {
    const workbook = XLSX.read(fileBuffer, { type: 'buffer' });
    
    if (!workbook.SheetNames.includes(sheetName)) {
      throw new Error(`Sheet "${sheetName}" not found`);
    }

    const worksheet = workbook.Sheets[sheetName];
    const data: any[] = XLSX.utils.sheet_to_json(worksheet, { defval: '' });
    
    if (data.length > 0) {
      return Object.keys(data[0]);
    }
    
    return [];
  }
}
