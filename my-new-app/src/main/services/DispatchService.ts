// src/main/services/DispatchService.ts
import { pool } from "./Database";
import type { Staff, Mail, Tache, MailPriorite, StaffHierarchie } from "../../shared/types/DatabaseModels";
import { DatabaseError } from "../utils/errors";
import { logger } from "../utils/logger";

interface CreateTicketResult {
  insertId: number;
  affectedRows: number;
}

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
      logger.warn(`Expéditeur (Staff ID: ${mail.expediteur_staff_id}) non trouvé. Priorité par défaut.`);
      return 'Normale';
    }
    return getPriorityFromStatus(staffList[0].statut_hierarchique);
  } catch (error) {
    logger.error("Erreur lors de l'application des règles de priorité:", error);
    return 'Normale';
  }
}

/**
 * Crée le ticket (tache) final après application des règles.
 */
export async function createTicket(mail: Mail, agentUserId: number): Promise<CreateTicketResult> {
  try {
    const priorite = await applyPriorityRules(mail);
    const [result] = await pool.query(
      `INSERT INTO taches (mail_id, agent_user_id, statut_tache, priorite_calculee, date_attribution) 
       VALUES (?, ?, 'Assigné', ?, NOW())`,
      [mail.id, agentUserId, priorite]
    );
    const insertResult = result as CreateTicketResult;
    logger.info(`Ticket créé avec succès: ID ${insertResult.insertId}`);
    return insertResult;
  } catch (error) {
    logger.error("Erreur lors de la création du ticket:", error);
    throw new DatabaseError("Impossible de créer le ticket", error);
  }
}

/**
 * Récupère tous les tickets (taches) pour affichage avec objet du mail.
 */
export async function getAllTickets(): Promise<(Tache & { objet: string })[]> {
  try {
    const [rows] = await pool.query(`
      SELECT t.*, m.objet 
      FROM taches t
      JOIN mail m ON t.mail_id = m.id
      ORDER BY t.date_attribution DESC
    `);
    return rows as (Tache & { objet: string })[];
  } catch (error) {
    logger.error("Erreur lors de la récupération des tickets:", error);
    throw new DatabaseError("Impossible de récupérer les tickets", error);
  }
}
