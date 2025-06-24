# SIP&GO! App - Traductions Multi-langues

Cette application SIP&GO! a été traduite en **20 langues** basées sur le fichier français original (`fr.ts`).

## Langues Supportées

### 🇪🇺 Langues Européennes
1. **Espagnol** (`es.ts`) - 🇪🇸
2. **Allemand** (`de.ts`) - 🇩🇪
3. **Italien** (`it.ts`) - 🇮🇹
4. **Portugais** (`pt.ts`) - 🇵🇹
5. **Polonais** (`pl.ts`) - 🇵🇱
6. **Néerlandais** (`nl.ts`) - 🇳🇱
7. **Suédois** (`sv.ts`) - 🇸🇪
8. **Danois** (`da.ts`) - 🇩🇰
9. **Norvégien** (`no.ts`) - 🇳🇴
10. **Finnois** (`fi.ts`) - 🇫🇮

### 🌏 Langues Asiatiques
11. **Chinois Simplifié** (`zh.ts`) - 🇨🇳
12. **Japonais** (`ja.ts`) - 🇯🇵
13. **Coréen** (`ko.ts`) - 🇰🇷
14. **Hindi** (`hi.ts`) - 🇮🇳
15. **Thaï** (`th.ts`) - 🇹🇭
16. **Vietnamien** (`vi.ts`) - 🇻🇳

### 🌍 Autres Régions
17. **Arabe** (`ar.ts`) - 🇸🇦
18. **Hébreu** (`he.ts`) - 🇮🇱
19. **Turc** (`tr.ts`) - 🇹🇷
20. **Russe** (`ru.ts`) - 🇷🇺

## Structure des Traductions

Chaque fichier de traduction contient les sections suivantes :

### Sections Communes
- `appName` - Nom de l'application
- `next`, `back`, `close` - Navigation de base

### Écran Paywall
- `title` - Titre d'accroche
- `features` - Liste des fonctionnalités (3 éléments avec emojis)
- `callToAction` - Bouton principal
- `trialInfo` - Information sur l'essai gratuit
- `restorePurchase`, `terms`, `privacy` - Liens légaux

### Ajout de Joueurs
- `title` - Titre de l'écran
- `inputPlaceholder` - Placeholder du champ de saisie
- `addButton`, `startButton` - Boutons d'action
- `playerCountError` - Message d'erreur
- `deleteButton` - Bouton de suppression

### Carrousel des Modes
- `title` - Titre de l'écran
- `playButton` - Bouton de jeu
- `lockedMode` - Indicateur de mode verrouillé
- `playerCount` - Compteur de joueurs (avec interpolation `{{count}}`)
- `packs` - Descriptions des 5 modes de jeu :
  - **Classic** - Le mode original
  - **Girls** - Entre filles
  - **Guys** - Entre garçons  
  - **Spicy** - Mode épicé
  - **Couples** - Pour les couples

### Écran de Question
- `managePlayers` - Gestion des joueurs
- `finishedTitle/Subtitle` - Fin de partie
- `quitConfirm/No/Yes` - Confirmation de sortie
- `replayButton`, `quitButton` - Actions de fin

### Paramètres
- Section **Premium** - Upgrade vers la version payante
- Section **Subscription** - Gestion d'abonnement
- Section **Support** - Évaluation et partage
- Section **Language** - Sélection de langue

## Utilisation

Les fichiers sont situés dans `src/strings/` et suivent la convention de nommage ISO 639-1 (codes de langue à 2 lettres).

Chaque fichier exporte un objet par défaut avec la structure complète des chaînes traduites, maintenant la hiérarchie et les clés du fichier français original.

## Cohérence

Toutes les traductions maintiennent :
- ✅ La même structure d'objet
- ✅ Les mêmes clés de propriétés
- ✅ Les emojis dans les listes de fonctionnalités
- ✅ L'interpolation `{{count}}` pour le nombre de joueurs
- ✅ Le ton et l'esprit décontracté de l'application
- ✅ Les références culturelles adaptées à chaque langue

Les traductions sont prêtes à être intégrées dans le système i18n de l'application React Native.