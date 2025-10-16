#!/usr/bin/env node

/**
 * Script to validate Excel file structure before import
 * Usage: node server/validateExcel.js [path-to-excel]
 */

import pkg from 'xlsx';
const { readFile, utils } = pkg;
import fs from 'fs';
import path from 'path';

const DEFAULT_EXCEL_PATH = './data/local/alldatatestimport.xlsx';

// Expected structure based on mapping
const EXPECTED_SHEETS = {
  RH: {
    requiredColumns: ['In_num', 'Names', 'fonctions'],
    optionalColumns: ['Coast_center', 'Division', 'Services', 'code_fonction', 'salary_tarif', 'Acord_sup', 'salary_w_month']
  },
  Meca: {
    requiredColumns: ['id', 'category', 'model'],
    optionalColumns: ['plate_number', 'year', 'status', 'operator_name', 'gps_unit', 'meter_unit', 'fuel_type']
  },
  Chantier: {
    requiredColumns: ['ID chantier', 'denomination'],
    optionalColumns: ['beneficiaire', ' montant contrat sans tva ', ' maindoeuvre ', ' materiaux ', ' equipement ']
  }
};

function validateExcel(filePath) {
  console.log(`\n🔍 Validating Excel file: ${filePath}\n`);

  if (!fs.existsSync(filePath)) {
    console.error(`❌ File not found: ${filePath}`);
    process.exit(1);
  }

  const workbook = readFile(filePath);
  const results = {
    valid: true,
    issues: [],
    warnings: [],
    sheets: {}
  };

  // Check each expected sheet
  for (const [sheetName, config] of Object.entries(EXPECTED_SHEETS)) {
    console.log(`\n📋 Checking sheet: ${sheetName}`);
    
    if (!workbook.SheetNames.includes(sheetName)) {
      results.valid = false;
      results.issues.push(`Sheet "${sheetName}" not found`);
      console.log(`  ❌ Sheet not found`);
      continue;
    }

    const worksheet = workbook.Sheets[sheetName];
    const data = utils.sheet_to_json(worksheet, { defval: '' });
    
    if (data.length === 0) {
      results.warnings.push(`Sheet "${sheetName}" is empty`);
      console.log(`  ⚠️  Sheet is empty`);
      continue;
    }

    const columns = Object.keys(data[0]);
    const sheetResult = {
      rows: data.length,
      columns: columns.length,
      missingRequired: [],
      missingOptional: [],
      extraColumns: [],
      duplicateKeys: [],
      emptyKeys: []
    };

    // Check required columns
    for (const reqCol of config.requiredColumns) {
      if (!columns.includes(reqCol)) {
        results.valid = false;
        sheetResult.missingRequired.push(reqCol);
      }
    }

    // Check optional columns (warnings only)
    for (const optCol of config.optionalColumns) {
      if (!columns.includes(optCol)) {
        sheetResult.missingOptional.push(optCol);
      }
    }

    // Check for extra columns
    const expectedColumns = [...config.requiredColumns, ...config.optionalColumns];
    for (const col of columns) {
      if (!expectedColumns.includes(col) && !col.startsWith('__EMPTY')) {
        sheetResult.extraColumns.push(col);
      }
    }

    // Get UPSERT key based on sheet
    const upsertKey = sheetName === 'RH' ? 'In_num' : 
                      sheetName === 'Meca' ? 'id' : 'ID chantier';

    // Check for duplicate UPSERT keys
    const keyValues = data.map(row => row[upsertKey]).filter(v => v !== '' && v !== null && v !== undefined);
    const uniqueKeys = new Set(keyValues);
    if (keyValues.length !== uniqueKeys.size) {
      const duplicates = keyValues.filter((item, index) => keyValues.indexOf(item) !== index);
      sheetResult.duplicateKeys = [...new Set(duplicates)];
    }

    // Check for empty UPSERT keys
    const emptyKeyRows = data
      .map((row, idx) => ({ row: idx + 2, key: row[upsertKey] }))
      .filter(item => !item.key || item.key === '')
      .map(item => item.row);
    
    sheetResult.emptyKeys = emptyKeyRows;

    results.sheets[sheetName] = sheetResult;

    // Display results
    console.log(`  ✅ Rows: ${sheetResult.rows}`);
    console.log(`  ✅ Columns: ${sheetResult.columns}`);
    
    if (sheetResult.missingRequired.length > 0) {
      results.valid = false;
      console.log(`  ❌ Missing required columns: ${sheetResult.missingRequired.join(', ')}`);
    }
    
    if (sheetResult.missingOptional.length > 0) {
      console.log(`  ⚠️  Missing optional columns: ${sheetResult.missingOptional.join(', ')}`);
    }
    
    if (sheetResult.extraColumns.length > 0) {
      console.log(`  ℹ️  Extra columns (will be ignored): ${sheetResult.extraColumns.slice(0, 5).join(', ')}${sheetResult.extraColumns.length > 5 ? '...' : ''}`);
    }
    
    if (sheetResult.duplicateKeys.length > 0) {
      results.valid = false;
      console.log(`  ❌ Duplicate UPSERT keys found: ${sheetResult.duplicateKeys.slice(0, 5).join(', ')}${sheetResult.duplicateKeys.length > 5 ? `... (+${sheetResult.duplicateKeys.length - 5} more)` : ''}`);
    }
    
    if (sheetResult.emptyKeys.length > 0) {
      results.valid = false;
      console.log(`  ❌ Empty UPSERT keys at rows: ${sheetResult.emptyKeys.slice(0, 5).join(', ')}${sheetResult.emptyKeys.length > 5 ? `... (+${sheetResult.emptyKeys.length - 5} more)` : ''}`);
    }
  }

  // Summary
  console.log('\n' + '='.repeat(50));
  if (results.valid) {
    console.log('✅ VALIDATION PASSED - File is ready for import');
  } else {
    console.log('❌ VALIDATION FAILED - Please fix issues before importing');
  }
  console.log('='.repeat(50) + '\n');

  return results;
}

// Run validation
const excelPath = process.argv[2] || DEFAULT_EXCEL_PATH;
const result = validateExcel(excelPath);

process.exit(result.valid ? 0 : 1);
