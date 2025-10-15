# 🏗️ ERP SaaS - Système de Gestion pour la Construction

> Système ERP complet pour la gestion de projets de construction, ressources humaines, équipements, achats/stocks et finances. Support multilingue (Français, Russe, Roumain).

[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue?logo=typescript)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18.3-61DAFB?logo=react)](https://reactjs.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Neon-336791?logo=postgresql)](https://neon.tech/)
[![Vite](https://img.shields.io/badge/Vite-5.4-646CFF?logo=vite)](https://vitejs.dev/)

---

## 📋 Table des matières

- [Vue d'ensemble](#-vue-densemble)
- [Fonctionnalités](#-fonctionnalités)
- [Architecture technique](#architecture-technique)
- [Installation & Configuration](#-installation--configuration)
- [Gestion des données](#-gestion-des-données)
- [Extension & Personnalisation](#-extension--personnalisation)
- [Roadmap & Améliorations](#-roadmap--améliorations)
- [Structure du projet](#️-structure-du-projet)
- [API Reference](#-api-reference)

---

## 🎯 Vue d'ensemble

Ce système ERP SaaS est conçu spécifiquement pour les entreprises de construction et industrielles. Il centralise la gestion de tous les aspects opérationnels : chantiers, personnel, équipements, achats, finances et budgets.

### ✨ Points forts

- **Multilingue** : Interface complète en Français, Russe et Roumain (i18next)
- **Données réelles** : Import Excel avec 161 salariés, 193 équipements, 6 chantiers
- **Architecture moderne** : React 18 + TypeScript + Vite + PostgreSQL
- **Design professionnel** : Dark mode optimisé, UI shadcn/ui, Tailwind CSS
- **Type-safe** : Validation Zod, Drizzle ORM, typage strict TypeScript

---

## 🚀 Fonctionnalités

### 📊 Tableau de bord (Dashboard)

- Vue d'ensemble des KPI : chantiers actifs, budgets, ressources
- Graphiques de progression budgétaire (Recharts)
- Indicateurs de performance en temps réel

### 🏗️ Gestion des chantiers

- Création et suivi de projets de construction
- Budget détaillé : Main d'œuvre, Matériaux, Équipement (prévisionnel vs réel)
- Affectation de responsables de projet
- Suivi de progression (%)
- Code projet et bénéficiaire

### 👥 Gestion des salariés (RH)

- Fiche complète : Nom, fonction, compétences, contacts
- Organisation : Division, Service, Centre de coût
- Finances : Taux horaire, salaire mensuel, accords supplémentaires
- Statuts : Disponible / Affecté / Congé
- **Recherche en temps réel** : Filtrer par nom, prénom, fonction, numéro interne
- **Filtres multiples** : Division, Service, Centre de coût
- **Modification en masse** : Dialog d'édition avec validation Zod

### 🚜 Gestion des équipements

- Inventaire complet : ID, Modèle, Immatriculation, Année
- Métadonnées techniques : Type de carburant, GPS, compteur
- Coûts : Taux horaire, consommation carburant, coût de maintenance
- **Affectation conducteur** : Relation avec table salariés (operatorId FK)
- Import Excel avec mapping automatique de colonnes

### 📦 Achat/Stocks

- **Gestion des stocks** : Articles, quantités, unités, usines
- **Workflow de réception** :
  - Création d'achats (niveau Admin/Chantier)
  - Validation de réception avec opérateur et date
  - Photo de facture (upload Base64, sécurisé)
  - Statuts : En attente → Réceptionné
- **Usines** : Gestion des sites de production/stockage

### 💰 Finances & Trésorerie

- Suivi des dépenses par chantier
- Catégorisation des coûts
- Rapports budgétaires avec comparaison prévisionnel/réel

### 🏭 Tableau de bord Usines

- **Consommations énergétiques** :
  - Suivi consommation électrique (kWh/MWh)
  - Suivi consommation gaz (kWh/m³)
  - Historique par date et par usine
- **Production** :
  - Tonnes reçues par type de marchandise
  - Tonnes vendues avec tracking client
  - Analyse par type de produit (Béton, Acier, Gravier, etc.)
- **Affectations Personnel** :
  - Salariés affectés du jour
  - Heures travaillées par employé
  - Notes et observations
- **Import/Export** :
  - Import Excel structuré (Consommations, Productions, Affectations)
  - Export multi-format (Excel, CSV, JSON)
  - Saisie opérateur via formulaires

### 📅 Planning

- Affectation salariés → chantiers (dates, heures/jour)
- Affectation équipements → chantiers
- Gestion des disponibilités

### 📄 Documentation

- Centralisation des documents de chantier
- Upload et gestion de fichiers

---

## 🏛️ Architecture technique

### Frontend

```text
React 18 + TypeScript
├── Vite (Build tool, HMR)
├── Wouter (Routing léger)
├── TanStack Query v5 (Server state)
├── shadcn/ui (Composants Radix UI)
├── Tailwind CSS (Styling)
├── React Hook Form + Zod (Formulaires)
├── i18next (Internationalisation)
└── Recharts (Visualisation données)
```

### Backend

```text
Express.js (Node.js ESM)
├── RESTful API (GET, POST, PATCH, DELETE)
├── Zod validation (Runtime type checking)
├── Multer (File uploads - Excel imports)
├── Error handling middleware
└── Request logging
```

### Base de données

```text
PostgreSQL (Neon serverless)
├── Drizzle ORM (Type-safe queries)
├── UUID primary keys (gen_random_uuid())
├── Decimal precision (12,2 budgets, 10,2 rates)
├── Foreign keys (relations salariés, équipements, chantiers)
└── WebSocket support
```

### Stack complet

- **Languages** : TypeScript 5.6
- **Runtime** : Node.js (ESM modules)
- **Database** : PostgreSQL via Neon
- **ORM** : Drizzle ORM + Drizzle Kit
- **Validation** : Zod schemas
- **Styling** : Tailwind CSS + shadcn/ui
- **Icons** : Lucide React
- **Date** : date-fns
- **Excel** : xlsx

---

## 📦 Installation & Configuration

### Prérequis

- Node.js 18+ ou compatible
- PostgreSQL database (Neon recommandé)
- Git

### Étapes d'installation

1. **Cloner le dépôt**

```bash
git clone https://github.com/dimdacin/erp-saas-construction.git
cd erp-saas-construction
```

2. **Installer les dépendances**

```bash
npm install
```

3. **Configurer les variables d'environnement**

Créez un fichier `.env` à la racine :

```env
# Base de données PostgreSQL (Neon)
DATABASE_URL=postgresql://user:password@host/database?sslmode=require

# Optionnel : Variables frontend (préfixe VITE_)
VITE_API_URL=http://localhost:5000
```

> ⚠️ **Important** : Ne jamais commiter le fichier `.env` (déjà dans .gitignore)

4. **Synchroniser le schéma de base de données**

```bash
npm run db:push
```

Si vous rencontrez des warnings de perte de données :

```bash
npm run db:push --force
```

5. **Lancer l'application**

```bash
# Mode développement (port 5000)
npm run dev

# Mode production
npm run build
npm start
```

L'application sera accessible sur `http://localhost:5000`

---

## 📊 Gestion des données

### Import de données Excel

Le système permet d'importer des données depuis des fichiers Excel structurés.

#### Script d'import automatique

Le script `server/import-data.ts` gère l'import intelligent :

```bash
# Exécuter l'import (après avoir placé vos fichiers Excel)
npx tsx server/import-data.ts
```

**Fonctionnalités de l'import** :

- ✅ Mapping automatique des colonnes Excel → schéma DB
- ✅ Matching intelligent des noms (opérateurs ↔ équipements)
- ✅ Création automatique des relations (FK)
- ✅ Gestion des variations de casse
- ✅ Bulk insert optimisé

#### Structure Excel attendue

**Feuille RH (Salariés)** :
| Nom complet | Fonction | Division | Service | Centre de coût | Taux horaire | ...
|-------------|----------|----------|---------|----------------|--------------|

**Feuille Meca (Équipements)** :
| ID | Modèle | Immatriculation | Année | Conducteur | Type carburant | Taux horaire | ...
|----|--------|-----------------|-------|------------|----------------|--------------|

**Feuille Chantier (Projets)** :
| Code projet | Nom | Bénéficiaire | Responsable | Budget MDO | Budget Matériaux | ...
|-------------|-----|--------------|-------------|------------|------------------|

**Feuille Consommations (Usines)** :
| Usine ID | Date | Électrique (kWh) | Gaz (kWh) | Unite |
|----------|------|------------------|-----------|-------|

**Feuille Productions (Usines)** :
| Usine ID | Date | Type Marchandise | Tonnes Reçues | Tonnes Vendues | Client |
|----------|------|------------------|---------------|----------------|--------|

**Feuille Affectations (Personnel Usines)** :
| Usine ID | Salarié ID | Date | Heures/Jour | Notes |
|----------|------------|------|-------------|-------|

### Modifier le schéma de base de données

1. **Éditer le schéma Drizzle** (`shared/schema.ts`)

```typescript
export const maNouvellTable = pgTable("ma_nouvelle_table", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  nom: text("nom").notNull(),
  montant: decimal("montant", { precision: 12, scale: 2 }),
  createdAt: timestamp("created_at").notNull().default(sql`now()`),
});

// Ajouter les schemas Zod
export const insertMaNouvellTableSchema = createInsertSchema(maNouvellTable).omit({
  id: true,
  createdAt: true,
});

export type InsertMaNouvellTable = z.infer<typeof insertMaNouvellTableSchema>;
export type MaNouvellTable = typeof maNouvellTable.$inferSelect;
```

2. **Mettre à jour l'interface de stockage** (`server/storage.ts`)

```typescript
interface IStorage {
  // ... méthodes existantes
  getMaNouvelleTable(): Promise<MaNouvellTable[]>;
  createMaNouvelleTable(data: InsertMaNouvellTable): Promise<MaNouvellTable>;
}
```

3. **Synchroniser avec la base de données**

```bash
npm run db:push
```

4. **Redémarrer le serveur** pour recharger les mappings Drizzle

```bash
npm run dev
```

### API REST

#### Structure des endpoints

```
GET    /api/chantiers           - Liste tous les chantiers
POST   /api/chantiers           - Crée un nouveau chantier
PATCH  /api/chantiers/:id       - Modifie un chantier
DELETE /api/chantiers/:id       - Supprime un chantier

GET    /api/salaries            - Liste tous les salariés
POST   /api/salaries            - Crée un nouveau salarié
PATCH  /api/salaries/:id        - Modifie un salarié
DELETE /api/salaries/:id        - Supprime un salarié

GET    /api/equipements         - Liste tous les équipements
POST   /api/equipements         - Crée un nouvel équipement
PATCH  /api/equipements/:id     - Modifie un équipement
DELETE /api/equipements/:id     - Supprime un équipement

GET    /api/stock-items         - Liste articles de stock
POST   /api/stock-items         - Crée un article
PATCH  /api/stock-items/:id     - Modifie un article
DELETE /api/stock-items/:id     - Supprime un article

GET    /api/depenses            - Liste des dépenses/achats
POST   /api/depenses            - Crée une dépense
PATCH  /api/depenses/:id/reception - Valide la réception

GET    /api/usines              - Liste des usines
POST   /api/usines              - Crée une usine
DELETE /api/usines/:id          - Supprime une usine

POST   /api/upload-facture      - Upload photo de facture (multipart/form-data)
```

#### Exemple d'appel API (Frontend)

```typescript
import { apiRequest, queryClient } from "@lib/queryClient";
import { useQuery, useMutation } from "@tanstack/react-query";

// Query (GET)
const { data: salaries } = useQuery<Salarie[]>({
  queryKey: ['/api/salaries'],
});

// Mutation (POST/PATCH/DELETE)
const createSalarie = useMutation({
  mutationFn: (data: InsertSalarie) => 
    apiRequest('/api/salaries', { method: 'POST', body: data }),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['/api/salaries'] });
  },
});
```

---

## 🔧 Extension & Personnalisation

### Ajouter un nouveau module

1. **Créer le schéma de données** (`shared/schema.ts`)
2. **Créer les API routes** (`server/routes.ts`)
3. **Créer la page frontend** (`client/src/pages/MonModule.tsx`)
4. **Ajouter la route** (`client/src/App.tsx`)
5. **Ajouter au menu** (sidebar ou navigation)
6. **Ajouter les traductions** (`client/src/i18n/locales/*.json`)

### Personnaliser le dashboard

Le dashboard actuel affiche des statistiques générales. Voici comment le rendre configurable :

#### Option 1 : Widgets configurables (Future)

```typescript
// Créer une table de préférences utilisateur
export const userDashboardPrefs = pgTable("user_dashboard_prefs", {
  userId: varchar("user_id").references(() => users.id),
  widgets: text("widgets").array(), // ["budgets", "chantiers", "salaries"]
  layout: text("layout"), // JSON stringifié
});
```

#### Option 2 : Filtres sauvegardés (Future)

```typescript
// Sauvegarder les filtres préférés par utilisateur
export const savedFilters = pgTable("saved_filters", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id),
  module: varchar("module", { length: 50 }), // "salaries", "equipements"
  name: text("name"), // "Mon équipe Construction"
  filters: text("filters"), // JSON: { division: "Mecanizare", service: "Parc" }
});
```

#### Option 3 : Colonnes personnalisables (Future)

```typescript
// Permettre à chaque utilisateur de choisir les colonnes affichées
export const tablePreferences = pgTable("table_preferences", {
  userId: varchar("user_id").references(() => users.id),
  tableName: varchar("table_name", { length: 50 }),
  visibleColumns: text("visible_columns").array(),
  columnOrder: text("column_order").array(),
});
```

### Ajouter une nouvelle langue

1. **Créer le fichier de traduction** :

```bash
# Créer client/src/i18n/locales/es.json
{
  "dashboard": "Tablero",
  "chantiers": "Obras",
  // ... toutes les clés
}
```

2. **Enregistrer la langue** (`client/src/i18n/config.ts`)

```typescript
import es from './locales/es.json';

i18n.use(initReactI18next).init({
  resources: {
    fr: { translation: fr },
    ru: { translation: ru },
    ro: { translation: ro },
    es: { translation: es }, // ✅ Nouvelle langue
  },
  // ...
});
```

3. **Ajouter au sélecteur de langue** (composant LanguageSwitcher)

---

## 🗂️ Structure du projet

```
erp-saas-construction/
├── client/                    # Frontend React
│   ├── src/
│   │   ├── components/        # Composants réutilisables
│   │   │   ├── ui/           # shadcn/ui components
│   │   │   ├── ProjectsTable.tsx
│   │   │   └── ...
│   │   ├── pages/            # Pages de l'application
│   │   │   ├── Dashboard.tsx
│   │   │   ├── Chantiers.tsx
│   │   │   ├── Salaries.tsx
│   │   │   ├── Equipements.tsx
│   │   │   ├── Achats.tsx
│   │   │   └── ...
│   │   ├── lib/              # Utilitaires frontend
│   │   │   ├── queryClient.ts
│   │   │   └── utils.ts
│   │   ├── i18n/             # Internationalisation
│   │   │   ├── config.ts
│   │   │   └── locales/
│   │   │       ├── fr.json
│   │   │       ├── ru.json
│   │   │       └── ro.json
│   │   ├── App.tsx           # Routes principales
│   │   └── index.css         # Styles globaux
│   └── index.html
│
├── server/                    # Backend Express
│   ├── routes.ts             # API endpoints
│   ├── storage.ts            # Interface de stockage + DbStorage
│   ├── import-data.ts        # Script d'import Excel
│   ├── vite.ts               # Middleware Vite
│   └── index.ts              # Point d'entrée serveur
│
├── shared/                    # Code partagé client/serveur
│   └── schema.ts             # Schémas Drizzle + Zod
│
├── attached_assets/           # Assets utilisateur (Excel, images)
│
├── drizzle.config.ts         # Config Drizzle Kit
├── vite.config.ts            # Config Vite
├── tailwind.config.ts        # Config Tailwind
├── tsconfig.json             # Config TypeScript
├── package.json              # Dépendances
└── README.md                 # Documentation
```

---

## 📚 API Reference

### Schéma de base de données

#### Table `chantiers`

```typescript
{
  id: string (UUID)
  codeProjet: string
  nom: string
  statut: string
  beneficiaire: string
  responsableId: string (FK → salaries.id)
  budgetPrevisionnel: decimal
  budgetMainDoeuvre: decimal
  budgetMateriaux: decimal
  budgetEquipement: decimal
  budgetRealise: decimal
  budgetReelMainDoeuvre: decimal
  budgetReelMateriaux: decimal
  budgetReelEquipement: decimal
  progression: integer (0-100)
  dateDebut: date
  dateLimite: date
  description: text
  createdAt: timestamp
}
```

#### Table `salaries`

```typescript
{
  id: string (UUID)
  nom: string
  prenom: string
  poste: string
  competences: string[]
  telephone: string
  email: string
  statut: string ("disponible" | "affecté" | "congé")
  tauxHoraire: decimal
  coastCenter: string        // Centre de coût
  division: string           // Division/département
  services: string           // Service
  codeFonction: string       // Code fonction
  inNum: string              // Numéro interne
  salaryMonth: decimal       // Salaire mensuel
  acordSup: decimal          // Accord supplémentaire
  createdAt: timestamp
}
```

#### Table `equipements`

```typescript
{
  id: string (UUID)
  nom: string
  type: string
  categorie: string
  marque: string
  modele: string
  numeroSerie: string
  immatriculation: string
  statut: string
  localisation: string
  dateAchat: date
  coutJournalier: decimal
  operatorId: string (FK → salaries.id)
  operatorName: string
  year: integer
  fuelType: string
  gpsUnit: string
  meterUnit: string
  hourlyRate: decimal
  fuelConsumption: decimal
  maintenanceCost: decimal
  createdAt: timestamp
}
```

#### Table `depenses` (Achats/Stocks)

```typescript
{
  id: string (UUID)
  chantierId: string (FK → chantiers.id, nullable)
  niveau: string ("admin" | "chantier")
  categorie: string
  description: string
  montant: decimal
  stockItemId: string (FK → stock_items.id)
  quantite: decimal
  dateDepense: date
  statut_reception: string ("en_attente" | "receptionne")
  date_reception: date
  operateur_reception: string
  photo_facture_path: string (Base64 data URL)
  createdAt: timestamp
}
```

#### Table `stock_items`

```typescript
{
  id: string (UUID)
  itemId: string (unique)
  nom: string
  usineId: string (FK → usines.id)
  categorie: string
  quantite: decimal
  unite: string
  createdAt: timestamp
}
```

#### Table `usine_consommations`

```typescript
{
  id: string (UUID)
  usineId: string (FK → usines.id)
  date: date
  consommationElectrique: decimal
  consommationGaz: decimal
  unite: string (default: "kWh")
  createdAt: timestamp
}
```

#### Table `usine_productions`

```typescript
{
  id: string (UUID)
  usineId: string (FK → usines.id)
  date: date
  typeMarchandise: string
  tonnesRecues: decimal
  tonnesVendues: decimal
  clientId: string (nullable)
  clientNom: string (nullable)
  notes: text (nullable)
  createdAt: timestamp
}
```

#### Table `usine_affectations_salaries`

```typescript
{
  id: string (UUID)
  usineId: string (FK → usines.id)
  salarieId: string (FK → salaries.id)
  date: date
  heuresParJour: decimal (default: 8)
  notes: text (nullable)
  createdAt: timestamp
}
```

### Relations clés

```
chantiers.responsableId → salaries.id (Responsable de projet)
equipements.operatorId → salaries.id (Conducteur d'équipement)
depenses.chantierId → chantiers.id (Dépense liée à un chantier)
stock_items.usineId → usines.id (Article stocké dans une usine)
usine_consommations.usineId → usines.id (Consommation d'une usine)
usine_productions.usineId → usines.id (Production d'une usine)
usine_affectations_salaries.usineId → usines.id (Affectation à une usine)
usine_affectations_salaries.salarieId → salaries.id (Salarié affecté)
```
depenses.stockItemId → stock_items.id (Article acheté)
stock_items.usineId → usines.id (Usine de stockage)
affectations_salaries → chantiers + salaries (Affectation personnel)
affectations_equipements → chantiers + equipements (Affectation matériel)
```

---

## 🚀 Roadmap & Améliorations

### Phase 1 : Dashboard personnalisable ⏳

- [ ] Système de widgets drag-and-drop (react-grid-layout)
- [ ] Sauvegarder la disposition du dashboard par utilisateur
- [ ] Widgets configurables :
  - [ ] Graphiques budgétaires personnalisés
  - [ ] Tableaux de bord par chantier
  - [ ] Statistiques RH (absences, heures travaillées)
  - [ ] Alertes équipement (maintenance due)
- [ ] Thèmes de couleurs personnalisables

### Phase 2 : Exports & Rapports 📊

- [ ] Export Excel multi-feuilles (chantiers, salariés, équipements)
- [ ] Génération PDF de rapports :
  - [ ] Rapport budgétaire par chantier
  - [ ] Fiche de paie
  - [ ] Carnet d'équipement
- [ ] Export CSV configurable (choix des colonnes)
- [ ] Planification d'exports automatiques (cron jobs)

### Phase 3 : Permissions & Rôles 🔐

- [ ] Système de rôles : Admin, Chef de projet, RH, Comptable
- [ ] Permissions granulaires par module
- [ ] Authentification renforcée (Replit Auth ou JWT)
- [ ] Logs d'audit (qui a modifié quoi, quand)
- [ ] Approbations multi-niveaux (achats, budgets)

### Phase 4 : Fonctionnalités avancées ✨

- [ ] Notifications en temps réel (WebSocket déjà installé - `ws`)
- [ ] Planning visuel avec calendrier interactif
- [ ] Gestion des congés et absences
- [ ] Suivi GPS en temps réel des équipements
- [ ] Chat par chantier (communication équipe)
- [ ] Upload de photos de chantier (progression visuelle)
- [ ] Facturation intégrée (génération factures clients)

### Phase 5 : Analytics & BI 📈

- [ ] Tableaux de bord analytiques avancés
- [ ] Prévisions budgétaires (ML/IA)
- [ ] Analyse de rentabilité par chantier
- [ ] Indicateurs de performance (KPI) configurables
- [ ] Comparaison inter-chantiers
- [ ] Rapports d'écart budget prévisionnel/réel automatisés

### Phase 6 : Mobile & Offline 📱

- [ ] Application mobile (React Native ou PWA)
- [ ] Mode hors-ligne (IndexedDB sync)
- [ ] Scan de codes-barres équipement
- [ ] Prise de photos terrain (avec géolocalisation)
- [ ] Signature électronique (réception matériel)

### Phase 7 : Intégrations externes 🔌

- [ ] Intégration comptabilité (export vers logiciels compta)
- [ ] API publique pour intégrations tierces
- [ ] Webhooks pour événements (nouveau chantier, budget dépassé)
- [ ] Synchronisation calendrier (Google Calendar, Outlook)
- [ ] Import automatique factures (OCR)

---

## 🛠️ Développement

### Scripts disponibles

```bash
npm run dev       # Lancer le serveur de développement (port 5000)
npm run build     # Build production (frontend + backend)
npm start         # Lancer en production
npm run check     # Vérification TypeScript
npm run db:push   # Synchroniser le schéma DB
```

### Variables d'environnement critiques

| Variable | Description | Exemple |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:pass@host/db` |
| `NODE_ENV` | Environnement d'exécution | `development` ou `production` |
| `VITE_API_URL` | URL de l'API (frontend) | `http://localhost:5000` |

### Points d'attention techniques

#### ⚠️ Valeurs zéro dans les affichages

Le système utilise des checks stricts pour afficher les valeurs zéro :

```typescript
// ✅ Correct
{budgetReel !== undefined && budgetReel !== null ? `${budgetReel} €` : '-'}

// ❌ Incorrect (masque les zéros légitimes)
{budgetReel ? `${budgetReel} €` : '-'}
```

#### 🔄 Redémarrage serveur après modification schéma

Drizzle ORM charge les mappings au démarrage. Après `npm run db:push`, **redémarrez le serveur** :

```bash
# Ctrl+C puis
npm run dev
```

#### 📝 Mapping camelCase ↔ snake_case

TypeScript utilise camelCase, PostgreSQL snake_case :

```typescript
// shared/schema.ts
coastCenter: varchar("coast_center") // ✅

// API retourne
{ coastCenter: "Admin" } // ✅ Drizzle mappe automatiquement
```

---

## 📄 Licence

MIT License - Ce projet est open source.

---

## 🤝 Contribution

Les contributions sont les bienvenues ! Pour contribuer :

1. Fork le projet
2. Créez une branche feature (`git checkout -b feature/AmazingFeature`)
3. Committez vos changements (`git commit -m 'Add AmazingFeature'`)
4. Pushez vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrez une Pull Request

---

## 📞 Support

Pour toute question ou assistance :

- 📧 Email : <dim.dacin@gmail.com>
- 🐛 Issues : [GitHub Issues](https://github.com/dimdacin/erp-saas-construction/issues)

---

## Développé avec ❤️ pour optimiser la gestion de projets de construction
