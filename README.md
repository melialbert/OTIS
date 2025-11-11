# 🎓 OTIS - Application d'Apprentissage Créatif

Application mobile de formation en photographie, vidéographie et montage vidéo.

## 📋 Prérequis

- Node.js 18+ installé
- Un smartphone ou émulateur Android/iOS
- Expo Go installé sur votre smartphone (optionnel)

## 🚀 Installation

1. **Installer les dépendances**

```bash
npm install
```

2. **Lancer l'application**

```bash
npm start
```

Cela ouvrira Expo Dev Tools dans votre navigateur.

## 📱 Tester l'application

### Option 1 : Sur votre smartphone (recommandé)

1. Installez l'app **Expo Go** depuis le Play Store (Android) ou App Store (iOS)
2. Scannez le QR code affiché dans le terminal ou le navigateur
3. L'app se chargera automatiquement sur votre téléphone

### Option 2 : Sur émulateur Android

```bash
npm run android
```

(Nécessite Android Studio et un émulateur configuré)

### Option 3 : Sur simulateur iOS (Mac uniquement)

```bash
npm run ios
```

(Nécessite Xcode)

### Option 4 : Dans le navigateur

```bash
npm run web
```

## 🎯 Fonctionnalités

- ✅ Dashboard avec progression et statistiques
- ✅ 3 modules complets (Photographie, Vidéographie, Montage)
- ✅ Système de gamification (XP, niveaux, badges)
- ✅ Planning d'apprentissage sur 4 semaines par module
- ✅ Suivi de progression détaillé
- ✅ Graphiques de compétences (Radar Chart)
- ✅ Profil utilisateur personnalisé

## 📁 Structure du projet

```
otis-app/
├── app/                  # Écrans et navigation
├── components/           # Composants réutilisables
├── constants/            # Données et configuration
├── contexts/             # State management
├── types/                # Types TypeScript
└── assets/               # Images et ressources
```

## 🛠️ Technologies utilisées

- React Native
- Expo
- TypeScript
- Expo Router (navigation)
- React Native SVG (graphiques)
- AsyncStorage (sauvegarde locale)

## 📝 Scripts disponibles

- `npm start` - Démarre le serveur de développement
- `npm run android` - Lance sur émulateur Android
- `npm run ios` - Lance sur simulateur iOS
- `npm run web` - Lance dans le navigateur

## 🐛 Dépannage

### Erreur lors du lancement

```bash
# Nettoyer le cache et réinstaller
rm -rf node_modules
npm install
npx expo start -c
```

### Problème de dépendances

```bash
npx expo install --fix
```

## 📧 Support

Pour toute question, contactez l'équipe OTIS.

---

Fait avec ❤️ par l'équipe OTIS
