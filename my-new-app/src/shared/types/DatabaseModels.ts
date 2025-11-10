// src/shared/types/DatabaseModels.ts

// --- Types de base ---

export type StaffHierarchie = 'Leader' | 'N+1' | 'Employé Lambda';
export type MailPriorite = 'Alerte Rouge' | 'Urgent' | 'Normale';
export type MailStatut = 'Nouveau' | 'Assigné' | 'Résolu';
export type UserRole = 'admin' | 'agent';
export type Genre = 'M' | 'F' | 'Autre';
export type GenderStat = 'F' | 'M' | 'X' | 'U'; // U=Unknown/Null

/**
 * Table `departements`
 */
export interface Departement {
  id: number;
  nom_departement: string;
}

/**
 * Table `staff` (Employés de l'entreprise QUI ENVOIENT les mails)
 * Rôle: Définit la priorité des mails entrants et les stats.
 */
export interface Staff {
  id: number;
  nom_complet: string;
  adresse_mail: string;
  statut_hierarchique: StaffHierarchie;
  departement_id: number | null;
  est_marie: boolean;
  nombre_enfants: number;
  genre: Genre;
}

/**
 * Table `users` (Équipe IT QUI UTILISE l'application)
 * Rôle: Gère l'authentification et les permissions.
 */
export interface User {
  id: number;
  username: string;
  password_hash: string;
  role: UserRole;
  staff_id: number | null;
}

/**
 * Table `category`
 */
export interface Category {
  id: number;
  nom_categorie: string;
}

/**
 * Table `privacy`
 */
export interface Privacy {
  id: number;
  niveau_confidentialite: string;
}

/**
 * Table `mail` (Le message entrant)
 */
export interface Mail {
  id: number;
  objet: string;
  contenu: string | null;
  date_reception: string;
  expediteur_staff_id: number | null;
  categorie_id: number | null;
  privacy_id: number | null;
  handler_user_id: number | null;
}

/**
 * Table `taches` (Le ticket de suivi)
 * Lie un Mail (mail.id) à un Agent IT (users.id)
 */
export interface Tache {
  id: number;
  mail_id: number;
  agent_user_id: number;
  statut_tache: MailStatut;
  priorite_calculee: MailPriorite;
  date_attribution: string | null;
  commentaire: string | null;
}

/**
 * Table `stats_gender_mail_count`
 */
export interface StatsGenderMailCount {
  id: number;
  genre: Genre;
  mail_count: number;
}

/**
 * Table `stat_mail_by_gender`
 */
export interface StatMailByGender {
  stat_date: string; // DATE
  gender: GenderStat;
  mail_count: number;
}

/**
 * Table `stat_mail_by_priority`
 */
export interface StatMailByPriority {
  stat_date: string; // DATE
  priority_id: number;
  mail_count: number;
}
