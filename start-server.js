import { createRequire } from 'module';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const require = createRequire(import.meta.url);

// Configure module resolution
process.env.NODE_PATH = resolve(__dirname, 'node_modules');

// Import and start the server
async function startServer() {
  try {
    console.log('🔄 Démarrage du serveur...');
    const serverModule = await import('./server/index.ts');
    console.log('✅ Serveur démarré avec succès');
  } catch (error) {
    console.error('❌ Erreur lors du démarrage du serveur:', error);
    console.error('Stack trace:', error.stack);
  }
}

startServer();