# Schéma de Base de Données - SnowDispatcher

## Vue d'ensemble

Base de données: `snowdispatcher`  
Engine: MariaDB 10.4.32  
Charset: utf8mb4_general_ci

## Tables

### 1. `departements`
Gestion des départements de l'entreprise.

| Colonne | Type | Contraintes |
|---------|------|-------------|
| id | INT(11) | PRIMARY KEY, AUTO_INCREMENT |
| nom_departement | VARCHAR(255) | NOT NULL, UNIQUE |

### 2. `staff`
Employés de l'entreprise qui envoient les mails.

| Colonne | Type | Contraintes |
|---------|------|-------------|
| id | INT(11) | PRIMARY KEY, AUTO_INCREMENT |
| nom_complet | VARCHAR(255) | NOT NULL |
| adresse_mail | VARCHAR(255) | NOT NULL, UNIQUE |
| statut_hierarchique | ENUM | NOT NULL ('Leader', 'N+1', 'Employé Lambda') |
| departement_id | INT(11) | FK → departements.id |
| est_marie | TINYINT(1) | DEFAULT 0 |
| nombre_enfants | INT(11) | DEFAULT 0 |
| genre | ENUM | NOT NULL ('M', 'F', 'Autre') |

**Relations:**
- FK: `departement_id` → `departements.id` (ON DELETE SET NULL)

### 3. `users`
Équipe IT qui utilise l'application.

| Colonne | Type | Contraintes |
|---------|------|-------------|
| id | INT(11) | PRIMARY KEY, AUTO_INCREMENT |
| username | VARCHAR(100) | NOT NULL, UNIQUE |
| password_hash | VARCHAR(255) | NOT NULL |
| role | ENUM | NOT NULL, DEFAULT 'agent' ('admin', 'agent') |
| staff_id | INT(11) | UNIQUE, FK → staff.id |

**Relations:**
- FK: `staff_id` → `staff.id` (ON DELETE SET NULL, ON UPDATE CASCADE)

### 4. `category`
Catégories de mails.

| Colonne | Type | Contraintes |
|---------|------|-------------|
| id | INT(11) | PRIMARY KEY, AUTO_INCREMENT |
| nom_categorie | VARCHAR(100) | NOT NULL, UNIQUE |

### 5. `privacy`
Niveaux de confidentialité.

| Colonne | Type | Contraintes |
|---------|------|-------------|
| id | INT(11) | PRIMARY KEY, AUTO_INCREMENT |
| niveau_confidentialite | VARCHAR(100) | NOT NULL, UNIQUE |

### 6. `mail`
Messages entrants.

| Colonne | Type | Contraintes |
|---------|------|-------------|
| id | INT(11) | PRIMARY KEY, AUTO_INCREMENT |
| objet | VARCHAR(255) | NOT NULL |
| contenu | TEXT | NULL |
| date_reception | DATETIME | NOT NULL, DEFAULT CURRENT_TIMESTAMP |
| expediteur_staff_id | INT(11) | FK → staff.id |
| categorie_id | INT(11) | FK → category.id |
| privacy_id | INT(11) | FK → privacy.id |
| handler_user_id | INT(10) UNSIGNED | NULL |

**Relations:**
- FK: `expediteur_staff_id` → `staff.id` (ON DELETE SET NULL)
- FK: `categorie_id` → `category.id` (ON DELETE SET NULL)
- FK: `privacy_id` → `privacy.id` (ON DELETE SET NULL)

### 7. `taches`
Tickets de suivi des mails.

| Colonne | Type | Contraintes |
|---------|------|-------------|
| id | INT(11) | PRIMARY KEY, AUTO_INCREMENT |
| mail_id | INT(11) | NOT NULL, FK → mail.id |
| agent_user_id | INT(11) | NOT NULL, FK → users.id |
| statut_tache | ENUM | NOT NULL, DEFAULT 'Nouveau' ('Nouveau', 'Assigné', 'Résolu') |
| priorite_calculee | ENUM | NOT NULL ('Alerte Rouge', 'Urgent', 'Normale') |
| date_attribution | DATETIME | NULL |
| commentaire | TEXT | NULL |

**Relations:**
- FK: `mail_id` → `mail.id` (ON DELETE CASCADE)
- FK: `agent_user_id` → `users.id`

### 8. `stats_gender_mail_count`
Compteur de mails par genre (table de statistiques).

| Colonne | Type | Contraintes |
|---------|------|-------------|
| id | INT(11) | PRIMARY KEY, AUTO_INCREMENT |
| genre | ENUM | NOT NULL, UNIQUE ('M', 'F', 'Autre') |
| mail_count | INT(11) | NOT NULL, DEFAULT 0 |

### 9. `stat_mail_by_gender`
Statistiques des mails par genre et par date.

| Colonne | Type | Contraintes |
|---------|------|-------------|
| stat_date | DATE | NOT NULL, PRIMARY KEY (avec gender) |
| gender | ENUM | NOT NULL, PRIMARY KEY (avec stat_date) ('F', 'M', 'X', 'U') |
| mail_count | INT(10) UNSIGNED | NOT NULL |

**Note:** 'U' = Unknown/Null

**Clé primaire composite:** (stat_date, gender)

### 10. `stat_mail_by_priority`
Statistiques des mails par priorité et par date.

| Colonne | Type | Contraintes |
|---------|------|-------------|
| stat_date | DATE | NOT NULL, PRIMARY KEY (avec priority_id) |
| priority_id | INT(10) UNSIGNED | NOT NULL, PRIMARY KEY (avec stat_date) |
| mail_count | INT(10) UNSIGNED | NOT NULL |

**Clé primaire composite:** (stat_date, priority_id)

## Relations Principales

```
departements
    ↓ (1:N)
staff ←─────────┐
    ↓ (1:N)     │ (1:1)
    ↓           users
    ↓             ↓ (1:N)
mail ─────────→ taches
    ↑
    │
category, privacy
```

## Règles Métier

### Priorité des Tickets
La priorité est calculée en fonction du `statut_hierarchique` de l'expéditeur:
- **Leader** → Alerte Rouge
- **N+1** → Urgent
- **Employé Lambda** → Normale

### Statistiques
Deux types de statistiques sont maintenues:
1. **Par genre** (`stat_mail_by_gender`): Nombre de mails par genre par jour
2. **Par priorité** (`stat_mail_by_priority`): Nombre de mails par priorité par jour

## Types TypeScript

Les interfaces TypeScript correspondantes sont définies dans:  
`src/shared/types/DatabaseModels.ts`

```typescript
export interface Staff { ... }
export interface User { ... }
export interface Mail { ... }
export interface Tache { ... }
export interface Category { ... }
export interface Privacy { ... }
export interface Departement { ... }
export interface StatsGenderMailCount { ... }
export interface StatMailByGender { ... }
export interface StatMailByPriority { ... }
```

## Configuration de Connexion

La connexion à la base de données est configurée dans:  
`src/main/services/Database.ts`

Variables d'environnement utilisées:
- `DB_HOST` (défaut: localhost)
- `DB_USER` (défaut: root)
- `DB_PASSWORD` (défaut: vide)
- `DB_NAME` (défaut: snowdispatcher)
