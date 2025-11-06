import { ipcMain } from "electron";
import * as repo from "./repoFunction";

export function registerIpcHandlers() {
  ipcMain.handle("tasks:get", async () => {
    return await repo.getTasks();
  });

  ipcMain.handle("tasks:create", async (_event, mailId, priorityId, categoryId) => {
    return await repo.createTask(mailId, priorityId, categoryId);
  });
}
