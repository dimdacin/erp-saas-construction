import { db } from "./db";
import { eq, desc } from "drizzle-orm";
import { 
  users, chantiers, salaries, equipements, 
  affectationsSalaries, affectationsEquipements, depenses,
  type User, type InsertUser,
  type Chantier, type InsertChantier,
  type Salarie, type InsertSalarie,
  type Equipement, type InsertEquipement,
  type AffectationSalarie, type InsertAffectationSalarie,
  type AffectationEquipement, type InsertAffectationEquipement,
  type Depense, type InsertDepense
} from "@shared/schema";

export interface IStorage {
  // Users
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Chantiers
  getAllChantiers(): Promise<Chantier[]>;
  getChantier(id: string): Promise<Chantier | undefined>;
  createChantier(chantier: InsertChantier): Promise<Chantier>;
  updateChantier(id: string, chantier: Partial<InsertChantier>): Promise<Chantier | undefined>;
  deleteChantier(id: string): Promise<void>;

  // Salariés
  getAllSalaries(): Promise<Salarie[]>;
  getSalarie(id: string): Promise<Salarie | undefined>;
  createSalarie(salarie: InsertSalarie): Promise<Salarie>;
  updateSalarie(id: string, salarie: Partial<InsertSalarie>): Promise<Salarie | undefined>;
  deleteSalarie(id: string): Promise<void>;

  // Équipements
  getAllEquipements(): Promise<Equipement[]>;
  getEquipement(id: string): Promise<Equipement | undefined>;
  createEquipement(equipement: InsertEquipement): Promise<Equipement>;
  updateEquipement(id: string, equipement: Partial<InsertEquipement>): Promise<Equipement | undefined>;
  deleteEquipement(id: string): Promise<void>;
  deleteAllEquipements(): Promise<void>;

  // Affectations Salariés
  getAllAffectationsSalaries(): Promise<AffectationSalarie[]>;
  getAffectationsSalariesByChantier(chantierId: string): Promise<AffectationSalarie[]>;
  createAffectationSalarie(affectation: InsertAffectationSalarie): Promise<AffectationSalarie>;
  deleteAffectationSalarie(id: string): Promise<void>;

  // Affectations Équipements
  getAllAffectationsEquipements(): Promise<AffectationEquipement[]>;
  getAffectationsEquipementsByChantier(chantierId: string): Promise<AffectationEquipement[]>;
  createAffectationEquipement(affectation: InsertAffectationEquipement): Promise<AffectationEquipement>;
  deleteAffectationEquipement(id: string): Promise<void>;

  // Dépenses
  getAllDepenses(): Promise<Depense[]>;
  getDepensesByChantier(chantierId: string): Promise<Depense[]>;
  createDepense(depense: InsertDepense): Promise<Depense>;
  deleteDepense(id: string): Promise<void>;
}

export class DbStorage implements IStorage {
  // Users
  async getUser(id: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
    return result[0];
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.username, username)).limit(1);
    return result[0];
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const result = await db.insert(users).values(insertUser).returning();
    return result[0];
  }

  // Chantiers
  async getAllChantiers(): Promise<Chantier[]> {
    return await db.select().from(chantiers).orderBy(desc(chantiers.createdAt));
  }

  async getChantier(id: string): Promise<Chantier | undefined> {
    const result = await db.select().from(chantiers).where(eq(chantiers.id, id)).limit(1);
    return result[0];
  }

  async createChantier(insertChantier: InsertChantier): Promise<Chantier> {
    const result = await db.insert(chantiers).values(insertChantier).returning();
    return result[0];
  }

  async updateChantier(id: string, chantier: Partial<InsertChantier>): Promise<Chantier | undefined> {
    const result = await db.update(chantiers).set(chantier).where(eq(chantiers.id, id)).returning();
    return result[0];
  }

  async deleteChantier(id: string): Promise<void> {
    await db.delete(chantiers).where(eq(chantiers.id, id));
  }

  // Salariés
  async getAllSalaries(): Promise<Salarie[]> {
    return await db.select().from(salaries).orderBy(desc(salaries.createdAt));
  }

  async getSalarie(id: string): Promise<Salarie | undefined> {
    const result = await db.select().from(salaries).where(eq(salaries.id, id)).limit(1);
    return result[0];
  }

  async createSalarie(insertSalarie: InsertSalarie): Promise<Salarie> {
    const result = await db.insert(salaries).values(insertSalarie).returning();
    return result[0];
  }

  async updateSalarie(id: string, salarie: Partial<InsertSalarie>): Promise<Salarie | undefined> {
    const result = await db.update(salaries).set(salarie).where(eq(salaries.id, id)).returning();
    return result[0];
  }

  async deleteSalarie(id: string): Promise<void> {
    await db.delete(salaries).where(eq(salaries.id, id));
  }

  // Équipements
  async getAllEquipements(): Promise<Equipement[]> {
    return await db.select().from(equipements).orderBy(desc(equipements.createdAt));
  }

  async getEquipement(id: string): Promise<Equipement | undefined> {
    const result = await db.select().from(equipements).where(eq(equipements.id, id)).limit(1);
    return result[0];
  }

  async createEquipement(insertEquipement: InsertEquipement): Promise<Equipement> {
    const result = await db.insert(equipements).values(insertEquipement).returning();
    return result[0];
  }

  async updateEquipement(id: string, equipement: Partial<InsertEquipement>): Promise<Equipement | undefined> {
    const result = await db.update(equipements).set(equipement).where(eq(equipements.id, id)).returning();
    return result[0];
  }

  async deleteEquipement(id: string): Promise<void> {
    await db.delete(equipements).where(eq(equipements.id, id));
  }

  async deleteAllEquipements(): Promise<void> {
    await db.delete(equipements);
  }

  // Affectations Salariés
  async getAllAffectationsSalaries(): Promise<AffectationSalarie[]> {
    return await db.select().from(affectationsSalaries).orderBy(desc(affectationsSalaries.dateDebut));
  }

  async getAffectationsSalariesByChantier(chantierId: string): Promise<AffectationSalarie[]> {
    return await db.select().from(affectationsSalaries)
      .where(eq(affectationsSalaries.chantierId, chantierId))
      .orderBy(desc(affectationsSalaries.dateDebut));
  }

  async createAffectationSalarie(insertAffectation: InsertAffectationSalarie): Promise<AffectationSalarie> {
    const result = await db.insert(affectationsSalaries).values(insertAffectation).returning();
    return result[0];
  }

  async deleteAffectationSalarie(id: string): Promise<void> {
    await db.delete(affectationsSalaries).where(eq(affectationsSalaries.id, id));
  }

  // Affectations Équipements
  async getAllAffectationsEquipements(): Promise<AffectationEquipement[]> {
    return await db.select().from(affectationsEquipements).orderBy(desc(affectationsEquipements.dateDebut));
  }

  async getAffectationsEquipementsByChantier(chantierId: string): Promise<AffectationEquipement[]> {
    return await db.select().from(affectationsEquipements)
      .where(eq(affectationsEquipements.chantierId, chantierId))
      .orderBy(desc(affectationsEquipements.dateDebut));
  }

  async createAffectationEquipement(insertAffectation: InsertAffectationEquipement): Promise<AffectationEquipement> {
    const result = await db.insert(affectationsEquipements).values(insertAffectation).returning();
    return result[0];
  }

  async deleteAffectationEquipement(id: string): Promise<void> {
    await db.delete(affectationsEquipements).where(eq(affectationsEquipements.id, id));
  }

  // Dépenses
  async getAllDepenses(): Promise<Depense[]> {
    return await db.select().from(depenses).orderBy(desc(depenses.date));
  }

  async getDepensesByChantier(chantierId: string): Promise<Depense[]> {
    return await db.select().from(depenses)
      .where(eq(depenses.chantierId, chantierId))
      .orderBy(desc(depenses.date));
  }

  async createDepense(insertDepense: InsertDepense): Promise<Depense> {
    const result = await db.insert(depenses).values(insertDepense).returning();
    return result[0];
  }

  async deleteDepense(id: string): Promise<void> {
    await db.delete(depenses).where(eq(depenses.id, id));
  }
}

export const storage = new DbStorage();
