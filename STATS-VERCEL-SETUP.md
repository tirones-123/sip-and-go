# 📊 SIP&GO! PWA Stats avec Vercel Functions

## 🎯 Aperçu

Ce système de tracking PWA utilise **Vercel Functions** (JavaScript) au lieu de PHP pour être compatible avec l'hébergement statique.

## 🏗️ Architecture

```
sip-and-go/
├── api/
│   └── count.js                # Vercel Function pour API
├── data/
│   └── downloads.json          # Stockage des données
├── public/
│   └── stats.html              # Interface de stats
└── src/utils/
    └── analytics.ts            # Tracking côté client
```

## 📁 Fichiers Créés

### 1. **api/count.js** - Vercel Function
- Remplace l'ancien `count.php`
- Endpoints: `GET /api/count` et `POST /api/count`
- Gestion CORS automatique
- Stockage dans `data/downloads.json`

### 2. **public/stats.html** - Interface Stats
- Page de visualisation des statistiques
- Design SIP&GO! cohérent
- Auto-refresh toutes les 30 secondes
- Responsive et moderne

### 3. **data/downloads.json** - Stockage
- Fichier JSON pour persister les données
- Format: `{ "count": 0, "last_updated": "..." }`
- Créé automatiquement si inexistant

## 🚀 Déploiement Vercel

### 1. Configuration Automatique
Vercel détecte automatiquement :
- Les fichiers dans `/api/` comme Functions
- Les fichiers dans `/public/` comme statiques
- Le fichier `vercel.json` pour la configuration

### 2. Déploiement
```bash
# Déployer avec Vercel CLI
vercel deploy

# Ou connecter votre repo GitHub à Vercel
# https://vercel.com/docs/git/vercel-for-github
```

### 3. Vérification
Après déploiement, testez :
- ✅ `https://votre-app.vercel.app/api/count` (GET)
- ✅ `https://votre-app.vercel.app/stats.html`
- ✅ Installation PWA (tracking automatique)

## 🔧 Fonctionnement

### Tracking Automatique
```javascript
// Dans analytics.ts
window.addEventListener('appinstalled', () => {
  trackPWAInstall(); // POST vers /api/count
});
```

### API Endpoints
```javascript
// GET /api/count - Récupérer les stats
{
  "count": 42,
  "last_updated": "2024-12-30T10:30:00.000Z"
}

// POST /api/count - Incrémenter
{
  "success": true,
  "count": 43
}
```

## 📈 Visualisation

Accédez à `https://votre-app.vercel.app/stats.html` pour voir :
- 📊 Compteur total de téléchargements
- 📅 Statistiques par jour
- 🔄 Actualisation automatique
- 📱 Interface responsive

## 🔒 Sécurité

### Avantages vs PHP
- ✅ Pas de serveur PHP à maintenir
- ✅ CORS géré automatiquement
- ✅ Scaling automatique Vercel
- ✅ Logs intégrés
- ✅ Pas de problèmes de permissions

### Limitation de Débit
Vercel Functions ont des limites :
- 1000 exécutions/mois (gratuit)
- 10s timeout max
- 50MB maximum package size

## 🐛 Débogage

### Logs Vercel
```bash
# Voir les logs en temps réel
vercel logs https://votre-app.vercel.app

# Ou dans le dashboard Vercel
# https://vercel.com/dashboard
```

### Test Local
```bash
# Installer Vercel CLI
npm i -g vercel

# Démarrer en local
vercel dev

# Tester l'API
curl http://localhost:3000/api/count
```

## 📝 Personnalisation

### Modifier les Stats
Éditez `public/stats.html` pour :
- Changer le design
- Ajouter des métriques
- Modifier les intervalles d'actualisation

### Enrichir l'API
Éditez `api/count.js` pour :
- Ajouter des métriques détaillées
- Stocker des données par date
- Ajouter de l'authentification

## 🎉 Avantages

1. **Simplicité** : Pas de configuration serveur PHP
2. **Fiabilité** : Infrastructure Vercel robuste
3. **Scalabilité** : Adaptation automatique à la charge
4. **Monitoring** : Logs et métriques intégrés
5. **Gratuit** : Tier gratuit généreux pour ce cas d'usage

## 📞 Support

Si vous rencontrez des problèmes :
1. Vérifiez les logs Vercel
2. Testez l'API directement
3. Vérifiez les permissions du fichier `data/downloads.json`

---

✨ **Fini les erreurs 403 ! Votre système de stats PWA est maintenant serverless et robuste.** 