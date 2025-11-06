import { contextBridge, ipcRenderer } from 'electron';
import type { Tache, Mail } from '../shared/types/DatabaseModels';

contextBridge.exposeInMainWorld('api', {
  getAllTickets: async (): Promise<Tache[]> => {
    return await ipcRenderer.invoke('tickets:getAll');
  },
  createTicket: async (mail: Mail, agentUserId: number): Promise<void> => {
    await ipcRenderer.invoke('tickets:create', mail, agentUserId);
  }
});
