// my-new-app/src/main/services/DispatchService.ts
import { prisma } from "./Database"; // <--- Importer 'prisma' au lieu de 'pool'
import type { Staff, Mail, Tache, MailPriorite, StaffHierarchie } from "../../shared/types/DatabaseModels";

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
    // Requête avec Prisma (en supposant que le modèle s'appelle 'staff')
    const staffMember = await prisma.staff.findUnique({
      where: { id: mail.expediteur_staff_id },
      select: { statut_hierarchique: true }
    });

    if (!staffMember) {
      console.warn(`Expéditeur (Staff ID: ${mail.expediteur_staff_id}) non trouvé. Priorité par défaut.`);
      return 'Normale';
    }
    // @ts-ignore
    return getPriorityFromStatus(staffMember.statut_hierarchique);

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

  // Création avec Prisma (en supposant que le modèle s'appelle 'taches')
  const result = await prisma.taches.create({
    data: {
      mail_id: mail.id,
      agent_user_id: agentUserId,
      statut_tache: 'Assigné',
      priorite_calculee: priorite,
      date_attribution: new Date() // Prisma gère la conversion
    }
  });
  return result;
}

/**
 * Récupère tous les tickets (taches) pour affichage avec objet du mail.
 */
export async function getAllTickets(): Promise<(Tache & { objet: string })[]> {

  // Requête "join" avec Prisma
  const tachesWithMail = await prisma.taches.findMany({
    include: {
      mail: { // 'mail' doit correspondre au nom de la relation dans schema.prisma
        select: {
          objet: true
        }
      }
    },
    orderBy: {
      date_attribution: 'desc'
    }
  });

  // Mapper le résultat pour correspondre à ton ancien type de retour
  return tachesWithMail.map(t => ({
    ...t,
    // @ts-ignore - 'mail' est inclus par la requête
    objet: t.mail ? t.mail.objet : 'Objet non trouvé',
  }));
}
