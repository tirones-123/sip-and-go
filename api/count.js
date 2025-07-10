// Vercel Function pour tracker les téléchargements PWA
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join } from 'path';

const DATA_FILE = join(process.cwd(), 'data', 'downloads.json');

// Assurer que le dossier data existe
import { mkdirSync } from 'fs';
const dataDir = join(process.cwd(), 'data');
if (!existsSync(dataDir)) {
  mkdirSync(dataDir, { recursive: true });
}

export default async function handler(req, res) {
  // Headers CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  // Gérer les requêtes OPTIONS (preflight)
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    if (req.method === 'POST') {
      // Lire le compteur actuel
      let data;
      if (existsSync(DATA_FILE)) {
        const content = readFileSync(DATA_FILE, 'utf8');
        data = JSON.parse(content);
      } else {
        data = { count: 0, last_updated: new Date().toISOString() };
      }
      
      // Incrémenter
      data.count++;
      data.last_updated = new Date().toISOString();
      
      // Sauvegarder
      writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
      
      return res.status(200).json({ success: true, count: data.count });
      
    } else if (req.method === 'GET') {
      // Récupérer le compteur
      if (existsSync(DATA_FILE)) {
        const content = readFileSync(DATA_FILE, 'utf8');
        const data = JSON.parse(content);
        return res.status(200).json(data);
      } else {
        return res.status(200).json({ count: 0, last_updated: 'Never' });
      }
    } else {
      return res.status(405).json({ error: 'Method not allowed' });
    }
    
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ 
      error: true, 
      message: error.message,
      debug: {
        platform: 'vercel',
        timestamp: new Date().toISOString()
      }
    });
  }
} 