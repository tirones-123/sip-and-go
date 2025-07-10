# 🚨 Résolution erreur 403 Forbidden - Stats PWA

## 🔍 Diagnostic rapide

### Étape 1: Test PHP de base
Allez sur : `https://sip-and-go.com/stats/test.php`

**Si ça fonctionne** ✅ → PHP OK, problème de permissions
**Si ça ne fonctionne pas** ❌ → Problème de configuration serveur

### Étape 2: Vérifier les permissions par FTP/SSH
```bash
# Connectez-vous à votre serveur et vérifiez :
ls -la stats/
chmod 644 stats/count.php
chmod 644 stats/index.html
chmod 664 stats/downloads.json
chmod 644 stats/.htaccess
```

### Étape 3: Test de l'API améliorée
Allez sur : `https://sip-and-go.com/stats/count.php`

## 🔧 Solutions par scénario

### Scénario A: "test.php" fonctionne mais pas "count.php"
```bash
# Permissions fichier
chmod 644 stats/count.php

# Ou re-uploadez count.php avec un client FTP
```

### Scénario B: Aucun fichier PHP ne fonctionne
```bash
# 1. Vérifiez que PHP est activé dans le dossier stats
# 2. Créez un .htaccess minimal dans stats/
echo "AddHandler application/x-httpd-php .php" > stats/.htaccess

# 3. Ou renommez le dossier en "api" au lieu de "stats"
mv stats api
```

### Scénario C: Problème d'hébergeur (OVH, Hostinger, etc.)
```bash
# Certains hébergeurs bloquent les dossiers nommés "stats"
# Solution: renommer le dossier

mv stats pwa-stats
# Puis modifiez l'URL dans analytics.ts
```

## 🚀 Solutions testées

### Solution 1: .htaccess minimal (FAIT ✅)
J'ai simplifié le .htaccess pour éviter les conflits.

### Solution 2: count.php robuste (FAIT ✅)
J'ai amélioré count.php avec diagnostics intégrés.

### Solution 3: Fichier de test (FAIT ✅)
Créé test.php pour diagnostics.

## 🎯 Actions immédiates

### 1. Testez ces URLs dans l'ordre :
- `https://sip-and-go.com/stats/test.php`
- `https://sip-and-go.com/stats/count.php`
- `https://sip-and-go.com/stats/`

### 2. Si toujours 403, essayez :
```bash
# Renommer le dossier (certains hébergeurs bloquent "stats")
mv stats analytics
mv stats api
mv stats pwa-counter
```

### 3. Si problème persistant, solution alternative :
```bash
# Déplacez count.php à la racine du site
mv stats/count.php ./api.php
# Puis modifiez analytics.ts : STATS_URL = '/api.php'
```

## 📞 Diagnostic par erreur spécifique

### "403 Forbidden" + ID CDG1
- **Cause**: Serveur Vercel/Netlify qui bloque PHP
- **Solution**: Utiliser Vercel Functions ou Netlify Functions

### "403 Forbidden" + permissions denied
- **Cause**: Permissions fichiers
- **Solution**: `chmod 644 count.php`

### "403 Forbidden" + directory not allowed
- **Cause**: Hébergeur bloque le dossier "stats"
- **Solution**: Renommer en "api" ou "analytics"

## 🔄 Alternative sans PHP

Si PHP ne fonctionne vraiment pas, je peux créer une version avec Vercel Functions :

```javascript
// api/count.js (Vercel)
export default async function handler(req, res) {
  // Code equivalent en JavaScript
}
```

## 📝 Rapport de diagnostic

Une fois testé, dites-moi :
1. **test.php** : Fonctionne ✅ / 403 ❌
2. **count.php** : Fonctionne ✅ / 403 ❌ / Message d'erreur
3. **Type d'hébergement** : OVH / Hostinger / Autre ?

Je pourrai alors proposer une solution spécifique ! 🎯 