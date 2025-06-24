# 🍻 SIP&GO! - Application de Jeu à Boire

## Aperçu du Projet

SIP&GO! est une application mobile de jeu à boire ultime pour vos soirées. L'application propose:
- 5 packs thématiques avec environ 1500 questions/défis au total
- Mode gratuit (pack Classic) et mode premium (tous les packs)
- Support multilingue (français et anglais)
- Conception offline-first

## Stack Technique

| Domaine        | Technologies                                     |
|----------------|--------------------------------------------------|
| Framework      | React Native + Expo SDK 50                       |
| Langage        | TypeScript (strict)                              |
| UI & Styling   | Tailwind RN, React Native Reanimated             |
| State          | Zustand                                          |
| Navigation     | React Navigation (Native Stack)                  |
| Monétisation   | RevenueCat                                       |
| Analytics      | PostHog                                          |
| Monitoring     | Sentry                                           |
| Tests          | Jest                                             |

## Installation & Configuration

### Prérequis
- Node.js (v16+)
- npm ou yarn
- Expo CLI (`npm install -g expo-cli`)

### Installation

```bash
# Cloner le dépôt
git clone https://github.com/your-username/sip-and-go.git
cd sip-and-go

# Installer les dépendances
npm install

# Configurer les variables d'environnement
cp .env.example .env
# Remplir les clés API dans .env (RevenueCat, PostHog, Sentry)
```

### Démarrage

```bash
# Démarrer en mode développement
npm start

# Lancer sur iOS
npm run ios

# Lancer sur Android
npm run android
```

## Structure du Projet

```
SIP&GO!
│
├── assets/                  # Ressources statiques
│   └── questions/           # Données JSON des questions (par langue)
│
├── src/
│   ├── components/          # Composants UI réutilisables
│   ├── hooks/               # Custom hooks (useQuestions, etc.)
│   ├── navigation/          # Configuration de la navigation
│   ├── screens/             # Écrans principaux de l'application
│   ├── store/               # État global (Zustand)
│   ├── strings/             # Fichiers de traduction (i18n)
│   ├── types/               # Types TypeScript
│   └── utils/               # Utilitaires (analytics, i18n, etc.)
│
├── __tests__/               # Tests unitaires
├── app.config.ts            # Configuration Expo
├── App.tsx                  # Point d'entrée de l'application
└── babel.config.js          # Configuration Babel
```

## Écrans Principaux

1. **AddPlayers**: Écran d'accueil pour ajouter les joueurs
2. **ModeCarousel**: Sélection du pack de jeu via un carousel
3. **Question**: Affichage des questions avec transitions colorées
4. **Paywall**: Écran premium pour débloquer tous les packs
5. **Settings**: Paramètres (langue, abonnement, support)

## Fonctionnalités Principales

### Gestion des Joueurs
- Ajout/suppression de joueurs
- Minimum de 2 joueurs pour démarrer une partie

### Système de Jeu
- Questions avec remplacement dynamique des noms de joueurs
- Sélection aléatoire des questions selon le nombre de joueurs
- Changement de couleur de fond à chaque question

### Monétisation
- Pack Classic gratuit
- Accès premium par abonnement via RevenueCat
- Restauration des achats

### Internationalisation
- Support français/anglais
- Détection automatique de la langue de l'appareil
- Changement de langue dans les paramètres

## Développement

### Commandes Utiles

```bash
# Vérification des types TypeScript
npm run typecheck

# Tests unitaires
npm run test

# Lint
npm run lint

# Build pour production (EAS)
eas build --platform ios
eas build --platform android
```

### Notes de Développement

- **Tailwind RN**: Utiliser les classes Tailwind pour tous les styles
- **RevenueCat**: Les clés API doivent être configurées dans `app.config.ts`
- **Internationalisation**: Toutes les chaînes visibles doivent passer par les fichiers de traduction
- **Tests**: Les utilitaires doivent avoir au moins un test unitaire

## Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.
