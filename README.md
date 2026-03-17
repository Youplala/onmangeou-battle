# On Mange Où?! - Battle Edition 🍕⚔️🍔

Le jeu de mini-games pour décider où manger entre amis!

## 🎮 Comment ça marche?

1. **Créer un salon** - L'host crée une room et partage le code
2. **Rejoindre** - Les amis rejoignent avec le code
3. **Proposer** - Chaque joueur propose un restaurant
4. **S'affronter** - Mini-jeux délirants en temps limité
5. **Tournoi** - Les restaurants s'affrontent
6. **Victoire** - Le resto gagnant = votre destination lunch! 🏆

## 🕹️ Mini-Jeux

- **⚡ Réflexes** - L'écran change de couleur, tape le plus vite possible!
- **🍕 Memory Food** - Trouve les paires d'emojis food
- **📝 Speed Food** - Tape la phrase culinaire le plus vite possible

## 🚀 Tech Stack

- **Frontend:** Next.js 14+ (App Router), TypeScript, Tailwind CSS
- **Animations:** Framer Motion
- **Real-time:** Socket.IO (pour le multijoueur réel)
- **Deployment:** GitHub Pages (static export)

## 🎨 Design Principles

- **Fun, playful, game-like** - Think Kahoot meets Jackbox
- **NO generic AI slop** - Bold colors, rich animations
- **Mobile-first** - Perfect sur téléphone
- **Emoji-heavy UI** - Visual et amusant

## 🏗️ Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Export static files for GitHub Pages
npm run export
```

## 🌟 Features

- ✨ **Real-time multiplayer** (avec Socket.IO)
- 🎮 **3 mini-jeux uniques** avec animations
- 🏆 **Système de tournoi** avec bracket
- 💬 **Chat en temps réel** avec quick reactions
- 📱 **Mobile responsive** pour jouer sur téléphone
- 🎨 **Animations fluides** avec Framer Motion
- 🎯 **Scoring system** basé sur vitesse et précision

## 🎪 Game Flow

1. **Landing Page** - Création/join de salon
2. **Lobby** - Soumission des restaurants, chat
3. **Mini-Games** - Affrontements rapides (30s)
4. **Tournament** - Bracket éliminatoire
5. **Winner** - Annonce du restaurant gagnant

## 🎭 Mock Mode

En attendant le serveur Socket.IO, le jeu fonctionne en mode mock avec:
- Simulation d'autres joueurs
- Résultats générés automatiquement
- Interface complète testable

---

Made with 🔥 and lots of ☕ for deciding where to eat with friends!