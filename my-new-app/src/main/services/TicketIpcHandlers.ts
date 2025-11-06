import { ipcMain } from "electron";
import * as TicketService from "./TicketService";

export function registerIpcHandlers() {
  ipcMain.handle("tasks:get", async () => {
    return await TicketService.getTasks();
  });

  ipcMain.handle("tasks:create", async (_event, mailId, priorityId, categoryId) => {
    return await TicketService.createTask(mailId, priorityId, categoryId);
  });
}
