# Intégration Prisma - MailDispatcher

## Vue d'ensemble

L'application utilise **Prisma ORM** pour gérer l'accès à la base de données MariaDB, suivant le modèle de l'application de référence `oldzy/todos-app-electron`.

## Architecture Prisma

```
src/main/repositories/prisma/
├── schema.prisma       # Schéma Prisma (source de vérité)
├── client.ts           # Configuration du client Prisma
└── generated/          # Client Prisma généré (git-ignoré)
    ├── index.d.ts
    ├── index.js
    └── runtime/
```

## Avantages de Prisma

### 1. Type Safety
Prisma génère des types TypeScript automatiquement à partir du schéma:
```typescript
import { prisma } from '../repositories/prisma/client';
import { MailStatut } from '../repositories/prisma/generated/client';

// Types 100% sûrs
const tache = await prisma.taches.create({
  data: {
    statut_tache: MailStatut.Assigne // Auto-complété, type-safe
  }
});
```

### 2. Requêtes Intuitives
```typescript
// Avant (mysql2)
const [rows] = await pool.query(`
  SELECT t.*, m.objet 
  FROM taches t
  JOIN mail m ON t.mail_id = m.id
`);

// Après (Prisma)
const taches = await prisma.taches.findMany({
  include: {
    mail: {
      select: { objet: true }
    }
  }
});
```

### 3. Migrations Automatiques
```bash
# Synchroniser la DB avec le schéma
npm run prisma:push

# Interface graphique pour explorer la DB
npm run prisma:studio
```

### 4. Relations Explicites
Le schéma Prisma documente toutes les relations:
```prisma
model taches {
  mail      mail  @relation(fields: [mail_id], references: [id], onDelete: Cascade)
  agent     users @relation(fields: [agent_user_id], references: [id])
}
```

## Utilisation dans le Code

### Configuration du Client

Le client Prisma est configuré dans `src/main/repositories/prisma/client.ts`:
```typescript
import { PrismaClient } from './generated/client';

export const prisma = new PrismaClient({
  log: [
    { level: 'warn', emit: 'event' },
    { level: 'error', emit: 'event' },
  ],
});
```

### Dans les Services

Exemple d'utilisation dans `DispatchService.ts`:
```typescript
import { prisma } from "../repositories/prisma/client";
import { MailPriorite, MailStatut } from "../repositories/prisma/generated/client";

export async function getAllTickets() {
  const taches = await prisma.taches.findMany({
    include: {
      mail: { select: { objet: true } }
    },
    orderBy: { date_attribution: 'desc' }
  });
  return taches;
}
```

### Gestion des Enums

Les enums Prisma sont mappés aux valeurs SQL:
```prisma
enum MailStatut {
  Nouveau
  Assigne @map("Assigné")    // Mapping pour caractères accentués
  Resolu @map("Résolu")
}
```

Usage:
```typescript
import { MailStatut } from "../repositories/prisma/generated/client";

const statut = MailStatut.Assigne; // Valeur stockée: "Assigné"
```

## Workflow de Développement

### 1. Modifier le Schéma
Éditez `src/main/repositories/prisma/schema.prisma`:
```prisma
model nouveauTable {
  id   Int    @id @default(autoincrement())
  nom  String
}
```

### 2. Générer le Client
```bash
npm run prisma:generate
```

### 3. Synchroniser la DB
```bash
# Option 1: Laisser Prisma mettre à jour la DB
npm run prisma:push

# Option 2: Utiliser un script SQL manuel
mysql -u root -p snowdispatcher < update.sql
```

### 4. Utiliser les Nouveaux Types
```typescript
const nouveau = await prisma.nouveauTable.create({
  data: { nom: "Test" }
});
```

## Commandes Prisma

### Génération du Client
```bash
npm run prisma:generate
```
Génère le client TypeScript dans `src/main/repositories/prisma/generated/`

### Synchronisation DB
```bash
npm run prisma:push
```
Synchronise la base de données avec le schéma Prisma (sans migrations)

### Prisma Studio
```bash
npm run prisma:studio
```
Ouvre une interface web pour explorer et modifier les données

### Format du Schéma
```bash
npx prisma format --schema=./src/main/repositories/prisma/schema.prisma
```

### Validation du Schéma
```bash
npx prisma validate --schema=./src/main/repositories/prisma/schema.prisma
```

## Migration depuis mysql2

### Avant (mysql2)
```typescript
import { pool } from "./Database";

const [rows] = await pool.query(
  "SELECT * FROM taches WHERE id = ?",
  [id]
);
const tache = rows[0];
```

### Après (Prisma)
```typescript
import { prisma } from "../repositories/prisma/client";

const tache = await prisma.taches.findUnique({
  where: { id }
});
```

## Bonnes Pratiques

### 1. Toujours Générer Après Modification
Après chaque modification du `schema.prisma`, exécutez:
```bash
npm run prisma:generate
```

### 2. Utiliser les Includes pour les Relations
```typescript
// ✅ Bon
const taches = await prisma.taches.findMany({
  include: { mail: true }
});

// ❌ Éviter les requêtes séparées
const taches = await prisma.taches.findMany();
for (const tache of taches) {
  const mail = await prisma.mail.findUnique({ where: { id: tache.mail_id } });
}
```

### 3. Gérer la Déconnexion
Le client Prisma est déconnecté automatiquement dans `src/main/index.ts`:
```typescript
import { disconnectPrisma } from './repositories/prisma/client';

app.on('before-quit', async () => {
  await disconnectPrisma();
});
```

### 4. Variables d'Environnement
Toujours utiliser `DATABASE_URL` dans `.env`:
```env
DATABASE_URL="mysql://user:password@localhost:3306/database"
```

## Dépannage

### Erreur: Cannot find module './generated/client'
**Solution**: Exécutez `npm run prisma:generate`

### Erreur: P1001 Can't reach database server
**Solution**: Vérifiez que MariaDB est démarré et que `DATABASE_URL` est correct

### Types non mis à jour
**Solution**: Régénérez le client avec `npm run prisma:generate`

### Problèmes de mapping des enums
**Solution**: Utilisez `@map()` pour mapper les valeurs avec accents:
```prisma
enum MailStatut {
  Assigne @map("Assigné")
}
```

## Ressources

- [Documentation Prisma](https://www.prisma.io/docs)
- [Prisma with Electron](https://github.com/prisma/prisma/discussions/11189)
- [Application de référence: oldzy/todos-app-electron](https://github.com/oldzy/todos-app-electron)

## Différences avec mysql2

| Aspect | mysql2 | Prisma |
|--------|--------|--------|
| Type Safety | ❌ Manuel | ✅ Automatique |
| Requêtes | SQL brut | API TypeScript |
| Relations | Joins manuels | Includes automatiques |
| Migrations | Scripts SQL | Prisma Migrate |
| Erreurs | Peu claires | Messages détaillés |
| Auto-complétion | ❌ Non | ✅ Oui |
| Maintenance | Plus difficile | Plus facile |
