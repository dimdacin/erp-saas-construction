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
  nom: text("nom").notNull(),
  statut: varchar("statut", { length: 50 }).notNull(),
  budgetPrevisionnel: decimal("budget_previsionnel", { precision: 12, scale: 2 }).notNull(),
  budgetRealise: decimal("budget_realise", { precision: 12, scale: 2 }).notNull().default("0"),
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
  createdAt: timestamp("created_at").notNull().default(sql`now()`),
});

export const equipements = pgTable("equipements", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  nom: text("nom").notNull(),
  type: text("type").notNull(),
  marque: varchar("marque", { length: 100 }),
  modele: varchar("modele", { length: 100 }),
  numeroSerie: varchar("numero_serie", { length: 100 }),
  statut: varchar("statut", { length: 50 }).notNull().default("disponible"),
  localisation: text("localisation"),
  dateAchat: date("date_achat"),
  coutJournalier: decimal("cout_journalier", { precision: 10, scale: 2 }),
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

export const depenses = pgTable("depenses", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  chantierId: varchar("chantier_id").notNull().references(() => chantiers.id, { onDelete: "cascade" }),
  categorie: varchar("categorie", { length: 100 }).notNull(),
  description: text("description").notNull(),
  montant: decimal("montant", { precision: 12, scale: 2 }).notNull(),
  date: date("date").notNull(),
  facture: varchar("facture", { length: 100 }),
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

export const insertDepenseSchema = createInsertSchema(depenses).omit({
  id: true,
  createdAt: true,
});

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
