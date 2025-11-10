# MailDispatcher

Application Electron de gestion d'emails avec Vue 3, TypeScript, Prisma et MariaDB.

## Fonctionnalités

- Interface Vue 3 avec TypeScript
- Backend Electron avec IPC handlers
- Intégration Prisma ORM pour MariaDB
- Build avec Vite et Electron Forge
- Architecture propre suivant les bonnes pratiques oldzy/todos-app-electron

## Installation

```bash
cd my-new-app
npm install
```

## Configuration Base de données

### 1. Créer la base de données

Assurez-vous que MariaDB/MySQL est démarré, puis importez le schéma:

```bash
mysql -u root -p < my-new-app/database/schema.sql
```

### 2. Configuration Prisma

Créez un fichier `.env` dans `my-new-app/` avec votre DATABASE_URL:

```env
DATABASE_URL="mysql://root:votre_mot_de_passe@localhost:3306/snowdispatcher"
```

Exemple sans mot de passe:
```env
DATABASE_URL="mysql://root:@localhost:3306/snowdispatcher"
```

### 3. Générer le client Prisma

Après avoir configuré la DATABASE_URL, générez le client Prisma:

```bash
npm run prisma:generate
```

### 4. Synchroniser le schéma (optionnel)

Si vous préférez utiliser Prisma pour créer/mettre à jour la base de données au lieu du script SQL:

```bash
npm run prisma:push
```

### 5. Documentation du schéma

Pour plus de détails sur la structure de la base de données, consultez:
- `my-new-app/DATABASE_SCHEMA.md` - Documentation complète
- `my-new-app/database/schema.sql` - Script SQL
- `my-new-app/src/main/repositories/prisma/schema.prisma` - Schéma Prisma

## Lancement

### Mode développement
```bash
npm start
```

### Build production
```bash
npm run package
```

### Lint
```bash
npm run lint
```

### Outils Prisma

```bash
# Générer le client Prisma après modification du schéma
npm run prisma:generate

# Synchroniser la DB avec le schéma Prisma
npm run prisma:push

# Ouvrir Prisma Studio (interface graphique pour la DB)
npm run prisma:studio
```

## Architecture

L'application suit une architecture Electron en 3 couches avec Prisma ORM:

```
src/
├── main/               # Processus principal Electron
│   ├── index.ts       # Point d'entrée minimal
│   ├── ipc/           # Handlers IPC isolés
│   ├── services/      # Logique métier + Prisma
│   ├── repositories/  # Prisma ORM
│   │   └── prisma/
│   │       ├── schema.prisma    # Schéma Prisma
│   │       ├── client.ts        # Client Prisma configuré
│   │       └── generated/       # Client généré (git-ignoré)
│   └── utils/         # Logger + gestion erreurs
├── preload/           # Bridge sécurisé
│   ├── index.ts       # Expose API via contextBridge
│   └── mailServices.ts
├── renderer/          # Interface Vue 3
│   ├── App.vue        # Composant principal
│   ├── composables/   # Logique réutilisable
│   ├── components/    # Composants Vue
│   └── pages/         # Pages/vues
└── shared/            # Types TypeScript partagés
    └── types/
```

## Documentation

- `ARCHITECTURE.md` - Architecture détaillée
- `DATABASE_SCHEMA.md` - Schéma de base de données
- `REFACTORING.md` - Détails des changements
- `SUMMARY.md` - Résumé du projet

## Technologies

- **Electron** 38.2.2
- **Vue** 3.5.22
- **TypeScript** 4.5.4
- **Vite** 5.4.20
- **Prisma** 6.19.0
- **MariaDB** via Prisma Client
- **Electron Forge** 7.9.0

## Licence

MIT
