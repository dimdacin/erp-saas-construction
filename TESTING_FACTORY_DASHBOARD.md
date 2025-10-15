# Guide de Test Manuel - Tableau de Bord Usines

Ce document décrit les étapes pour tester manuellement la nouvelle fonctionnalité du tableau de bord des usines.

## Prérequis

1. **Serveur en cours d'exécution** :
   ```bash
   npm run dev
   ```

2. **Base de données initialisée** avec le nouveau schéma :
   ```bash
   npm run db:push
   ```

3. **Au moins une usine créée** dans le système (via Achats → Usines)

## Tests à Effectuer

### Test 1 : Navigation vers le Tableau de Bord Usines

1. Ouvrir l'application dans le navigateur
2. Aller sur la page "Tableau de bord"
3. Vérifier la présence de l'onglet "Usines" à côté de "Général"
4. Cliquer sur l'onglet "Usines"

**Résultat attendu** :
- L'onglet s'affiche correctement
- Si aucune usine n'existe : message "Aucune usine configurée"
- Si des usines existent : liste des usines s'affiche

### Test 2 : Ajout de Données via Formulaire

1. Dans l'onglet "Usines", cliquer sur "Ajouter Données Usine"
2. Tester chaque onglet du formulaire :

#### Onglet Consommation
1. Sélectionner une usine
2. Sélectionner une date
3. Saisir une consommation électrique (ex: 1500.50)
4. Saisir une consommation gaz (ex: 800.25)
5. Sélectionner l'unité (kWh)
6. Cliquer sur "Ajouter"

**Résultat attendu** :
- Toast de confirmation "Consommation ajoutée avec succès"
- Dialog se ferme
- Dashboard se rafraîchit avec les nouvelles données

#### Onglet Production
1. Sélectionner une usine
2. Sélectionner une date
3. Saisir un type de marchandise (ex: "Béton")
4. Saisir tonnes reçues (ex: 120.00)
5. Saisir tonnes vendues (ex: 95.00)
6. Optionnel : saisir nom client
7. Cliquer sur "Ajouter"

**Résultat attendu** :
- Toast de confirmation "Production ajoutée avec succès"
- Production apparaît dans la section "Productions du jour"

#### Onglet Personnel
1. Sélectionner une usine
2. Sélectionner un salarié
3. Sélectionner une date
4. Saisir heures par jour (ex: 8)
5. Cliquer sur "Ajouter"

**Résultat attendu** :
- Toast de confirmation "Affectation ajoutée avec succès"
- Nombre de salariés affectés mis à jour
- Salarié apparaît dans la liste "Salariés affectés"

### Test 3 : Import Excel

1. Créer un fichier Excel avec 3 feuilles (voir TEMPLATE_IMPORT_USINES.md)
2. Remplir quelques lignes de test dans chaque feuille
3. Dans le dashboard, cliquer sur "Importer Excel"
4. Sélectionner le fichier
5. Choisir le mode "Ajouter aux données existantes"
6. Cliquer sur "Importer"

**Résultat attendu** :
- Toast "Import réussi" avec nombre d'enregistrements
- Données apparaissent dans le dashboard
- En cas d'erreur : message d'erreur détaillé

### Test 4 : Export de Données

1. S'assurer qu'il y a des données dans le système
2. Cliquer sur "Exporter"
3. Tester chaque format :

#### Format Excel
1. Sélectionner "Excel (.xlsx)"
2. Vérifier le téléchargement du fichier
3. Ouvrir le fichier Excel
4. Vérifier les 3 feuilles : Consommations, Productions, Affectations
5. Vérifier que les données sont correctes

#### Format CSV
1. Sélectionner "CSV (.csv)"
2. Vérifier le téléchargement
3. Ouvrir dans un éditeur de texte
4. Vérifier le format CSV

#### Format JSON
1. Sélectionner "JSON (.json)"
2. Vérifier le téléchargement
3. Ouvrir dans un éditeur de texte
4. Vérifier la structure JSON

**Résultat attendu pour tous les formats** :
- Fichier téléchargé avec le bon nom (factory-data-YYYY-MM-DD.extension)
- Données complètes et correctes
- Toast "Export réussi"

### Test 5 : Affichage des Métriques

Avec des données dans le système, vérifier :

1. **Carte Usine** affiche :
   - Nom de l'usine
   - Localisation (si définie)
   - Badge avec nombre de salariés affectés

2. **Section Consommation** affiche :
   - Icône éclair pour électrique
   - Icône flamme pour gaz
   - Valeurs avec unités (kWh)

3. **Section Production** affiche :
   - Tonnes reçues avec icône ↓
   - Tonnes vendues avec icône ↑
   - Liste détaillée par type de marchandise
   - Nom du client si renseigné

4. **Section Personnel** affiche :
   - Liste des salariés affectés
   - Heures par jour pour chaque salarié

### Test 6 : Filtrage par Date

1. Observer la date affichée en haut du dashboard
2. Les données affichées doivent correspondre à cette date
3. Modifier les données pour une autre date
4. Vérifier que seules les données du jour sélectionné s'affichent

## Tests de Validation

### Validation Formulaire
- Essayer de soumettre sans sélectionner d'usine → doit échouer
- Essayer de soumettre avec des valeurs négatives → doit échouer
- Essayer de soumettre avec des formats de date invalides → doit échouer

### Validation Import
- Importer un fichier sans les bonnes feuilles → message d'erreur
- Importer avec des Usine ID inexistants → erreur pour ces lignes
- Importer avec des Salarié ID inexistants → erreur pour ces lignes

### Tests de Performance
- Ajouter 50+ enregistrements
- Vérifier que l'affichage reste fluide
- Vérifier que l'export fonctionne toujours

## Vérifications en Base de Données

Si accès à la base de données, vérifier :

```sql
-- Vérifier les consommations
SELECT * FROM usine_consommations ORDER BY date DESC LIMIT 10;

-- Vérifier les productions
SELECT * FROM usine_productions ORDER BY date DESC LIMIT 10;

-- Vérifier les affectations
SELECT * FROM usine_affectations_salaries ORDER BY date DESC LIMIT 10;
```

## Checklist de Test Complet

- [ ] Navigation vers onglet Usines fonctionne
- [ ] Formulaire d'ajout - Onglet Consommation fonctionne
- [ ] Formulaire d'ajout - Onglet Production fonctionne
- [ ] Formulaire d'ajout - Onglet Personnel fonctionne
- [ ] Import Excel fonctionne (mode Ajouter)
- [ ] Import Excel fonctionne (mode Remplacer)
- [ ] Export Excel fonctionne
- [ ] Export CSV fonctionne
- [ ] Export JSON fonctionne
- [ ] Affichage des métriques correct
- [ ] Filtrage par date fonctionne
- [ ] Validations formulaire fonctionnent
- [ ] Gestion des erreurs appropriée
- [ ] Performance acceptable avec beaucoup de données

## Bugs Connus / Limitations

*(À compléter pendant les tests)*

## Notes de Test

*(Espace pour notes pendant les tests)*

Date de test : ___________
Testeur : ___________
Environnement : ___________
