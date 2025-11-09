// src/main/services/DispatchService.ts
import { pool } from "./Database";
import type { Staff, Mail, Tache, MailPriorite, StaffHierarchie, User } from "../../shared/types/DatabaseModels";

/**
 * Logique métier : Traduit le statut hiérarchique en priorité de ticket.
 */
function getPriorityFromStatus(status: StaffHierarchie): MailPriorite {
  switch (status) {
    case 'Leader':
      return 'Alerte Rouge';
    case 'N+1':
      return 'Urgent';
    case 'Employé Lambda':
    default:
      return 'Normale';
  }
}

/**
 * Analyse un mail entrant pour trouver son expéditeur (staff)
 * et déterminer la priorité calculée.
 */
async function applyPriorityRules(mail: Mail): Promise<MailPriorite> {
  try {
    const [rows] = await pool.query(
      "SELECT statut_hierarchique FROM staff WHERE id = ?",
      [mail.expediteur_staff_id]
    );
    const staffList = rows as Pick<Staff, 'statut_hierarchique'>[];
    if (staffList.length === 0) {
      console.warn(`Expéditeur (Staff ID: ${mail.expediteur_staff_id}) non trouvé. Priorité par défaut.`);
      return 'Normale';
    }
    return getPriorityFromStatus(staffList[0].statut_hierarchique);
  } catch (error) {
    console.error("Erreur lors de l'application des règles de priorité:", error);
    return 'Normale';
  }
}

/**
 * Crée le ticket (tache) final après application des règles.
 */
export async function createTicket(mail: Mail, agentUserId: number): Promise<any> {
  const priorite = await applyPriorityRules(mail);
  const [result] = await pool.query(
    `INSERT INTO taches (mail_id, agent_user_id, statut_tache, priorite_calculee, date_attribution) 
     VALUES (?, ?, 'Assigné', ?, NOW())`,
    [mail.id, agentUserId, priorite]
  );
  return result;
}

/**
 * Récupère tous les tickets (taches) pour affichage avec objet du mail.
 */
export async function getAllTickets(): Promise<(Tache & { objet: string })[]> {
  const [rows] = await pool.query(`
    SELECT t.*, m.objet 
    FROM taches t
    JOIN mail m ON t.mail_id = m.id
    ORDER BY t.date_attribution DESC
  `);
  return rows as (Tache & { objet: string })[];
}

/**
 * Récupère tous les agents (users avec role='agent').
 */
export async function getAllAgents(): Promise<User[]> {
  try {
    const [rows] = await pool.query(
      "SELECT id, username, role, staff_id_lien FROM users WHERE role = 'agent'"
    );
    return rows as User[];
  } catch (error) {
    console.error("Erreur lors de la récupération des agents:", error);
    return [];
  }
}

/**
 * Récupère un agent spécifique par son ID.
 */
export async function getAgentById(agentId: number): Promise<User | null> {
  try {
    const [rows] = await pool.query(
      "SELECT id, username, role, staff_id_lien FROM users WHERE id = ? AND role = 'agent'",
      [agentId]
    );
    const agents = rows as User[];
    return agents.length > 0 ? agents[0] : null;
  } catch (error) {
    console.error("Erreur lors de la récupération de l'agent:", error);
    return null;
  }
}
