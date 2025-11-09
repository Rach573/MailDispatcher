// src/main/ipc/mail.ipc.ts
import { ipcMain } from "electron";
import * as dispatchService from "../services/DispatchService";
import type { Mail } from "../../shared/types/DatabaseModels";

/**
 * Enregistre tous les handlers IPC liés aux mails et tickets
 */
export function registerMailIpcHandlers() {
  ipcMain.handle("tickets:getAll", async () => {
    return await dispatchService.getAllTickets();
  });

  ipcMain.handle("tickets:create", async (_event, mail: Mail, agentUserId: number) => {
    return await dispatchService.createTicket(mail, agentUserId);
  });

  // Futurs handlers potentiels:
  // ipcMain.handle("tickets:resolve", ...)
  // ipcMain.handle("stats:getGenderCount", ...)
}
