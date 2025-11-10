// src/preload/mailServices.ts

import { ipcRenderer } from 'electron';
import type { Tache } from '../shared/types/DatabaseModels';

interface CreateTicketResult {
  id: number;
}

// API pont (noms côté renderer orientés "tasks" mais handlers côté main en "tickets")
export const mailServices = {
  getAllTasks: (): Promise<Tache[]> => {
    return ipcRenderer.invoke('tickets:getAll');
  },
  createTask: (mailId: number, agentUserId: number): Promise<CreateTicketResult> => {
    return ipcRenderer.invoke('tickets:create', mailId, agentUserId);
  }
  // Futurs ajouts: resolveTask, updateTicketStatus, stats...
};

export type MailServices = typeof mailServices;
