// src/main/services/DispatchService.ts
import { prisma } from "../repositories/prisma/client";
import { MailPriorite, MailStatut, StaffHierarchie } from "../repositories/prisma/generated/client";
import { DatabaseError } from "../utils/errors";
import { logger } from "../utils/logger";

interface CreateTicketResult {
  id: number;
}

/**
 * Logique métier : Traduit le statut hiérarchique en priorité de ticket.
 */
function getPriorityFromStatus(status: StaffHierarchie): MailPriorite {
  switch (status) {
    case StaffHierarchie.Leader:
      return MailPriorite.Alerte_Rouge;
    case StaffHierarchie.N:
      return MailPriorite.Urgent;
    case StaffHierarchie.Employe_Lambda:
    default:
      return MailPriorite.Normale;
  }
}

/**
 * Analyse un mail entrant pour trouver son expéditeur (staff)
 * et déterminer la priorité calculée.
 */
async function applyPriorityRules(mailId: number): Promise<MailPriorite> {
  try {
    const mail = await prisma.mail.findUnique({
      where: { id: mailId },
      include: {
        expediteur: {
          select: {
            statut_hierarchique: true
          }
        }
      }
    });

    if (!mail || !mail.expediteur) {
      logger.warn(`Expéditeur non trouvé pour le mail ID: ${mailId}. Priorité par défaut.`);
      return MailPriorite.Normale;
    }

    return getPriorityFromStatus(mail.expediteur.statut_hierarchique);
  } catch (error) {
    logger.error("Erreur lors de l'application des règles de priorité:", error);
    return MailPriorite.Normale;
  }
}

/**
 * Crée le ticket (tache) final après application des règles.
 */
export async function createTicket(mailId: number, agentUserId: number): Promise<CreateTicketResult> {
  try {
    const priorite = await applyPriorityRules(mailId);
    
    const tache = await prisma.taches.create({
      data: {
        mail_id: mailId,
        agent_user_id: agentUserId,
        statut_tache: MailStatut.Assigne,
        priorite_calculee: priorite,
        date_attribution: new Date()
      }
    });

    logger.info(`Ticket créé avec succès: ID ${tache.id}`);
    return { id: tache.id };
  } catch (error) {
    logger.error("Erreur lors de la création du ticket:", error);
    throw new DatabaseError("Impossible de créer le ticket", error);
  }
}

/**
 * Récupère tous les tickets (taches) pour affichage avec objet du mail.
 */
export async function getAllTickets() {
  try {
    const taches = await prisma.taches.findMany({
      include: {
        mail: {
          select: {
            objet: true
          }
        }
      },
      orderBy: {
        date_attribution: 'desc'
      }
    });

    return taches.map(tache => ({
      id: tache.id,
      mail_id: tache.mail_id,
      agent_user_id: tache.agent_user_id,
      statut_tache: tache.statut_tache,
      priorite_calculee: tache.priorite_calculee,
      date_attribution: tache.date_attribution?.toISOString() || null,
      commentaire: tache.commentaire,
      objet: tache.mail.objet
    }));
  } catch (error) {
    logger.error("Erreur lors de la récupération des tickets:", error);
    throw new DatabaseError("Impossible de récupérer les tickets", error);
  }
}
