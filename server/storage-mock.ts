import { 
  type User, type InsertUser,
  type Chantier, type InsertChantier,
  type Salarie, type InsertSalarie,
  type Equipement, type InsertEquipement,
  type AffectationSalarie, type InsertAffectationSalarie,
  type AffectationEquipement, type InsertAffectationEquipement,
  type Depense, type InsertDepense,
  type Usine, type InsertUsine,
  type StockItem, type InsertStockItem
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

  // Affectations Salariés
  getAllAffectationsSalaries(): Promise<AffectationSalarie[]>;
  getAffectationSalarie(id: string): Promise<AffectationSalarie | undefined>;
  createAffectationSalarie(affectation: InsertAffectationSalarie): Promise<AffectationSalarie>;
  updateAffectationSalarie(id: string, affectation: Partial<InsertAffectationSalarie>): Promise<AffectationSalarie | undefined>;
  deleteAffectationSalarie(id: string): Promise<void>;

  // Affectations Équipements
  getAllAffectationsEquipements(): Promise<AffectationEquipement[]>;
  getAffectationEquipement(id: string): Promise<AffectationEquipement | undefined>;
  createAffectationEquipement(affectation: InsertAffectationEquipement): Promise<AffectationEquipement>;
  updateAffectationEquipement(id: string, affectation: Partial<InsertAffectationEquipement>): Promise<AffectationEquipement | undefined>;
  deleteAffectationEquipement(id: string): Promise<void>;

  // Dépenses
  getAllDepenses(): Promise<Depense[]>;
  getDepense(id: string): Promise<Depense | undefined>;
  createDepense(depense: InsertDepense): Promise<Depense>;
  updateDepense(id: string, depense: Partial<InsertDepense>): Promise<Depense | undefined>;
  deleteDepense(id: string): Promise<void>;

  // Usines
  getAllUsines(): Promise<Usine[]>;
  getUsine(id: string): Promise<Usine | undefined>;
  createUsine(usine: InsertUsine): Promise<Usine>;
  updateUsine(id: string, usine: Partial<InsertUsine>): Promise<Usine | undefined>;
  deleteUsine(id: string): Promise<void>;

  // Stock
  getAllStockItems(): Promise<StockItem[]>;
  getStockItem(id: string): Promise<StockItem | undefined>;
  createStockItem(stockItem: InsertStockItem): Promise<StockItem>;
  updateStockItem(id: string, stockItem: Partial<InsertStockItem>): Promise<StockItem | undefined>;
  deleteStockItem(id: string): Promise<void>;

  // Batch inserts
  insertEquipements(equipements: InsertEquipement[]): Promise<Equipement[]>;
}

// Mock storage implementation
class MockStorage implements IStorage {
  private mockData = {
    users: [] as User[],
    chantiers: [] as Chantier[],
    salaries: [] as Salarie[],
    equipements: [] as Equipement[],
    affectationsSalaries: [] as AffectationSalarie[],
    affectationsEquipements: [] as AffectationEquipement[],
    depenses: [] as Depense[],
    usines: [] as Usine[],
    stockItems: [] as StockItem[]
  };

  // Helper to generate ID
  private generateId(): string {
    return Date.now().toString() + Math.random().toString(36).substr(2, 9);
  }

  // Users
  async getUser(id: string): Promise<User | undefined> {
    return this.mockData.users.find(u => u.id === id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return this.mockData.users.find(u => u.username === username);
  }

  async createUser(user: InsertUser): Promise<User> {
    const newUser: User = { id: this.generateId(), ...user };
    this.mockData.users.push(newUser);
    return newUser;
  }

  // Chantiers
  async getAllChantiers(): Promise<Chantier[]> {
    return [...this.mockData.chantiers];
  }

  async getChantier(id: string): Promise<Chantier | undefined> {
    return this.mockData.chantiers.find(c => c.id === id);
  }

  async createChantier(chantier: InsertChantier): Promise<Chantier> {
    const newChantier: Chantier = { 
      id: this.generateId(), 
      createdAt: new Date(), 
      updatedAt: new Date(),
      ...chantier 
    };
    this.mockData.chantiers.push(newChantier);
    return newChantier;
  }

  async updateChantier(id: string, chantier: Partial<InsertChantier>): Promise<Chantier | undefined> {
    const index = this.mockData.chantiers.findIndex(c => c.id === id);
    if (index === -1) return undefined;
    
    this.mockData.chantiers[index] = { 
      ...this.mockData.chantiers[index], 
      ...chantier, 
      updatedAt: new Date() 
    };
    return this.mockData.chantiers[index];
  }

  async deleteChantier(id: string): Promise<void> {
    const index = this.mockData.chantiers.findIndex(c => c.id === id);
    if (index !== -1) {
      this.mockData.chantiers.splice(index, 1);
    }
  }

  // Salariés (méthodes similaires, simplifiées pour la démo)
  async getAllSalaries(): Promise<Salarie[]> {
    return [...this.mockData.salaries];
  }

  async getSalarie(id: string): Promise<Salarie | undefined> {
    return this.mockData.salaries.find(s => s.id === id);
  }

  async createSalarie(salarie: InsertSalarie): Promise<Salarie> {
    const newSalarie: Salarie = { 
      id: this.generateId(), 
      createdAt: new Date(), 
      updatedAt: new Date(),
      ...salarie 
    };
    this.mockData.salaries.push(newSalarie);
    return newSalarie;
  }

  async updateSalarie(id: string, salarie: Partial<InsertSalarie>): Promise<Salarie | undefined> {
    const index = this.mockData.salaries.findIndex(s => s.id === id);
    if (index === -1) return undefined;
    
    this.mockData.salaries[index] = { 
      ...this.mockData.salaries[index], 
      ...salarie, 
      updatedAt: new Date() 
    };
    return this.mockData.salaries[index];
  }

  async deleteSalarie(id: string): Promise<void> {
    const index = this.mockData.salaries.findIndex(s => s.id === id);
    if (index !== -1) {
      this.mockData.salaries.splice(index, 1);
    }
  }

  // Équipements
  async getAllEquipements(): Promise<Equipement[]> {
    return [...this.mockData.equipements];
  }

  async getEquipement(id: string): Promise<Equipement | undefined> {
    return this.mockData.equipements.find(e => e.id === id);
  }

  async createEquipement(equipement: InsertEquipement): Promise<Equipement> {
    const newEquipement: Equipement = { 
      id: this.generateId(), 
      createdAt: new Date(), 
      updatedAt: new Date(),
      ...equipement 
    };
    this.mockData.equipements.push(newEquipement);
    return newEquipement;
  }

  async updateEquipement(id: string, equipement: Partial<InsertEquipement>): Promise<Equipement | undefined> {
    const index = this.mockData.equipements.findIndex(e => e.id === id);
    if (index === -1) return undefined;
    
    this.mockData.equipements[index] = { 
      ...this.mockData.equipements[index], 
      ...equipement, 
      updatedAt: new Date() 
    };
    return this.mockData.equipements[index];
  }

  async deleteEquipement(id: string): Promise<void> {
    const index = this.mockData.equipements.findIndex(e => e.id === id);
    if (index !== -1) {
      this.mockData.equipements.splice(index, 1);
    }
  }

  // Pour les autres méthodes, on retourne des arrays vides ou des valeurs par défaut
  async getAllAffectationsSalaries(): Promise<AffectationSalarie[]> { return []; }
  async getAffectationSalarie(id: string): Promise<AffectationSalarie | undefined> { return undefined; }
  async createAffectationSalarie(affectation: InsertAffectationSalarie): Promise<AffectationSalarie> {
    return { id: this.generateId(), createdAt: new Date(), updatedAt: new Date(), ...affectation };
  }
  async updateAffectationSalarie(id: string, affectation: Partial<InsertAffectationSalarie>): Promise<AffectationSalarie | undefined> { return undefined; }
  async deleteAffectationSalarie(id: string): Promise<void> {}

  async getAllAffectationsEquipements(): Promise<AffectationEquipement[]> { return []; }
  async getAffectationEquipement(id: string): Promise<AffectationEquipement | undefined> { return undefined; }
  async createAffectationEquipement(affectation: InsertAffectationEquipement): Promise<AffectationEquipement> {
    return { id: this.generateId(), createdAt: new Date(), updatedAt: new Date(), ...affectation };
  }
  async updateAffectationEquipement(id: string, affectation: Partial<InsertAffectationEquipement>): Promise<AffectationEquipement | undefined> { return undefined; }
  async deleteAffectationEquipement(id: string): Promise<void> {}

  async getAllDepenses(): Promise<Depense[]> { return []; }
  async getDepense(id: string): Promise<Depense | undefined> { return undefined; }
  async createDepense(depense: InsertDepense): Promise<Depense> {
    return { id: this.generateId(), createdAt: new Date(), updatedAt: new Date(), ...depense };
  }
  async updateDepense(id: string, depense: Partial<InsertDepense>): Promise<Depense | undefined> { return undefined; }
  async deleteDepense(id: string): Promise<void> {}

  async getAllUsines(): Promise<Usine[]> { return []; }
  async getUsine(id: string): Promise<Usine | undefined> { return undefined; }
  async createUsine(usine: InsertUsine): Promise<Usine> {
    return { id: this.generateId(), createdAt: new Date(), updatedAt: new Date(), ...usine };
  }
  async updateUsine(id: string, usine: Partial<InsertUsine>): Promise<Usine | undefined> { return undefined; }
  async deleteUsine(id: string): Promise<void> {}

  async getAllStockItems(): Promise<StockItem[]> { return []; }
  async getStockItem(id: string): Promise<StockItem | undefined> { return undefined; }
  async createStockItem(stockItem: InsertStockItem): Promise<StockItem> {
    return { id: this.generateId(), createdAt: new Date(), updatedAt: new Date(), ...stockItem };
  }
  async updateStockItem(id: string, stockItem: Partial<InsertStockItem>): Promise<StockItem | undefined> { return undefined; }
  async deleteStockItem(id: string): Promise<void> {}

  async insertEquipements(equipements: InsertEquipement[]): Promise<Equipement[]> {
    const results: Equipement[] = [];
    for (const eq of equipements) {
      results.push(await this.createEquipement(eq));
    }
    return results;
  }
}

export const storage = new MockStorage();