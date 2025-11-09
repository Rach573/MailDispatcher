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

  ipcMain.handle("agents:getAll", async () => {
    return await dispatchService.getAllAgents();
  });

  ipcMain.handle("agents:getById", async (_event, agentId: number) => {
    return await dispatchService.getAgentById(agentId);
  });

  // Futurs handlers potentiels:
  // ipcMain.handle("tickets:resolve", ...)
  // ipcMain.handle("stats:getGenderCount", ...)
}
