# Architecture du Projet - MailDispatcher

## 📁 Structure des dossiers

```
my-new-app/
├── src/
│   ├── main/                  # Processus principal Electron
│   │   ├── index.ts           # Point d'entrée minimal
│   │   ├── ipc/              # Handlers IPC
│   │   │   └── mail.ipc.ts   # Handlers pour mails/tickets
│   │   ├── services/         # Logique métier
│   │   │   ├── Database.ts   # Configuration DB
│   │   │   └── DispatchService.ts  # Services métier
│   │   └── utils/            # Utilitaires
│   │       ├── logger.ts     # Logger simple
│   │       └── errors.ts     # Gestion erreurs
│   ├── preload/              # Scripts preload
│   │   ├── index.ts          # Point d'entrée preload
│   │   └── mailServices.ts   # API exposée au renderer
│   ├── renderer/             # Interface utilisateur Vue 3
│   │   ├── renderer.ts       # Point d'entrée renderer
│   │   ├── App.vue           # Composant principal
│   │   ├── composables/      # Composables Vue
│   │   │   └── useMail.ts    # Logique IPC front
│   │   ├── components/       # Composants Vue (futur)
│   │   ├── pages/            # Pages/vues (futur)
│   │   └── style/            # Styles (futur)
│   └── shared/               # Types partagés
│       └── types/
│           ├── DatabaseModels.ts  # Modèles DB
│           └── global.d.ts        # Déclarations globales
├── index.html               # Template HTML
├── forge.config.ts          # Configuration Electron Forge
├── vite.main.config.ts      # Config Vite pour main
├── vite.preload.config.ts   # Config Vite pour preload
└── vite.renderer.config.mts # Config Vite pour renderer (avec Vue)
```

## 🔄 Flux de communication

### Main → IPC → Renderer

```
┌─────────────────┐
│   Renderer      │
│   (Vue 3)       │
│                 │
│  useMail()      │ ← Composable qui appelle window.api
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│   Preload       │
│                 │
│  mailServices   │ ← Expose l'API via contextBridge
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│   Main/IPC      │
│                 │
│  mail.ipc.ts    │ ← Handlers IPC
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│   Services      │
│                 │
│  DispatchService│ ← Logique métier + DB
└─────────────────┘
```

## 🎯 Principes d'architecture

### 1. Séparation des responsabilités

- **main/index.ts** : Minimal, uniquement création de fenêtre et initialisation
- **main/ipc/** : Tous les handlers IPC isolés
- **main/services/** : Logique métier pure (DB, calculs)
- **main/utils/** : Utilitaires réutilisables (logger, errors)

### 2. Communication sécurisée

- Utilisation de `contextBridge` dans preload
- Pas d'accès direct à Electron depuis le renderer
- Types TypeScript partagés pour la sécurité

### 3. Architecture Vue 3

- **Composables** pour la logique réutilisable (useMail)
- **Composition API** pour une meilleure organisation
- **Gestion d'état local** avec refs

## 🚀 Commandes

```bash
# Développement
npm start

# Build
npm run package

# Lint
npm run lint
```

## 📝 Notes techniques

- **TypeScript** : Tout est typé, aucun `any`
- **Vue 3** : Composition API avec `<script setup>` possible
- **Vite** : Build rapide avec Hot Module Replacement
- **MariaDB** : Pool de connexions pour performances
- **IPC** : Handlers nommés avec préfixe `tickets:`

## 🔧 Ajout de nouvelles fonctionnalités

### Ajouter un nouveau handler IPC

1. Ajouter la fonction dans `main/services/DispatchService.ts`
2. Créer le handler dans `main/ipc/mail.ipc.ts`
3. Ajouter la méthode dans `preload/mailServices.ts`
4. Utiliser dans `renderer/composables/useMail.ts`
5. Mettre à jour les types dans `shared/types/`

### Ajouter une nouvelle page

1. Créer le composant dans `renderer/pages/`
2. Importer dans `App.vue` ou créer un router
3. Utiliser les composables pour la logique

## 🏗️ Inspiré de

Cette architecture suit les bonnes pratiques de **oldzy/todos-app-electron** :
- Main process minimal
- IPC handlers isolés
- Preload sécurisé avec contextBridge
- Renderer propre avec Vue 3
