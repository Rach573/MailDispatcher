// src/preload/mailServices.ts

import { ipcRenderer } from 'electron';
import type { Tache, Mail } from '../shared/types/DatabaseModels';

// API pont (noms côté renderer orientés "tasks" mais handlers côté main en "tickets")
export const mailServices = {
  getAllTasks: (): Promise<Tache[]> => {
    return ipcRenderer.invoke('tickets:getAll');
  },
  createTask: (mail: Mail, agentUserId: number): Promise<any> => {
    return ipcRenderer.invoke('tickets:create', mail, agentUserId);
  }
  // Futurs ajouts: resolveTask, updateTicketStatus, stats...
};

export type MailServices = typeof mailServices;
