import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertChantierSchema, insertSalarieSchema, insertEquipementSchema,
  insertAffectationSalarieSchema, insertAffectationEquipementSchema, insertDepenseSchema
} from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  
  // ========== CHANTIERS ROUTES ==========
  app.get("/api/chantiers", async (req, res) => {
    try {
      const chantiers = await storage.getAllChantiers();
      res.json(chantiers);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch chantiers" });
    }
  });

  app.get("/api/chantiers/:id", async (req, res) => {
    try {
      const chantier = await storage.getChantier(req.params.id);
      if (!chantier) {
        return res.status(404).json({ error: "Chantier not found" });
      }
      res.json(chantier);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch chantier" });
    }
  });

  app.post("/api/chantiers", async (req, res) => {
    try {
      const validated = insertChantierSchema.parse(req.body);
      const chantier = await storage.createChantier(validated);
      res.status(201).json(chantier);
    } catch (error) {
      res.status(400).json({ error: "Invalid chantier data" });
    }
  });

  app.patch("/api/chantiers/:id", async (req, res) => {
    try {
      const chantier = await storage.updateChantier(req.params.id, req.body);
      if (!chantier) {
        return res.status(404).json({ error: "Chantier not found" });
      }
      res.json(chantier);
    } catch (error) {
      res.status(400).json({ error: "Failed to update chantier" });
    }
  });

  app.delete("/api/chantiers/:id", async (req, res) => {
    try {
      await storage.deleteChantier(req.params.id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete chantier" });
    }
  });

  // ========== SALARIÉS ROUTES ==========
  app.get("/api/salaries", async (req, res) => {
    try {
      const salaries = await storage.getAllSalaries();
      res.json(salaries);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch salaries" });
    }
  });

  app.get("/api/salaries/:id", async (req, res) => {
    try {
      const salarie = await storage.getSalarie(req.params.id);
      if (!salarie) {
        return res.status(404).json({ error: "Salarie not found" });
      }
      res.json(salarie);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch salarie" });
    }
  });

  app.post("/api/salaries", async (req, res) => {
    try {
      const validated = insertSalarieSchema.parse(req.body);
      const salarie = await storage.createSalarie(validated);
      res.status(201).json(salarie);
    } catch (error) {
      res.status(400).json({ error: "Invalid salarie data" });
    }
  });

  app.patch("/api/salaries/:id", async (req, res) => {
    try {
      const salarie = await storage.updateSalarie(req.params.id, req.body);
      if (!salarie) {
        return res.status(404).json({ error: "Salarie not found" });
      }
      res.json(salarie);
    } catch (error) {
      res.status(400).json({ error: "Failed to update salarie" });
    }
  });

  app.delete("/api/salaries/:id", async (req, res) => {
    try {
      await storage.deleteSalarie(req.params.id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete salarie" });
    }
  });

  // ========== ÉQUIPEMENTS ROUTES ==========
  app.get("/api/equipements", async (req, res) => {
    try {
      const equipements = await storage.getAllEquipements();
      res.json(equipements);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch equipements" });
    }
  });

  app.get("/api/equipements/:id", async (req, res) => {
    try {
      const equipement = await storage.getEquipement(req.params.id);
      if (!equipement) {
        return res.status(404).json({ error: "Equipement not found" });
      }
      res.json(equipement);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch equipement" });
    }
  });

  app.post("/api/equipements", async (req, res) => {
    try {
      const validated = insertEquipementSchema.parse(req.body);
      const equipement = await storage.createEquipement(validated);
      res.status(201).json(equipement);
    } catch (error) {
      res.status(400).json({ error: "Invalid equipement data" });
    }
  });

  app.patch("/api/equipements/:id", async (req, res) => {
    try {
      const equipement = await storage.updateEquipement(req.params.id, req.body);
      if (!equipement) {
        return res.status(404).json({ error: "Equipement not found" });
      }
      res.json(equipement);
    } catch (error) {
      res.status(400).json({ error: "Failed to update equipement" });
    }
  });

  app.delete("/api/equipements/:id", async (req, res) => {
    try {
      await storage.deleteEquipement(req.params.id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete equipement" });
    }
  });

  // ========== AFFECTATIONS SALARIÉS ROUTES ==========
  app.get("/api/affectations/salaries", async (req, res) => {
    try {
      const chantierId = req.query.chantierId as string | undefined;
      const affectations = chantierId 
        ? await storage.getAffectationsSalariesByChantier(chantierId)
        : await storage.getAllAffectationsSalaries();
      res.json(affectations);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch affectations" });
    }
  });

  app.post("/api/affectations/salaries", async (req, res) => {
    try {
      const validated = insertAffectationSalarieSchema.parse(req.body);
      const affectation = await storage.createAffectationSalarie(validated);
      res.status(201).json(affectation);
    } catch (error) {
      res.status(400).json({ error: "Invalid affectation data" });
    }
  });

  app.delete("/api/affectations/salaries/:id", async (req, res) => {
    try {
      await storage.deleteAffectationSalarie(req.params.id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete affectation" });
    }
  });

  // ========== AFFECTATIONS ÉQUIPEMENTS ROUTES ==========
  app.get("/api/affectations/equipements", async (req, res) => {
    try {
      const chantierId = req.query.chantierId as string | undefined;
      const affectations = chantierId 
        ? await storage.getAffectationsEquipementsByChantier(chantierId)
        : await storage.getAllAffectationsEquipements();
      res.json(affectations);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch affectations" });
    }
  });

  app.post("/api/affectations/equipements", async (req, res) => {
    try {
      const validated = insertAffectationEquipementSchema.parse(req.body);
      const affectation = await storage.createAffectationEquipement(validated);
      res.status(201).json(affectation);
    } catch (error) {
      res.status(400).json({ error: "Invalid affectation data" });
    }
  });

  app.delete("/api/affectations/equipements/:id", async (req, res) => {
    try {
      await storage.deleteAffectationEquipement(req.params.id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete affectation" });
    }
  });

  // ========== DÉPENSES ROUTES ==========
  app.get("/api/depenses", async (req, res) => {
    try {
      const chantierId = req.query.chantierId as string | undefined;
      const depenses = chantierId 
        ? await storage.getDepensesByChantier(chantierId)
        : await storage.getAllDepenses();
      res.json(depenses);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch depenses" });
    }
  });

  app.post("/api/depenses", async (req, res) => {
    try {
      const validated = insertDepenseSchema.parse(req.body);
      const depense = await storage.createDepense(validated);
      res.status(201).json(depense);
    } catch (error) {
      res.status(400).json({ error: "Invalid depense data" });
    }
  });

  app.delete("/api/depenses/:id", async (req, res) => {
    try {
      await storage.deleteDepense(req.params.id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete depense" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
