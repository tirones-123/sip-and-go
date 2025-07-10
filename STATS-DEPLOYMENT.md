# 🚀 Guide de déploiement - Système de stats PWA

## 📦 Qu'est-ce qui a été créé ?

Un système **ultra-simple** pour tracker les téléchargements de votre PWA SIP&GO! sans aucune dépendance externe.

## 📁 Fichiers créés

```
votre-projet/
├── .htaccess                # ✅ Redirections racine (nouveau)
├── stats/
│   ├── count.php            # ✅ API de comptage
│   ├── downloads.json       # ✅ Stockage des données
│   ├── index.html           # ✅ Page de visualisation
│   ├── .htaccess            # ✅ Protection dossier stats (nouveau)
│   └── README.md            # ✅ Documentation
├── src/utils/analytics.ts   # ✅ Modifié pour le tracking
└── STATS-DEPLOYMENT.md     # ✅ Ce guide
```

## 🎯 Installation en 4 étapes

### 1. Upload sur votre serveur
```bash
# Uploadez TOUS les fichiers à la racine de votre site
scp -r .htaccess stats/ user@votre-serveur.com:/var/www/html/
```

### 2. Permissions de fichiers
```bash
chmod 664 stats/downloads.json
chmod 644 stats/count.php
chmod 644 stats/index.html
chmod 644 stats/.htaccess
chmod 644 .htaccess
```

### 3. Protection des redirections
Les fichiers `.htaccess` empêchent que `/stats/` soit redirigé vers votre app :

**Racine (`.htaccess`)** :
```apache
# Exclure /stats/ des redirections vers l'app React
RewriteRule ^stats/ - [L]
```

**Stats (`/stats/.htaccess`)** :
```apache
# Forcer l'accès direct aux pages de stats
RewriteRule ^(.*)$ - [L]
```

### 4. Test
- **Page stats** : `https://votre-site.com/stats/`
- **API test** : `https://votre-site.com/stats/count.php`

## 🎉 C'est tout !

Votre système de stats est **opérationnel** et **isolé** ! 

### 📊 Accès aux statistiques
- **URL** : `https://votre-site.com/stats/`
- **Design** : Aux couleurs SIP&GO!
- **Auto-refresh** : Toutes les 30 secondes
- **Pas de redirection** : Accès direct aux stats

### 📱 Tracking automatique
- Se déclenche quand quelqu'un **installe réellement** votre PWA
- Pas de faux positifs (pas de comptage sur simple affichage du prompt)
- Fonctionne sur **tous les navigateurs** supportant les PWA

### 🔒 Sécurité + Isolation
- ✅ Fichier JSON protégé des accès directs
- ✅ Headers de sécurité HTTP
- ✅ Validation des requêtes
- ✅ **Dossier stats isolé** de l'app principale
- ✅ **Aucune redirection** vers React Router

## 🎯 Résultat attendu

### URLs fonctionnelles :
- `votre-site.com/` → App SIP&GO! React
- `votre-site.com/stats/` → Page de statistiques ✅
- `votre-site.com/stats/count.php` → API de comptage ✅

### Process d'installation :
1. **Event `appinstalled`** se déclenche
2. **Requête POST** envoyée vers `/stats/count.php`
3. **Compteur +1** dans `downloads.json`
4. **Stats visibles** sur `/stats/`

## 🆘 Dépannage rapide

### Le compteur reste à 0 ?
```bash
# Vérifiez les permissions
ls -la stats/downloads.json

# Testez l'API manuellement
curl -X POST https://votre-site.com/stats/count.php
```

### Page stats redirige vers l'app ?
```bash
# Vérifiez que les .htaccess sont bien uploadés
ls -la .htaccess
ls -la stats/.htaccess

# Testez l'accès direct
curl -I https://votre-site.com/stats/
```

### Erreur 404 sur /stats/ ?
- Vérifiez que le dossier `stats/` est bien à la racine
- Consultez les logs d'erreur Apache/Nginx
- Testez : `https://votre-site.com/stats/index.html`

### Erreurs CORS ?
- L'API inclut déjà les headers CORS nécessaires
- Vérifiez que l'URL dans `analytics.ts` est correcte

## 🛡️ Isolation complète

### Redirection intelligente :
```apache
# App React : toutes les URLs sauf /stats/
votre-site.com/game → React Router
votre-site.com/players → React Router  
votre-site.com/anything → React Router

# Stats : accès direct
votre-site.com/stats/ → Page stats ✅
votre-site.com/stats/count.php → API ✅
```

### Protection des données :
- `downloads.json` → Inaccessible directement
- `stats/` → Pas de redirection vers React
- Headers sécurité → CSRF, XSS protection

## 🚀 Prêt à lancer !

Votre système de tracking PWA est **opérationnel**, **sécurisé** et **complètement isolé**. 

📈 Surveillez vos téléchargements en temps réel sur `/stats/` !

---

💡 **Besoin d'aide ?** Consultez le `stats/README.md` pour plus de détails. 