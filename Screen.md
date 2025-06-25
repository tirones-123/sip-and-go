#	Nom d’écran	Quand / comment on y arrive	Structure visuelle (implémentation actuelle)	Interactions clés

1	Paywall / Abonnement
• Affiché :  
  – au premier lancement de l’app  
  – quand l’utilisateur tente d’ouvrir un pack verrouillé	- Fond sombre `#0B0E1A`  
- Icône 🍻 dans un carré rose (`roseCTA`) 96 × 96 centré  
- Titre H1 “C’est parti !” / “Let’s Go!”  
- Liste bullet-emoji :
🔒 5500+ questions
  🔥 Débloque tous les modes  
  🎮 Nouveaux packs chaque mois  
- Bouton CTA rose pleine largeur « Commencer » / « Get Started » (pas d’animation)  
- Texte info « Gratuit 3 jours, puis 4,99 €/semaine »  
- Lien « Restaurer l’achat » et liens légaux (CGU, Confidentialité) en bas  
- Croix ✕ 32 px en haut-gauche	• Appuyer CTA ➜ `purchasePackage`  
• « Restaurer » ➜ `restorePurchases`  
• Croix ✕ ➜ `navigation.goBack()` ou retour écran précédent


2	Accueil / Ajout des joueurs
RootStack après fermeture du Paywall	- Fond sombre `#0B0E1A`  
- Header : titre « Ajouter des joueurs » blanc + sous-titre gris (#ffffff70)  
- Champ input bg `white/10`, placeholder gris, bouton « + » couleur `#F3C53F` (classic) accolé  
- Liste joueurs : carte bg `white/10`, nom blanc, bouton × bg `white/20`  
- Bouton START rose pleine largeur (`roseCTA`) en bas, désactivé si < 2 joueurs  
- Icône ⚙️ dans un cercle `white/10` en haut-droite	• « + » ➜ `addPlayer()`  
• « × » ➜ `removePlayer()`  
• START (≥ 2 joueurs) ➜ `navigation.navigate('ModeCarousel')`  
• ⚙️ ➜ ouvre `Settings`

3	Choix du mode (ModeCarousel)
Après START ou retour depuis Question	- Fond `#FDE0A4` (`carouselBg`)  
- Header : logo-texte centré, flèche ‹ custom blanche à gauche  
- Carousel horizontal (Reanimated FlatList) :  
  • Carte 320 × ~480, radius 24  
  • Pill titre foncé (shade −50 %)  
  • Illustration Hero  
  • Description (2 lignes) sur fond clair (shade +15 %)  
  • Bouton PLAY pleine largeur couleur pill  
  • Pack verrouillé : overlay noir 60 % + icône 🔒 en haut-droit  
- Footer : « Players: X » gris foncé centré en bas	• Swipe ➜ snapping & léger scale/opacity  
• PLAY d’un pack LOCKED sans premium ➜ `Paywall` (returnTo = ModeCarousel)  
• PLAY d’un pack FREE ou si premium ➜ `startPack()` puis `Question`

4	Question
Immédiatement après sélection d’un pack	- Fond = couleur primaire du pack avec variation aléatoire via `randomColorVariation()`  
- Question H1 blanc, centré, max-width 90 %  
- Barre top absolue :  
  • Bouton 👤 à gauche (cercle `white/20`)  
  • Bouton ✕ à droite (quitter)  
- Modal joueurs : panel `darkBg` 80 % largeur, liste + input + shake si < 2 joueurs  
- Overlay « Game Over » noir / 90 % en fin de questions	• Tap n’importe où ➜ `nextQuestion()` + nouvelle couleur  
• 👤 ➜ ouvre modal gestion joueurs (`addPlayer`, `removePlayer`)  
• ✕ ➜ modal de confirmation puis `resetGame()` + retour ModeCarousel

5	Réglages
Tap ⚙️ depuis Accueil	Sections cartes `darkBg` :  
1. Go Premium (ouvre Paywall)  
2. Gérer mon abonnement (deep-link OS)  
3. Nous soutenir : Évaluer, Partager, Nous contacter
4. Langue : English / Français (pas encore persisté)  
- Header centré « Paramètres » + flèche ‹	• Go Premium ➜ Paywall  
• Gérer abonnement ➜ Linking vers store  
• Évaluer ➜ `Linking.openURL()`  
• Partager ➜ `Share.share()`  
• Contact ➜ mailto:  
• Sélection langue ➜ `setLanguage()` (in-memory)