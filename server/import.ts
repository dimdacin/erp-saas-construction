import * as XLSX from 'xlsx';
import type { InsertEquipement } from '@shared/schema';

export interface ExcelMapping {
  idMachine?: string;
  categorie?: string;
  modele?: string;
  immatriculation?: string;
  consommation?: string;
  salaireOperateur?: string;
  marque?: string;
  type?: string;
  valeurBien?: string;
  amortissement?: string;
}

export function parseExcelToEquipements(fileBuffer: Buffer, mapping?: ExcelMapping): InsertEquipement[] {
  const workbook = XLSX.read(fileBuffer, { type: 'buffer' });
  
  // Chercher la feuille "Machines" ou prendre la première
  const sheetName = workbook.SheetNames.find(name => name.toLowerCase().includes('machine')) || workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];
  
  // Convertir en JSON
  const data: any[] = XLSX.utils.sheet_to_json(worksheet);
  
  if (data.length === 0) {
    throw new Error('Le fichier Excel est vide');
  }

  // Auto-detect column names based on common patterns
  const firstRow = data[0];
  const columnNames = Object.keys(firstRow);
  
  // Log des colonnes détectées pour debug
  console.log('Colonnes détectées dans le fichier Excel:', columnNames);
  console.log('Première ligne de données:', firstRow);
  
  const autoMapping: ExcelMapping = {
    idMachine: columnNames.find(col => 
      col.toLowerCase().includes('id') && col.toLowerCase().includes('machine')
    ),
    categorie: columnNames.find(col => 
      col.toLowerCase().includes('categ') || col.toLowerCase().includes('cat')
    ),
    modele: columnNames.find(col => 
      col.toLowerCase().includes('modele') || col.toLowerCase().includes('model')
    ),
    immatriculation: columnNames.find(col => 
      col.toLowerCase().includes('immat') || col.toLowerCase().includes('plaque')
    ),
    consommation: columnNames.find(col => 
      col.toLowerCase().includes('conso') || col.toLowerCase().includes('gasoil')
    ),
    salaireOperateur: columnNames.find(col => 
      (col.toLowerCase().includes('salaire') || col.toLowerCase().includes('sal')) && 
      (col.toLowerCase().includes('op') || col.toLowerCase().includes('horaire'))
    ),
    marque: columnNames.find(col => 
      col.toLowerCase().includes('marque') || col.toLowerCase().includes('fabricant')
    ),
    type: columnNames.find(col => 
      col.toLowerCase().includes('type') && !col.toLowerCase().includes('categ')
    ),
  };

  const finalMapping = { ...autoMapping, ...mapping };

  const equipements: InsertEquipement[] = data.map((row, index) => {
    try {
      // Extraire les valeurs selon le mapping
      const idMachine = finalMapping.idMachine ? String(row[finalMapping.idMachine] || '') : '';
      const categorie = finalMapping.categorie ? String(row[finalMapping.categorie] || '') : '';
      const modele = finalMapping.modele ? String(row[finalMapping.modele] || '') : '';
      const immatriculation = finalMapping.immatriculation ? String(row[finalMapping.immatriculation] || '') : '';
      const marque = finalMapping.marque ? String(row[finalMapping.marque] || '') : '';
      const type = finalMapping.type ? String(row[finalMapping.type] || categorie) : categorie;

      // Consommation et salaire - convertir en nombres
      const consommationStr = finalMapping.consommation ? String(row[finalMapping.consommation] || '0') : '0';
      const salaireStr = finalMapping.salaireOperateur ? String(row[finalMapping.salaireOperateur] || '0') : '0';
      
      const consommation = parseFloat(consommationStr.replace(',', '.').replace(/[^\d.-]/g, '')) || null;
      const salaire = parseFloat(salaireStr.replace(',', '.').replace(/[^\d.-]/g, '')) || null;

      // Construire le nom de l'équipement
      const nom = idMachine || modele || `Équipement ${index + 1}`;

      const equipement: InsertEquipement = {
        nom,
        type: type || 'Autre',
        categorie: categorie || null,
        marque: marque || null,
        modele: modele || null,
        numeroSerie: idMachine || null,
        immatriculation: immatriculation || null,
        statut: 'disponible',
        localisation: null,
        dateAchat: null,
        coutJournalier: null,
        consommationGasoilHeure: consommation ? String(consommation) : null,
        salaireHoraireOperateur: salaire ? String(salaire) : null,
      };

      return equipement;
    } catch (error) {
      console.error(`Erreur lors du traitement de la ligne ${index + 1}:`, error);
      throw new Error(`Erreur à la ligne ${index + 1}: ${error}`);
    }
  });

  return equipements.filter(eq => eq.nom && eq.nom.trim() !== '');
}
