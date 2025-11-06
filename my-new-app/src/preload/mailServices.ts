// src/preload/mailServices.ts

import { ipcRenderer } from 'electron';
// Importer les types depuis le nouveau fichier de modèles
import type { Tache, Mail } from '../shared/types/DatabaseModels';

// Définir le pont de l'API
export const mailServices = {
  getAllTickets: (): Promise<Tache[]> => {
    return ipcRenderer.invoke('tickets:getAll');
  },

  createTicket: (mail: Mail, agentUserId: number): Promise<any> => {
    return ipcRenderer.invoke('tickets:create', mail, agentUserId);
  }
  
  // (Ajoutez ici les futures fonctions : resolveTask, updateTicketStatus, etc.)
};

// Définir le type pour le service
export type MailServices = typeof mailServices;
