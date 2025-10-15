import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, decimal, date, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const chantiers = pgTable("chantiers", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  codeProjet: varchar("code_projet", { length: 50 }),
  nom: text("nom").notNull(),
  statut: varchar("statut", { length: 50 }).notNull(),
  beneficiaire: text("beneficiaire"),
  responsableId: varchar("responsable_id").references(() => salaries.id, { onDelete: "set null" }),
  budgetPrevisionnel: decimal("budget_previsionnel", { precision: 12, scale: 2 }).notNull(),
  budgetMainDoeuvre: decimal("budget_main_doeuvre", { precision: 12, scale: 2 }),
  budgetMateriaux: decimal("budget_materiaux", { precision: 12, scale: 2 }),
  budgetEquipement: decimal("budget_equipement", { precision: 12, scale: 2 }),
  budgetRealise: decimal("budget_realise", { precision: 12, scale: 2 }).notNull().default("0"),
  budgetReelMainDoeuvre: decimal("budget_reel_main_doeuvre", { precision: 12, scale: 2 }),
  budgetReelMateriaux: decimal("budget_reel_materiaux", { precision: 12, scale: 2 }),
  budgetReelEquipement: decimal("budget_reel_equipement", { precision: 12, scale: 2 }),
  progression: integer("progression").notNull().default(0),
  dateDebut: date("date_debut"),
  dateLimite: date("date_limite"),
  description: text("description"),
  createdAt: timestamp("created_at").notNull().default(sql`now()`),
});

export const salaries = pgTable("salaries", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  nom: text("nom").notNull(),
  prenom: text("prenom").notNull(),
  poste: text("poste").notNull(),
  competences: text("competences").array(),
  telephone: varchar("telephone", { length: 20 }),
  email: varchar("email", { length: 100 }),
  statut: varchar("statut", { length: 50 }).notNull().default("disponible"),
  tauxHoraire: decimal("taux_horaire", { precision: 10, scale: 2 }),
  coastCenter: varchar("coast_center", { length: 100 }),
  division: varchar("division", { length: 100 }),
  services: varchar("services", { length: 100 }),
  codeFonction: varchar("code_fonction", { length: 50 }),
  inNum: varchar("in_num", { length: 50 }),
  salaryMonth: decimal("salary_month", { precision: 12, scale: 2 }),
  acordSup: decimal("acord_sup", { precision: 12, scale: 2 }),
  createdAt: timestamp("created_at").notNull().default(sql`now()`),
});

export const equipements = pgTable("equipements", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  nom: text("nom").notNull(),
  type: text("type").notNull(),
  categorie: text("categorie"),
  marque: varchar("marque", { length: 100 }),
  modele: varchar("modele", { length: 100 }),
  numeroSerie: varchar("numero_serie", { length: 100 }),
  immatriculation: varchar("immatriculation", { length: 100 }),
  statut: varchar("statut", { length: 50 }).notNull().default("disponible"),
  localisation: text("localisation"),
  dateAchat: date("date_achat"),
  coutJournalier: decimal("cout_journalier", { precision: 10, scale: 2 }),
  consommationGasoilHeure: decimal("consommation_gasoil_heure", { precision: 8, scale: 2 }),
  salaireHoraireOperateur: decimal("salaire_horaire_operateur", { precision: 10, scale: 2 }),
  operatorId: varchar("operator_id").references(() => salaries.id, { onDelete: "set null" }),
  operatorName: varchar("operator_name", { length: 200 }),
  year: integer("year"),
  fuelType: varchar("fuel_type", { length: 50 }),
  gpsUnit: varchar("gps_unit", { length: 100 }),
  meterUnit: varchar("meter_unit", { length: 100 }),
  hourlyRate: decimal("hourly_rate", { precision: 10, scale: 2 }),
  fuelConsumption: decimal("fuel_consumption", { precision: 10, scale: 2 }),
  maintenanceCost: decimal("maintenance_cost", { precision: 12, scale: 2 }),
  createdAt: timestamp("created_at").notNull().default(sql`now()`),
});

export const affectationsSalaries = pgTable("affectations_salaries", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  chantierId: varchar("chantier_id").notNull().references(() => chantiers.id, { onDelete: "cascade" }),
  salarieId: varchar("salarie_id").notNull().references(() => salaries.id, { onDelete: "cascade" }),
  dateDebut: date("date_debut").notNull(),
  dateFin: date("date_fin").notNull(),
  heuresParJour: decimal("heures_par_jour", { precision: 4, scale: 2 }).notNull(),
  notes: text("notes"),
  createdAt: timestamp("created_at").notNull().default(sql`now()`),
});

export const affectationsEquipements = pgTable("affectations_equipements", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  chantierId: varchar("chantier_id").notNull().references(() => chantiers.id, { onDelete: "cascade" }),
  equipementId: varchar("equipement_id").notNull().references(() => equipements.id, { onDelete: "cascade" }),
  dateDebut: date("date_debut").notNull(),
  dateFin: date("date_fin").notNull(),
  notes: text("notes"),
  createdAt: timestamp("created_at").notNull().default(sql`now()`),
});

export const usines = pgTable("usines", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  nom: text("nom").notNull(),
  localisation: text("localisation"),
  createdAt: timestamp("created_at").notNull().default(sql`now()`),
});

export const stockItems = pgTable("stock_items", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  itemId: varchar("item_id", { length: 100 }).notNull().unique(),
  nom: text("nom").notNull(),
  usineId: varchar("usine_id").references(() => usines.id, { onDelete: "set null" }),
  categorie: varchar("categorie", { length: 100 }),
  quantite: decimal("quantite", { precision: 12, scale: 2 }).notNull().default("0"),
  unite: varchar("unite", { length: 50 }),
  createdAt: timestamp("created_at").notNull().default(sql`now()`),
});

export const depenses = pgTable("depenses", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  chantierId: varchar("chantier_id").references(() => chantiers.id, { onDelete: "cascade" }),
  niveau: varchar("niveau", { length: 20 }).notNull().default("chantier"),
  categorie: varchar("categorie", { length: 100 }).notNull(),
  description: text("description").notNull(),
  montant: decimal("montant", { precision: 12, scale: 2 }).notNull(),
  quantite: decimal("quantite", { precision: 12, scale: 2 }),
  date: date("date").notNull(),
  facture: varchar("facture", { length: 100 }),
  stockItemId: varchar("stock_item_id").references(() => stockItems.id, { onDelete: "set null" }),
  statutReception: varchar("statut_reception", { length: 20 }).notNull().default("en_attente"),
  dateReception: date("date_reception"),
  operateurReception: text("operateur_reception"),
  photoFacturePath: text("photo_facture_path"),
  createdAt: timestamp("created_at").notNull().default(sql`now()`),
});

// Factory operations data
export const usineConsommations = pgTable("usine_consommations", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  usineId: varchar("usine_id").notNull().references(() => usines.id, { onDelete: "cascade" }),
  date: date("date").notNull(),
  consommationElectrique: decimal("consommation_electrique", { precision: 12, scale: 2 }),
  consommationGaz: decimal("consommation_gaz", { precision: 12, scale: 2 }),
  unite: varchar("unite", { length: 50 }).notNull().default("kWh"),
  createdAt: timestamp("created_at").notNull().default(sql`now()`),
});

export const usineProductions = pgTable("usine_productions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  usineId: varchar("usine_id").notNull().references(() => usines.id, { onDelete: "cascade" }),
  date: date("date").notNull(),
  typeMarchandise: varchar("type_marchandise", { length: 100 }).notNull(),
  tonnesRecues: decimal("tonnes_recues", { precision: 12, scale: 2 }),
  tonnesVendues: decimal("tonnes_vendues", { precision: 12, scale: 2 }),
  clientId: varchar("client_id"),
  clientNom: text("client_nom"),
  notes: text("notes"),
  createdAt: timestamp("created_at").notNull().default(sql`now()`),
});

export const usineAffectationsSalaries = pgTable("usine_affectations_salaries", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  usineId: varchar("usine_id").notNull().references(() => usines.id, { onDelete: "cascade" }),
  salarieId: varchar("salarie_id").notNull().references(() => salaries.id, { onDelete: "cascade" }),
  date: date("date").notNull(),
  heuresParJour: decimal("heures_par_jour", { precision: 4, scale: 2 }).notNull().default("8"),
  notes: text("notes"),
  createdAt: timestamp("created_at").notNull().default(sql`now()`),
});

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
});

export const insertChantierSchema = createInsertSchema(chantiers).omit({
  id: true,
  createdAt: true,
  budgetRealise: true,
  progression: true,
});

export const insertSalarieSchema = createInsertSchema(salaries).omit({
  id: true,
  createdAt: true,
});

export const insertEquipementSchema = createInsertSchema(equipements).omit({
  id: true,
  createdAt: true,
});

export const insertAffectationSalarieSchema = createInsertSchema(affectationsSalaries).omit({
  id: true,
  createdAt: true,
});

export const insertAffectationEquipementSchema = createInsertSchema(affectationsEquipements).omit({
  id: true,
  createdAt: true,
});

export const insertUsineSchema = createInsertSchema(usines).omit({
  id: true,
  createdAt: true,
});

export const insertStockItemSchema = createInsertSchema(stockItems).omit({
  id: true,
  createdAt: true,
});

export const insertDepenseSchema = createInsertSchema(depenses).omit({
  id: true,
  createdAt: true,
  statutReception: true,
  dateReception: true,
  operateurReception: true,
  photoFacturePath: true,
});

export const insertUsineConsommationSchema = createInsertSchema(usineConsommations).omit({
  id: true,
  createdAt: true,
});

export const insertUsineProductionSchema = createInsertSchema(usineProductions).omit({
  id: true,
  createdAt: true,
});

export const insertUsineAffectationSalarieSchema = createInsertSchema(usineAffectationsSalaries).omit({
  id: true,
  createdAt: true,
});

export type InsertUsine = z.infer<typeof insertUsineSchema>;
export type Usine = typeof usines.$inferSelect;

export type InsertUsineConsommation = z.infer<typeof insertUsineConsommationSchema>;
export type UsineConsommation = typeof usineConsommations.$inferSelect;

export type InsertUsineProduction = z.infer<typeof insertUsineProductionSchema>;
export type UsineProduction = typeof usineProductions.$inferSelect;

export type InsertUsineAffectationSalarie = z.infer<typeof insertUsineAffectationSalarieSchema>;
export type UsineAffectationSalarie = typeof usineAffectationsSalaries.$inferSelect;

export type InsertStockItem = z.infer<typeof insertStockItemSchema>;
export type StockItem = typeof stockItems.$inferSelect;

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertChantier = z.infer<typeof insertChantierSchema>;
export type Chantier = typeof chantiers.$inferSelect;

export type InsertSalarie = z.infer<typeof insertSalarieSchema>;
export type Salarie = typeof salaries.$inferSelect;

export type InsertEquipement = z.infer<typeof insertEquipementSchema>;
export type Equipement = typeof equipements.$inferSelect;

export type InsertAffectationSalarie = z.infer<typeof insertAffectationSalarieSchema>;
export type AffectationSalarie = typeof affectationsSalaries.$inferSelect;

export type InsertAffectationEquipement = z.infer<typeof insertAffectationEquipementSchema>;
export type AffectationEquipement = typeof affectationsEquipements.$inferSelect;

export type InsertDepense = z.infer<typeof insertDepenseSchema>;
export type Depense = typeof depenses.$inferSelect;
