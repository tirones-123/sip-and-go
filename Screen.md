#	Nom d’écran	Quand / comment on y arrive	Structure visuelle (d’après les maquettes)	Interactions clés

1	Paywall / Abonnement
• A chaque fois que l'utilistaeur ouvre l'app
• Quand l’utilisateur clique sur un mode verrouillé	- Fond sombre #0B0E1A
- Icône verre logo de l'app centré ↑ (96 × 96)
- Titre XXL “C’est parti !”
- Liste bullet-emoji :
🔒 5500+ questions
🔥 Débloque tous les modes…
- CTA bouton rose 300 × 56 px ➜ “Commencer” qui est annimé grossis et rapetissit tout le temps
- Petit texte “Gratuit 3 jours, puis 4,99€ hebdomadaire” juste au-dessus
- Liens légaux en bas (politique, CGU, restaurer achat) + restaurer les achats
- Croix close 32 px en haut-gauche	
• Appuyer CTA ➜ déclenche RevenueCat purchasePackage
• Croix ➜ dismiss (retour écran précédent)

2	Accueil / Ajout des joueurs
 Root stack après paywall fermé	- Palette orange brûlé + jaune
- Titre H1 “Ajouter des joueurs” + sous-titre
- Champ input plein largeur (coins 12 px) + bouton “+” intégrée
- Liste players (cards arrondies 8 px) + “×” delete à droite
- Bouton START très large en bas (même couleur que input bord)
- Icône ⚙️ settings en haut-droite	• “+” ➜ push dans array players
• “×” ➜ splice
• START (si ≥ 2 joueurs) ➜ pousse Sélection des modes

3	Choix du mode (carousel)
Après START ou via Back depuis Partie	
- Header : logo-texte app à centré, bouton retour (‹) à gauche
- Carousel horizontal (react-native-reanimated-carousel) :
• Card 320 × ~480, radius 24 px
• Chip titre (petit pill arrondi) collé en haut
• Visual (photo ou illustration)
• Bloc description 2 lignes
• Bouton PLAY pleine largeur, même couleur que chip
• Si verrouillé : overlay gris 80 % + icône cadenas 24 px coin sup-droit
- On aperçoit 10-15 % des cartes suivantes → incite au swipe
- Footer : “Players: 4” centré, petite typographie gris-foncé	• Swipe ➜ animate scale/opacity d’entrée
• Play d’un pack verrouillé ➜ ouvre Paywall
• Play d’un pack libre ➜ Écran question

4	Question
Dès qu’on lance une partie	
- Fond plein couleur primaire du mode, variante aléatoire sur chaque question (génère via hsl rotate)
- Question en H1 / multiline, centré verticalement + max-width 90 %
- Croix en haut-droite (quitter partie → retour accueil)
- Icône 👤 (ou 👥) en haut-gauche : modal liste des joueurs avec + / – pour ajouter-retirer	• Tap n’importe où (ou bouton “Next” invisible) ➜ transition (FadeOutUp) vers question suivante
• Couleur de fond se régénère au même moment

5	Réglages
Tap ⚙️ depuis écran joueurs	Sections en cartes foncées (#0B0E1A) :
1. Passer Premium (mini-paywall + CTA rose)
2. Abonnement : « Gérer mon abonnement » (deep-link OS)
3. Nous soutenir : Évaluer, Partager, Nous contacter
- Chevron › à droite de chaque ligne
- Header centered “Paramètres” + ‹ back	• Tap Premium ➜ Paywall (même écran 1)
• Langue ➜ change i18n.locale + AsyncStorage ; reload UI
• Évaluer ➜ Linking.openURL(storeReviewLink)