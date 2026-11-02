# StockManager Mobile

Application mobile de gestion d'inventaire développée avec React Native et Expo. Elle permet de consulter, ajouter, modifier et supprimer des produits, d'ajuster le stock en un geste, de scanner un code-barres et de suivre l'état de l'inventaire grâce à un tableau de bord.

## Fonctionnalités

- Tableau de bord : valeur totale du stock, nombre de produits, stock bas, ruptures, valeur par catégorie
- Liste des produits avec recherche en temps réel, filtres (catégorie, statut, prix min/max) et tri
- Ajout, modification et suppression de produits avec validation (référence unique, quantité positive, prix non nul)
- Mise à jour rapide du stock (+ / −)
- Indicateur coloré du statut du stock (vert / orange / rouge)
- Scan de code-barres avec gestion de la permission caméra
- Historique des mouvements de stock

## Technologies

React Native, Expo, React Navigation (Tabs + Stack), Context API, expo-camera.

L'API REST (Node.js, Express, MongoDB) se trouve dans le dépôt `stockmanager-backend`.

## Prérequis

- Node.js 18 ou plus
- L'application Expo Go sur un téléphone, ou un émulateur Android
- L'API StockManager lancée sur le PC

## Installation

```bash
git clone <url-du-depot>
cd stockmanager-mobile
npm install
```

## Variables d'environnement

Copier `.env.example` en `.env`, puis renseigner l'adresse IP du PC qui fait tourner l'API :

```
EXPO_PUBLIC_API_URL=http://192.168.1.23:5000/api
```

L'adresse IP s'obtient avec `ipconfig` (Windows) ou `ifconfig` (macOS / Linux). Le téléphone et le PC doivent être sur le même réseau Wi-Fi.

## Lancement

```bash
npx expo start
```

- Sur téléphone : scanner le QR code avec Expo Go (Android) ou l'appareil photo (iOS)
- Sur émulateur Android : appuyer sur `a` dans le terminal

Après une modification du fichier `.env`, relancer avec `npx expo start -c`.

## Structure du projet

```
src/
├── components/   Composants réutilisables (ProductCard, FilterBar, StatsWidget, StockBadge…)
├── context/      État global des produits (ProductsContext)
├── data/         Catégories et icônes
├── navigation/   Navigation par onglets et par pile
├── screens/      Écrans de l'application
├── services/     Appels à l'API
├── theme/        Couleurs, espacements, typographie
├── utils/        Validation, formatage, statut du stock
└── config.js     URL de l'API (lue depuis .env)
```

## Auteur

Sameh Riahi
Génie Logiciel et Systèmes d'Information (3GLSI) – Institut Supérieur d'Informatique de Mahdia
Encadré par M. Ahmed Charfeddine