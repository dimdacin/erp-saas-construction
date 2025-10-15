# Template Import Excel - Données Usines

Ce document décrit la structure Excel attendue pour l'import des données d'usine.

## Structure du fichier Excel

Le fichier Excel doit contenir 3 feuilles distinctes :

### Feuille 1 : "Consommations"

Colonnes requises :
- **Usine ID** : Identifiant de l'usine (doit correspondre à un ID existant dans la table usines)
- **Date** : Date de la consommation (format : YYYY-MM-DD ou DD/MM/YYYY)
- **Électrique (kWh)** : Consommation électrique en kWh (nombre décimal)
- **Gaz (kWh)** : Consommation de gaz en kWh ou m³ (nombre décimal)
- **Unite** : Unité de mesure (optionnel, par défaut "kWh")

Exemple :
```
| Usine ID | Date       | Électrique (kWh) | Gaz (kWh) | Unite |
|----------|------------|------------------|-----------|-------|
| uuid-123 | 2025-01-15 | 1250.50          | 890.25    | kWh   |
| uuid-456 | 2025-01-15 | 2100.00          | 1450.00   | kWh   |
```

### Feuille 2 : "Productions"

Colonnes requises :
- **Usine ID** : Identifiant de l'usine
- **Date** : Date de production (format : YYYY-MM-DD ou DD/MM/YYYY)
- **Type Marchandise** : Type de produit (ex: "Béton", "Acier", "Gravier", etc.)
- **Tonnes Reçues** : Quantité reçue en tonnes (nombre décimal)
- **Tonnes Vendues** : Quantité vendue en tonnes (nombre décimal)
- **Client** : Nom du client (optionnel)
- **Notes** : Notes additionnelles (optionnel)

Exemple :
```
| Usine ID | Date       | Type Marchandise | Tonnes Reçues | Tonnes Vendues | Client       | Notes        |
|----------|------------|------------------|---------------|----------------|--------------|--------------|
| uuid-123 | 2025-01-15 | Béton            | 120.50        | 95.00          | Client A     | Livraison OK |
| uuid-123 | 2025-01-15 | Acier            | 85.00         | 75.00          | Client B     |              |
| uuid-456 | 2025-01-15 | Gravier          | 200.00        | 180.00         | Client C     |              |
```

### Feuille 3 : "Affectations"

Colonnes requises :
- **Usine ID** : Identifiant de l'usine
- **Salarié ID** : Identifiant du salarié (doit correspondre à un ID existant dans la table salaries)
- **Date** : Date d'affectation (format : YYYY-MM-DD ou DD/MM/YYYY)
- **Heures/Jour** : Nombre d'heures travaillées (nombre décimal, par défaut 8)
- **Notes** : Notes additionnelles (optionnel)

Exemple :
```
| Usine ID | Salarié ID | Date       | Heures/Jour | Notes               |
|----------|------------|------------|-------------|---------------------|
| uuid-123 | sal-001    | 2025-01-15 | 8.0         | Shift normal        |
| uuid-123 | sal-002    | 2025-01-15 | 7.5         | Départ anticipé     |
| uuid-456 | sal-003    | 2025-01-15 | 8.0         |                     |
```

## Modes d'import

### Mode "Ajouter" (append)
- Ajoute les nouvelles données aux données existantes
- Recommandé pour les mises à jour quotidiennes

### Mode "Remplacer" (replace)
- **⚠️ ATTENTION** : Supprime TOUTES les données existantes
- Remplace par les nouvelles données
- Utiliser avec précaution

## Utilisation dans l'interface

1. **Accéder au tableau de bord** → Onglet "Usines"
2. **Cliquer sur "Importer Excel"**
3. **Sélectionner le fichier** Excel structuré comme ci-dessus
4. **Choisir le mode** d'import (Ajouter ou Remplacer)
5. **Cliquer sur "Importer"**

## Validation des données

Le système validera automatiquement :
- ✅ La présence des feuilles requises
- ✅ L'existence des Usine ID et Salarié ID
- ✅ Le format des dates
- ✅ Les valeurs numériques pour tonnes et consommations
- ❌ Les lignes avec des données manquantes seront ignorées avec un message d'erreur

## Export des données

Vous pouvez exporter les données aux formats :
- **Excel (.xlsx)** : Format structuré avec 3 feuilles
- **CSV (.csv)** : Format simple pour analyse
- **JSON (.json)** : Format pour intégrations API

Pour exporter : Tableau de bord → Usines → Bouton "Exporter" → Choisir le format

## API Endpoints

### Import programmatique
```bash
POST /api/factory-data/import?mode=append
Content-Type: multipart/form-data

# Corps de la requête : fichier Excel
```

### Export programmatique
```bash
GET /api/factory-data/export?format=excel&date=2025-01-15

# Formats disponibles: excel, csv, json
# Date optionnelle pour filtrer
```

## Exemple de données de test

Vous pouvez créer un fichier de test avec ces données :

**Usine exemple** (créer d'abord dans Achats → Usines) :
- Nom : "Usine Production Nord"
- Localisation : "Paris, France"

**Consommations exemple** :
- Date : aujourd'hui
- Électrique : 1500 kWh
- Gaz : 800 kWh

**Production exemple** :
- Type : "Béton"
- Tonnes reçues : 100
- Tonnes vendues : 85
- Client : "ABC Construction"

**Affectation exemple** :
- Salarié : (choisir un ID existant)
- Heures : 8
- Date : aujourd'hui
