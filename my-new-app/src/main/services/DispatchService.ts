// src/main/services/DispatchService.ts
import { pool } from "./Database";
import type { Staff, Mail, Tache, MailPriorite, StaffHierarchie } from "../../shared/types/DatabaseModels";

/**
 * Logique métier principale : Appliquer les règles de priorité.
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
 * Retrouve l'expéditeur et détermine la priorité.
 */
async function applyPriorityRules(mail: Mail): Promise<MailPriorite> {
  // 1. Trouver l'expéditeur (staff)
  const [rows] = await pool.query(
    "SELECT statut_hierarchique FROM staff WHERE id = ?",
    [mail.expediteur_staff_id]
  );
  const staffList = rows as Staff[];
  
  if (staffList.length === 0) {
    return 'Normale'; // Expéditeur inconnu
  }
  
  // 2. Appliquer la règle de priorité
  return getPriorityFromStatus(staffList[0].statut_hierarchique);
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
 * Récupère tous les tickets (taches) pour affichage.
 */
export async function getAllTickets(): Promise<Tache[]> {
  const [rows] = await pool.query("SELECT * FROM taches ORDER BY date_attribution DESC");
  return rows as Tache[];
}
