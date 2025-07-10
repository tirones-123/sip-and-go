# 📊 SIP&GO! PWA Statistics

Ce dossier contient un système simple de tracking des téléchargements PWA pour SIP&GO!.

## 🗂️ Structure des fichiers

```
stats/
├── count.php        # API PHP pour incrémenter/récupérer le compteur
├── downloads.json   # Fichier de stockage des données
├── index.html       # Page d'affichage des statistiques
└── README.md        # Ce fichier
```

## 🚀 Installation

### 1. Upload sur votre serveur
Uploadez tout le dossier `stats/` vers la racine de votre site web :
```
votre-site.com/
├── app/            # Votre PWA SIP&GO!
├── stats/          # Dossier de statistiques
│   ├── count.php
│   ├── downloads.json
│   ├── index.html
│   └── README.md
```

### 2. Permissions de fichier
Assurez-vous que le serveur peut écrire dans `downloads.json` :
```bash
chmod 664 downloads.json
chmod 644 count.php
chmod 644 index.html
```

### 3. Test
- **API** : `votre-site.com/stats/count.php` 
- **Statistiques** : `votre-site.com/stats/`

## 📱 Comment ça fonctionne

### Tracking automatique
L'app SIP&GO! track automatiquement les installations PWA via l'événement `appinstalled` dans `src/utils/analytics.ts`.

### Événements trackés
- ✅ Installation réelle de la PWA (pas juste le prompt)
- ✅ Timestamp de chaque installation
- ✅ Compteur total

### Données stockées
```json
{
  "count": 42,
  "last_updated": "2024-01-15 14:30:25"
}
```

## 🎯 Fonctionnalités

### Page de stats (`/stats/`)
- 📊 **Compteur total** de téléchargements
- 📈 **Statistiques** : aujourd'hui, moyenne/jour
- 🔄 **Auto-refresh** toutes les 30 secondes
- 📱 **Design responsive** aux couleurs SIP&GO!

### API (`/stats/count.php`)
- **GET** : Récupère les stats actuelles
- **POST** : Incrémente le compteur (+1)
- **CORS** : Activé pour votre PWA

## 🔧 Customisation

### Changer l'URL des stats
Dans `src/utils/analytics.ts` :
```typescript
const STATS_URL = '/stats/count.php'; // URL relative
// ou
const STATS_URL = 'https://stats.monsite.com/count.php'; // URL absolue
```

### Personnaliser l'affichage
Modifiez `stats/index.html` pour :
- Changer les couleurs
- Ajouter d'autres métriques
- Modifier le design

## 🛡️ Sécurité

### Protection recommandée
Ajoutez dans `.htaccess` du dossier `stats/` :
```apache
# Protéger downloads.json
<Files "downloads.json">
    Order allow,deny
    Deny from all
</Files>

# Limiter l'accès à la page stats (optionnel)
AuthType Basic
AuthName "Zone protégée"
AuthUserFile /path/to/.htpasswd
Require valid-user
```

### Validation côté serveur
Le script PHP inclut déjà :
- Validation des méthodes HTTP
- Headers CORS appropriés
- Gestion d'erreurs

## 📈 Évolutions possibles

### Statistiques avancées
- Tracking par pays/ville
- Dates d'installation détaillées
- Graphiques temporels
- Export des données

### Base de données
Remplacer le JSON par MySQL/SQLite :
```sql
CREATE TABLE pwa_installs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    install_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    user_agent TEXT,
    ip_address VARCHAR(45)
);
```

## 🆘 Dépannage

### Le compteur ne s'incrémente pas
1. Vérifiez les permissions de `downloads.json`
2. Consultez les logs d'erreur du serveur
3. Testez l'API directement : `curl -X POST votre-site.com/stats/count.php`

### Erreur CORS
Vérifiez que les headers CORS sont bien envoyés par `count.php`.

### Page stats ne charge pas
1. Vérifiez que PHP est activé sur votre serveur
2. Testez l'URL de l'API directement dans le navigateur

## 💡 Support

Pour toute question sur ce système de stats, vérifiez :
1. Les logs du serveur web
2. La console du navigateur (F12)
3. Les permissions de fichiers

---

🍻 **SIP&GO!** - Simple, efficace, sans dépendances ! 