// src/shared/types/DatabaseModels.ts

// --- Types de base ---

export type StaffHierarchie = 'Leader' | 'N+1' | 'Employé Lambda';
export type MailPriorite = 'Alerte Rouge' | 'Urgent' | 'Normale';
export type MailStatut = 'Nouveau' | 'Assigné' | 'Résolu';
export type UserRole = 'admin' | 'agent';

/**
 * Table `staff` (Employés de l'entreprise QUI ENVOIENT les mails)
 * Rôle: Définit la priorité des mails entrants et les stats.
 */
export interface Staff {
  id: number;
  nom_complet: string;
  adresse_mail: string;
  statut_hierarchique: StaffHierarchie; // 'Leader', 'N+1', etc.
  departement_id: number;
  // Champs pour statistiques
  est_marie: boolean;
  nombre_enfants: number;
  genre: 'M' | 'F' | 'Autre';
}

/**
 * Table `users` (Équipe IT QUI UTILISE l'application)
 * Rôle: Gère l'authentification et les permissions.
 */
export interface User {
  id: number;
  username: string;
  role: UserRole;
  staff_id_lien?: number; // Lien optionnel si l'agent IT est aussi un employé de la table staff
}

/**
 * Table `mail` (Le message entrant)
 */
export interface Mail {
  id: number;
  objet: string;
  contenu: string;
  date_reception: string;
  expediteur_staff_id: number; // Lié à staff.id
  categorie_id: number;
  privacy_id: number;
}

/**
 * Table `taches` (Le ticket de suivi)
 * Lie un Mail (mail.id) à un Agent IT (users.id)
 */
export interface Tache {
  id: number;
  mail_id: number;
  agent_user_id: number; // L'agent IT assigné
  statut_tache: MailStatut;
  priorite_calculee: MailPriorite; // 'Alerte Rouge', 'Urgent'...
  date_attribution: string;
  commentaire?: string;
}

/*
  Anciennes interfaces/fonctions liées à Task (Task, TaskState, createTaskObject, formatTask)
  ont été supprimées dans cette nouvelle architecture.
*/
