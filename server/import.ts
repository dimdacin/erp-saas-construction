import * as XLSX from 'xlsx';
import type { InsertEquipement, InsertChantier, InsertSalarie } from '@shared/schema';

export interface ExcelMapping {
  idMachine?: string;
  categorie?: string;
  modele?: string;
  immatriculation?: string;
  consommation?: string;
  salaireOperateur?: string;
  marque?: string;
  type?: string;
  year?: string;
  status?: string;
  operatorName?: string;
  gpsUnit?: string;
  meterUnit?: string;
  fuelType?: string;
  hourlyRate?: string;
  fuelConsumption?: string;
  maintenanceCost?: string;
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
      col.toLowerCase() === 'id' || 
      (col.toLowerCase().includes('id') && col.toLowerCase().includes('machine'))
    ),
    categorie: columnNames.find(col => 
      col.toLowerCase() === 'category' ||
      col.toLowerCase().includes('categ') || 
      col.toLowerCase().includes('cat')
    ),
    modele: columnNames.find(col => 
      col.toLowerCase() === 'model' ||
      col.toLowerCase().includes('modele')
    ),
    immatriculation: columnNames.find(col => 
      col.toLowerCase() === 'plate_number' ||
      col.toLowerCase().includes('plate') ||
      col.toLowerCase().includes('immat') || 
      col.toLowerCase().includes('plaque')
    ),
    consommation: columnNames.find(col => 
      col.toLowerCase().includes('fuel_consumption') ||
      col.toLowerCase().includes('conso') || 
      col.toLowerCase().includes('gasoil')
    ),
    salaireOperateur: columnNames.find(col => 
      col.toLowerCase().includes('hourly_rate') ||
      (col.toLowerCase().includes('salaire') || col.toLowerCase().includes('sal')) && 
      (col.toLowerCase().includes('op') || col.toLowerCase().includes('horaire'))
    ),
    marque: columnNames.find(col => 
      col.toLowerCase().includes('marque') || 
      col.toLowerCase().includes('fabricant') ||
      col.toLowerCase().includes('brand')
    ),
    type: columnNames.find(col => 
      col.toLowerCase().includes('type') && !col.toLowerCase().includes('categ')
    ),
    year: columnNames.find(col => col.toLowerCase() === 'year' || col.toLowerCase().includes('annee')),
    status: columnNames.find(col => col.toLowerCase() === 'status' || col.toLowerCase().includes('statut')),
    operatorName: columnNames.find(col => col.toLowerCase().includes('operator_name') || col.toLowerCase().includes('operateur')),
    gpsUnit: columnNames.find(col => col.toLowerCase().includes('gps')),
    meterUnit: columnNames.find(col => col.toLowerCase().includes('meter')),
    fuelType: columnNames.find(col => col.toLowerCase().includes('fuel_type') || col.toLowerCase().includes('carburant')),
    hourlyRate: columnNames.find(col => col.toLowerCase().includes('hourly_rate') || col.toLowerCase().includes('tarif_horaire')),
    fuelConsumption: columnNames.find(col => col.toLowerCase().includes('fuel_consumption')),
    maintenanceCost: columnNames.find(col => col.toLowerCase().includes('maintenance_cost') || col.toLowerCase().includes('maintenance')),
  };

  const finalMapping = { ...autoMapping, ...mapping };
  
  console.log('Final mapping:', finalMapping);

  const equipements: InsertEquipement[] = data.map((row, index) => {
    try {
      // Extraire les valeurs selon le mapping
      const idMachine = finalMapping.idMachine ? String(row[finalMapping.idMachine] || '') : '';
      const categorie = finalMapping.categorie ? String(row[finalMapping.categorie] || '') : '';
      const modele = finalMapping.modele ? String(row[finalMapping.modele] || '') : '';
      const immatriculation = finalMapping.immatriculation ? String(row[finalMapping.immatriculation] || '') : '';
      const marque = finalMapping.marque ? String(row[finalMapping.marque] || '') : '';
      const type = finalMapping.type ? String(row[finalMapping.type] || categorie) : categorie;
      const year = finalMapping.year ? parseInt(String(row[finalMapping.year]).replace(/[^\d-]/g, '')) || null : null;
      const operatorName = finalMapping.operatorName ? String(row[finalMapping.operatorName] || '') : '';
      const gpsUnit = finalMapping.gpsUnit ? String(row[finalMapping.gpsUnit] || '') : '';
      const meterUnit = finalMapping.meterUnit ? String(row[finalMapping.meterUnit] || '') : '';
      const fuelType = finalMapping.fuelType ? String(row[finalMapping.fuelType] || '') : '';

      // Consommation et salaire - convertir en nombres
      const consommationStr = finalMapping.consommation ? String(row[finalMapping.consommation] || '0') : '0';
      const salaireStr = finalMapping.salaireOperateur ? String(row[finalMapping.salaireOperateur] || '0') : '0';
      const hourlyRateStr = finalMapping.hourlyRate ? String(row[finalMapping.hourlyRate] || '0') : '0';
      const fuelConsumptionStr = finalMapping.fuelConsumption ? String(row[finalMapping.fuelConsumption] || '0') : '0';
      const maintenanceCostStr = finalMapping.maintenanceCost ? String(row[finalMapping.maintenanceCost] || '0') : '0';
      
      const consommation = parseFloat(consommationStr.replace(',', '.').replace(/[^\d.-]/g, '')) || null;
      const salaire = parseFloat(salaireStr.replace(',', '.').replace(/[^\d.-]/g, '')) || null;
      const hourlyRate = parseFloat(hourlyRateStr.replace(',', '.').replace(/[^\d.-]/g, '')) || null;
      const fuelConsumption = parseFloat(fuelConsumptionStr.replace(',', '.').replace(/[^\d.-]/g, '')) || null;
      const maintenanceCost = parseFloat(maintenanceCostStr.replace(',', '.').replace(/[^\d.-]/g, '')) || null;

      // Construire le nom de l'équipement
      const nom = idMachine || modele || `Équipement ${index + 1}`;

      // Déterminer le statut (mapping du format standardisé)
      const statusFromExcel = finalMapping.status ? row[finalMapping.status] : (row['status'] || '');
      let statut = 'disponible';
      if (statusFromExcel.toLowerCase() === 'active') {
        statut = 'disponible';
      } else if (statusFromExcel.toLowerCase().includes('maintenance')) {
        statut = 'maintenance';
      } else if (statusFromExcel.toLowerCase().includes('out') || statusFromExcel.toLowerCase().includes('hors')) {
        statut = 'hors_service';
      }

      const equipement: InsertEquipement = {
        nom,
        type: type || categorie || 'Autre',
        categorie: categorie || null,
        marque: marque || null,
        modele: modele || null,
        numeroSerie: idMachine || null,
        immatriculation: immatriculation || null,
        statut: statut,
        localisation: null,
        dateAchat: null,
        coutJournalier: null,
        consommationGasoilHeure: consommation ? String(consommation) : null,
        salaireHoraireOperateur: salaire ? String(salaire) : null,
        operatorName: operatorName || null,
        year: year,
        fuelType: fuelType || null,
        gpsUnit: gpsUnit || null,
        meterUnit: meterUnit || null,
        hourlyRate: hourlyRate ? String(hourlyRate) : null,
        fuelConsumption: fuelConsumption ? String(fuelConsumption) : null,
        maintenanceCost: maintenanceCost ? String(maintenanceCost) : null,
      };

      return equipement;
    } catch (error) {
      console.error(`Erreur lors du traitement de la ligne ${index + 1}:`, error);
      throw new Error(`Erreur à la ligne ${index + 1}: ${error}`);
    }
  });

  return equipements.filter(eq => eq.nom && eq.nom.trim() !== '');
}

// Interface pour le mapping des chantiers
export interface ChantiersMapping {
  codeProjet?: string;
  nom?: string;
  beneficiaire?: string;
  statut?: string;
  budgetPrevisionnel?: string;
  budgetMainDoeuvre?: string;
  budgetMateriaux?: string;
  budgetEquipement?: string;
  dateDebut?: string;
  dateLimite?: string;
  description?: string;
}

// Interface pour le mapping des salariés
export interface SalariesMapping {
  nom?: string;
  prenom?: string;
  poste?: string;
  competences?: string;
  telephone?: string;
  email?: string;
  statut?: string;
  tauxHoraire?: string;
  coastCenter?: string;
  division?: string;
  services?: string;
  codeFonction?: string;
  inNum?: string;
  salaryMonth?: string;
  salaryTarif?: string; // alias: salary_tarif
  salaryH?: string; // alias: Salary_h
  acordSup?: string; // alias: Acord_sup
}

export function parseExcelToChantiers(fileBuffer: Buffer, mapping?: ChantiersMapping): InsertChantier[] {
  const workbook = XLSX.read(fileBuffer, { type: 'buffer' });
  
  // Chercher la feuille "Chantiers" ou "Projets"
  const sheetName = workbook.SheetNames.find(name => 
    name.toLowerCase().includes('chantier') || 
    name.toLowerCase().includes('projet')
  ) || workbook.SheetNames[0];
  
  const worksheet = workbook.Sheets[sheetName];
  const data: any[] = XLSX.utils.sheet_to_json(worksheet);
  
  if (data.length === 0) {
    throw new Error('Le fichier Excel est vide');
  }

  const columnNames = Object.keys(data[0]);
  console.log('Colonnes détectées pour chantiers:', columnNames);

  const autoMapping: ChantiersMapping = {
    codeProjet: columnNames.find(col => 
      col.toLowerCase().includes('code') || 
      col.toLowerCase().includes('ref') ||
      (col.toLowerCase().includes('id') && col.toLowerCase().includes('chantier'))
    ),
    nom: columnNames.find(col => 
      col.toLowerCase().includes('nom') || 
      col.toLowerCase().includes('title') ||
      col.toLowerCase().includes('projet') ||
      col.toLowerCase().includes('denomination')
    ),
    beneficiaire: columnNames.find(col => 
      col.toLowerCase().includes('client') || 
      col.toLowerCase().includes('beneficiaire')
    ),
    statut: columnNames.find(col => 
      col.toLowerCase().includes('statut') || 
      col.toLowerCase().includes('status')
    ),
    budgetPrevisionnel: columnNames.find(col => 
      (col.toLowerCase().includes('budget') && (col.toLowerCase().includes('total') || col.toLowerCase().includes('prev'))) ||
      (col.toLowerCase().includes('montant') && (col.toLowerCase().includes('contrat') || col.toLowerCase().includes('tva')))
    ),
    dateDebut: columnNames.find(col => 
      col.toLowerCase().includes('debut') || 
      col.toLowerCase().includes('start')
    ),
    dateLimite: columnNames.find(col => 
      col.toLowerCase().includes('fin') || 
      col.toLowerCase().includes('limite') ||
      col.toLowerCase().includes('end')
    ),
  };

  const finalMapping = { ...autoMapping, ...mapping };

  const chantiers: InsertChantier[] = data.map((row, index) => {
    try {
      const nom = finalMapping.nom ? String(row[finalMapping.nom] || '') : `Chantier ${index + 1}`;
      const codeProjet = finalMapping.codeProjet ? String(row[finalMapping.codeProjet] || '') : null;
      const beneficiaire = finalMapping.beneficiaire ? String(row[finalMapping.beneficiaire] || '') : null;
      const description = finalMapping.description ? String(row[finalMapping.description] || '') : null;
      
      // Statut par défaut
      let statut = 'en_cours';
      if (finalMapping.statut && row[finalMapping.statut]) {
        const statusValue = String(row[finalMapping.statut]).toLowerCase();
        if (statusValue.includes('termine') || statusValue.includes('fini')) {
          statut = 'termine';
        } else if (statusValue.includes('attente') || statusValue.includes('planifie')) {
          statut = 'planifie';
        } else if (statusValue.includes('annule')) {
          statut = 'annule';
        }
      }

      // Budget prévisionnel (obligatoire)
      const budgetStr = finalMapping.budgetPrevisionnel ? String(row[finalMapping.budgetPrevisionnel] || '0') : '0';
      const budgetPrevisionnel = parseFloat(budgetStr.replace(',', '.').replace(/[^\d.-]/g, '')) || 0;

      const chantier: InsertChantier = {
        codeProjet,
        nom,
        statut,
        beneficiaire,
        responsableId: null, // À assigner manuellement après import des salariés
        budgetPrevisionnel: String(budgetPrevisionnel),
        budgetMainDoeuvre: null,
        budgetMateriaux: null,
        budgetEquipement: null,
        budgetReelMainDoeuvre: null,
        budgetReelMateriaux: null,
        budgetReelEquipement: null,
        dateDebut: null, // Sera parsé si présent
        dateLimite: null, // Sera parsé si présent
        description,
      };

      return chantier;
    } catch (error) {
      console.error(`Erreur lors du traitement du chantier ligne ${index + 1}:`, error);
      throw new Error(`Erreur à la ligne ${index + 1}: ${error}`);
    }
  });

  return chantiers.filter(ch => ch.nom && ch.nom.trim() !== '');
}

export function parseExcelToSalaries(fileBuffer: Buffer, mapping?: SalariesMapping): InsertSalarie[] {
  const workbook = XLSX.read(fileBuffer, { type: 'buffer' });
  
  // Chercher la feuille "Salariés" ou "Personnel"
  const sheetName = workbook.SheetNames.find(name => 
    name.toLowerCase().includes('salarie') || 
    name.toLowerCase().includes('personnel') ||
    name.toLowerCase().includes('employe')
  ) || workbook.SheetNames[0];
  
  const worksheet = workbook.Sheets[sheetName];
  const data: any[] = XLSX.utils.sheet_to_json(worksheet);
  
  if (data.length === 0) {
    throw new Error('Le fichier Excel est vide');
  }

  const columnNames = Object.keys(data[0]);
  console.log('Colonnes détectées pour salariés:', columnNames);

  const autoMapping: SalariesMapping = {
    nom: columnNames.find(col => 
      col.toLowerCase().includes('nom') && !col.toLowerCase().includes('prenom')
    ),
    prenom: columnNames.find(col => 
      col.toLowerCase().includes('prenom')
    ),
    poste: columnNames.find(col => 
      col.toLowerCase().includes('poste') || 
      col.toLowerCase().includes('fonction') ||
      col.toLowerCase().includes('job')
    ),
    telephone: columnNames.find(col => 
      col.toLowerCase().includes('tel') || 
      col.toLowerCase().includes('phone')
    ),
    email: columnNames.find(col => 
      col.toLowerCase().includes('email') || 
      col.toLowerCase().includes('mail')
    ),
    tauxHoraire: columnNames.find(col => 
      col.toLowerCase().includes('taux') || 
      (col.toLowerCase().includes('salaire') && col.toLowerCase().includes('heure')) ||
      col.toLowerCase().includes('horaire')
    ),
    salaryMonth: columnNames.find(col => 
      (col.toLowerCase().includes('salaire') && col.toLowerCase().includes('mensuel')) ||
      col.toLowerCase().includes('salary') ||
      col.toLowerCase().includes('montant')
    ),
    coastCenter: columnNames.find(col => 
      col.toLowerCase().includes('coast') ||
      col.toLowerCase().includes('centre') ||
      col.toLowerCase().includes('cost') ||
      col.toLowerCase().includes('cout')
    ),
    division: columnNames.find(col => 
      col.toLowerCase().includes('division') ||
      col.toLowerCase().includes('dept') ||
      col.toLowerCase().includes('departement')
    ),
    services: columnNames.find(col => 
      col.toLowerCase().includes('service') ||
      col.toLowerCase().includes('unite')
    ),
    codeFonction: columnNames.find(col => 
      col.toLowerCase().includes('code') && col.toLowerCase().includes('fonction') ||
      col.toLowerCase().includes('grade')
    ),
    inNum: columnNames.find(col => 
      col.toLowerCase().includes('matricule') ||
      col.toLowerCase().includes('numero') ||
      col.toLowerCase().includes('id')
    ),
    salaryTarif: columnNames.find(col => col.toLowerCase().includes('salary_tarif') || col.toLowerCase().includes('tarif')),
    salaryH: columnNames.find(col => col.toLowerCase().includes('salary_h') || (col.toLowerCase().includes('salaire') && col.toLowerCase().includes('h'))),
    acordSup: columnNames.find(col => col.toLowerCase().includes('acord') || col.toLowerCase().includes('accord')),
  };

  const finalMapping = { ...autoMapping, ...mapping };
  
  console.log('Colonnes détectées pour salariés:', columnNames);
  console.log('Final mapping salariés:', finalMapping);
  console.log('Première ligne de données:', data[0]);

  const salaries: InsertSalarie[] = data.map((row, index) => {
    try {
      const nom = finalMapping.nom ? String(row[finalMapping.nom] || '') : '';
      const prenom = finalMapping.prenom ? String(row[finalMapping.prenom] || '') : '';
      const poste = finalMapping.poste ? String(row[finalMapping.poste] || '') : 'Employé';
      
      if (!nom || !prenom) {
        throw new Error('Nom et prénom sont obligatoires');
      }

      // Taux horaire
      const tauxStr = finalMapping.tauxHoraire 
        ? String(row[finalMapping.tauxHoraire] || '0')
        : (finalMapping.salaryTarif ? String(row[finalMapping.salaryTarif] || '0') : '0');
      const tauxHoraire = parseFloat(tauxStr.replace(',', '.').replace(/[^\d.-]/g, '')) || null;

      // Salaire mensuel
      const salaireStr = finalMapping.salaryMonth 
        ? String(row[finalMapping.salaryMonth] || '0')
        : (finalMapping.salaryH ? String(row[finalMapping.salaryH] || '0') : '0');
      const salaryMonth = parseFloat(salaireStr.replace(',', '.').replace(/[^\d.-]/g, '')) || null;

      // Acord_sup
      const acordSupStr = finalMapping.acordSup ? String(row[finalMapping.acordSup] || '0') : '0';
      const acordSup = parseFloat(acordSupStr.replace(',', '.').replace(/[^\d.-]/g, '')) || null;

      const salarie: InsertSalarie = {
        nom,
        prenom,
        poste,
        competences: null,
        telephone: finalMapping.telephone ? String(row[finalMapping.telephone] || '') : null,
        email: finalMapping.email ? String(row[finalMapping.email] || '') : null,
        statut: 'disponible',
        tauxHoraire: tauxHoraire ? String(tauxHoraire) : null,
        coastCenter: finalMapping.coastCenter ? String(row[finalMapping.coastCenter] || '') : null,
        division: finalMapping.division ? String(row[finalMapping.division] || '') : null,
        services: finalMapping.services ? String(row[finalMapping.services] || '') : null,
        codeFonction: finalMapping.codeFonction ? String(row[finalMapping.codeFonction] || '') : null,
        inNum: finalMapping.inNum ? String(row[finalMapping.inNum] || '') : null,
        salaryMonth: salaryMonth ? String(salaryMonth) : null,
  acordSup: acordSup ? String(acordSup) : null,
      };

      return salarie;
    } catch (error) {
      console.error(`Erreur lors du traitement du salarié ligne ${index + 1}:`, error);
      throw new Error(`Erreur à la ligne ${index + 1}: ${error}`);
    }
  });

  return salaries.filter(sal => sal.nom && sal.prenom);
}
