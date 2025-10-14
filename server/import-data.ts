import XLSX from 'xlsx';
import { db } from './db';
import { salaries, equipements, chantiers } from '@shared/schema';

function splitName(fullName: string): { nom: string; prenom: string } {
  const parts = fullName.trim().split(/\s+/);
  if (parts.length === 1) {
    return { nom: parts[0], prenom: '' };
  }
  const nom = parts[0];
  const prenom = parts.slice(1).join(' ');
  return { nom, prenom };
}

function parseDecimal(value: any): string | undefined {
  if (value === undefined || value === null || value === '') return undefined;
  const num = typeof value === 'number' ? value : parseFloat(String(value).replace(',', '.'));
  return isNaN(num) ? undefined : num.toString();
}

async function importData() {
  console.log('📂 Lecture du fichier Excel...');
  const workbook = XLSX.readFile('attached_assets/alldata_1760432983033.xlsx');

  // Import Salariés (RH)
  console.log('\n👥 Import des salariés...');
  const rhSheet = workbook.Sheets['RH'];
  const rhData = XLSX.utils.sheet_to_json(rhSheet, { defval: '' }) as any[];
  
  const salariesData = rhData.map(row => {
    const { nom, prenom } = splitName(row.Names || '');
    return {
      nom,
      prenom,
      poste: row.fonctions || '',
      coastCenter: row.Coast_center || null,
      division: row.Division || null,
      services: row.Services || null,
      codeFonction: row.code_fonction || null,
      inNum: row.In_num || null,
      tauxHoraire: parseDecimal(row[' Salary_h '] || row.Salary_h),
      salaryMonth: parseDecimal(row.salary_w_month),
      acordSup: parseDecimal(row.Acord_sup),
      statut: 'disponible',
    };
  });

  const insertedSalaries = await db.insert(salaries).values(salariesData).returning();
  console.log(`✅ ${insertedSalaries.length} salariés importés`);

  // Créer un index nom complet -> ID pour matching
  const salariesMap = new Map<string, string>();
  insertedSalaries.forEach(s => {
    const fullName = `${s.nom} ${s.prenom}`.trim().toUpperCase();
    salariesMap.set(fullName, s.id);
  });

  // Import Équipements (Meca)
  console.log('\n🚜 Import des équipements...');
  const mecaSheet = workbook.Sheets['Meca'];
  const mecaData = XLSX.utils.sheet_to_json(mecaSheet, { defval: '' }) as any[];

  const equipementsData = mecaData.map(row => {
    const operatorName = (row.operator_name || '').trim();
    const operatorId = operatorName && operatorName !== 'not assined' && operatorName !== 'not assigned'
      ? salariesMap.get(operatorName.toUpperCase()) || null
      : null;

    return {
      nom: row.model || row.id || 'Équipement sans nom',
      type: row.category || 'Non spécifié',
      categorie: row.category || null,
      modele: row.model || null,
      immatriculation: row.plate_number || null,
      numeroSerie: row.id || null,
      operatorId,
      operatorName: operatorName || null,
      year: row.year ? parseInt(row.year) : null,
      fuelType: row.fuel_type || null,
      gpsUnit: row.gps_unit || null,
      meterUnit: row.meter_unit || null,
      hourlyRate: parseDecimal(row.hourly_sal_rate_lei),
      fuelConsumption: parseDecimal(row.fuel_consumption_100km),
      maintenanceCost: parseDecimal(row.annual_maintenance_cost_lei),
      statut: row.status || 'disponible',
    };
  });

  const insertedEquipements = await db.insert(equipements).values(equipementsData).returning();
  console.log(`✅ ${insertedEquipements.length} équipements importés`);
  console.log(`   - ${equipementsData.filter(e => e.operatorId).length} avec opérateur assigné`);

  // Import Chantiers
  console.log('\n🏗️  Import des chantiers...');
  const chantierSheet = workbook.Sheets['Chantier'];
  const chantierData = XLSX.utils.sheet_to_json(chantierSheet, { defval: '' }) as any[];

  const chantiersData = chantierData.map(row => {
    const responsableName = (row['Responsable chantier'] || '').trim();
    const responsableId = responsableName 
      ? salariesMap.get(responsableName.toUpperCase()) || null
      : null;

    return {
      codeProjet: row['ID chantier'] ? String(row['ID chantier']) : null,
      nom: row.denomination || 'Chantier sans nom',
      beneficiaire: row.beneficiaire || null,
      responsableId,
      statut: 'en_cours',
      budgetPrevisionnel: parseDecimal(row[' montant contrat sans tva '] || row['montant contrat sans tva']) || '0',
      budgetMainDoeuvre: parseDecimal(row[' maindoeuvre '] || row.maindoeuvre),
      budgetMateriaux: parseDecimal(row[' materiaux '] || row.materiaux),
      budgetEquipement: parseDecimal(row[' equipement '] || row.equipement),
      budgetReelMainDoeuvre: parseDecimal(row[' montant MDO reelle '] || row['montant MDO reelle']),
      budgetReelMateriaux: parseDecimal(row[' achat materiaux '] || row['achat materiaux']),
      budgetReelEquipement: parseDecimal(row[' cout mecanisme '] || row['cout mecanisme']),
      budgetRealise: parseDecimal(row[' charges directe reelle '] || row['charges directe reelle']) || '0',
    };
  });

  const insertedChantiers = await db.insert(chantiers).values(chantiersData).returning();
  console.log(`✅ ${insertedChantiers.length} chantiers importés`);

  console.log('\n✨ Import terminé avec succès !');
  console.log('\nRésumé:');
  console.log(`  👥 Salariés:    ${insertedSalaries.length}`);
  console.log(`  🚜 Équipements: ${insertedEquipements.length}`);
  console.log(`  🏗️  Chantiers:   ${insertedChantiers.length}`);
}

importData()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('❌ Erreur lors de l\'import:', error);
    process.exit(1);
  });
