// src/main/services/TicketIpcHandlers.ts
import { ipcMain } from "electron";
import * as dispatchService from "./DispatchService";
import type { Mail } from "../../shared/types/DatabaseModels";

export function registerIpcHandlers() {
  
  ipcMain.handle("tickets:getAll", async () => {
    return await dispatchService.getAllTickets();
  });

  ipcMain.handle("tickets:create", async (_event, mail: Mail, agentUserId: number) => {
    return await dispatchService.createTicket(mail, agentUserId);
  });
  
  // (Ajoutez ici les futurs handlers : "tickets:resolve", "stats:getGenderCount", etc.)
}
