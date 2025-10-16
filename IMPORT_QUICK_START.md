# Quick Start - Excel Import

## Accès à la fonctionnalité

1. Démarrer le serveur de développement:
   ```bash
   npm run dev
   ```

2. Accéder à l'interface d'import:
   - Ouvrir http://localhost:5000
   - Cliquer sur **"Admin"** dans la sidebar
   - Sélectionner **"Import Excel"**

## Import de vos données

### Étape 1: Préparer votre fichier Excel
- Fichier de référence: `./data/local/alldatatestimport.xlsx`
- Feuilles supportées: **RH**, **Meca**, **Chantier**

### Étape 2: Upload et analyse
1. Cliquer sur **"Upload File"**
2. Sélectionner votre fichier Excel (.xlsx)
3. Cliquer sur **"Analyze File"** pour détecter les feuilles

### Étape 3: Sélection et import
1. Choisir la feuille à importer dans le menu déroulant
2. Vérifier les colonnes détectées
3. Cliquer sur **"Start Import"**

### Étape 4: Consulter le rapport
Le système affiche:
- ✅ **Processed**: Nombre total de lignes traitées
- ✅ **Inserted**: Nouveaux enregistrements créés
- ✅ **Updated**: Enregistrements existants mis à jour
- ✅ **Ignored**: Lignes vides ou invalides ignorées
- ✅ **Errors**: Erreurs avec détails par ligne

## Logique UPSERT

Le système utilise des clés uniques pour décider d'insérer ou mettre à jour:

- **RH** (Salariés): Clé = `In_num` (numéro employé)
- **Meca** (Équipements): Clé = `id` (numéro de série)
- **Chantier**: Clé = `ID chantier` (code projet)

Si la clé existe déjà → **UPDATE**  
Si la clé est nouvelle → **INSERT**

## Mapping des colonnes

Le mapping entre vos colonnes Excel et la base de données est défini dans:
```
attached_assets/mapping_v1.json
```

### Exemple RH:
```json
{
  "RH": {
    "tableName": "salaries",
    "upsertKey": "inNum",
    "columnMapping": {
      "Coast_center": "coastCenter",
      "Names": "nom",
      "In_num": "inNum",
      ...
    },
    "transformations": {
      "nom": {
        "type": "split_name",
        "fields": ["nom", "prenom"]
      }
    }
  }
}
```

## Transformations automatiques

### RH (Salariés)
- ✅ **Names** → divisé en `nom` + `prenom`
- ✅ **statut** → "disponible" par défaut
- ✅ **competences** → créé depuis `fonctions`

### Meca (Équipements)
- ✅ **nom** → concat de `category` + `model`
- ✅ **type** → copie de `category`
- ✅ **statut** → mapping: vide/"Active" → "disponible", "Inactive" → "en_panne"

### Chantier
- ✅ **budgetRealise** → somme des budgets réels
- ✅ **statut** → "en_cours" par défaut
- ✅ **progression** → 0 par défaut

## Historique des imports

L'historique complet est visible en bas de la page d'import et stocké dans la table `import_logs` avec:
- Date et heure
- Nom du fichier
- Feuille importée
- Statut (success/partial/failed)
- Statistiques détaillées

## Résolution de problèmes

### "Sheet not found"
→ Vérifiez que le nom de la feuille correspond exactement (RH, Meca, ou Chantier)

### "UPSERT key missing"
→ Assurez-vous que toutes les lignes ont une valeur pour la clé (In_num, id, ou ID chantier)

### "Invalid data"
→ Consultez le tableau des erreurs pour voir les lignes problématiques

## API REST (optionnel)

### Analyser un fichier
```bash
curl -X POST http://localhost:5000/api/import/analyze \
  -F "file=@./data/local/alldatatestimport.xlsx"
```

### Importer une feuille
```bash
curl -X POST http://localhost:5000/api/import/RH \
  -F "file=@./data/local/alldatatestimport.xlsx"
```

### Récupérer l'historique
```bash
curl http://localhost:5000/api/import/logs
```

## Documentation complète

Pour plus de détails, consultez:
- **EXCEL_IMPORT_DOCUMENTATION.md** - Guide complet d'utilisation
- **IMPLEMENTATION_REPORT.md** - Analyse technique et gap analysis

## Support

En cas de problème:
1. Vérifier les logs d'import dans l'UI
2. Consulter le mapping dans `mapping_v1.json`
3. Vérifier la structure de votre Excel vs le fichier de référence
4. Tester avec le fichier d'exemple d'abord
