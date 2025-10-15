import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from "ws";
import * as schema from "@shared/schema";
import 'dotenv/config';

neonConfig.webSocketConstructor = ws;

if (!process.env.DATABASE_URL) {
  console.warn(
    "⚠️ DATABASE_URL n'est pas configurée. Veuillez configurer votre base de données."
  );
  // Pour l'instant, nous continuons avec une URL factice pour permettre le démarrage
  process.env.DATABASE_URL = "postgresql://user:pass@localhost:5432/db";
}

export const pool = new Pool({ connectionString: process.env.DATABASE_URL });
export const db = drizzle({ client: pool, schema });
