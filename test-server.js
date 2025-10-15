import express from "express";

const app = express();
const port = 5000;

app.get('/', (req, res) => {
  res.json({ message: 'ERP SaaS Construction - Serveur en fonctionnement!', timestamp: new Date().toISOString() });
});

app.get('/api/test', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'API fonctionnelle',
    environment: process.env.NODE_ENV || 'development'
  });
});

app.listen(port, '0.0.0.0', () => {
  console.log(`🚀 Serveur de test lancé sur http://localhost:${port}`);
  console.log(`📝 Testez l'API sur http://localhost:${port}/api/test`);
});