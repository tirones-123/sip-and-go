# 🔧 Guide Debug PWA - SIP&GO!

## Problèmes courants et solutions

### 1. Le badge "App installée" reste affiché même après désinstallation

**Solution :**
1. Ouvrez la console du navigateur (F12)
2. Tapez : `resetPWAStatus()`
3. Appuyez sur Entrée
4. La page se rafraîchit automatiquement

### 2. Le bouton d'installation n'apparaît pas

**Diagnostic :**
1. Ouvrez la console du navigateur (F12)
2. Tapez : `checkPWAStatus()`
3. Vérifiez les informations affichées

**Solutions possibles :**
- Assurez-vous d'être en mode non-standalone (navigateur normal)
- Effacez le cache du navigateur
- Utilisez `resetPWAStatus()` pour nettoyer l'état

### 3. Vérification du statut PWA

**Commandes disponibles dans la console :**

```javascript
// Vérifier le statut actuel
checkPWAStatus()

// Nettoyer l'état PWA
resetPWAStatus()
```

### 4. États PWA possibles

| État | Description |
|------|-------------|
| `isRunningStandalone: true` | L'app est lancée comme PWA |
| `isPWAInstalled: true` | L'app est détectée comme installée |
| `canInstallPWA: true` | L'installation est possible |
| `displayMode: 'standalone'` | Mode PWA actif |
| `displayMode: 'browser'` | Mode navigateur normal |

### 5. Test complet d'installation

**Étapes :**
1. Ouvrez https://sip-and-go.com dans un navigateur
2. Vérifiez que le bouton "Installer l'app" est visible
3. Cliquez sur "Installer l'app"
4. Suivez les instructions selon votre navigateur
5. Lancez l'app depuis l'écran d'accueil
6. Vérifiez que le badge "App installée" s'affiche

**En cas de problème :**
1. Utilisez `resetPWAStatus()` dans la console
2. Rechargez la page
3. Recommencez le processus

## Notes techniques

- Les fonctions de debug sont automatiquement disponibles sur la version web
- Les logs de debug apparaissent dans la console pour diagnostiquer les problèmes
- La détection PWA est maintenant plus stricte et se base sur le mode standalone réel
- Les composants se mettent à jour automatiquement lors des changements d'état

## Support

Si les problèmes persistent, utilisez les fonctions de debug pour capturer les informations système et contactez le support. 