import { ipcRenderer } from "electron";
import { Task } from "../../shared/type";

export async function getTasks(): Promise<Task[]> {
  return await ipcRenderer.invoke("tasks:get");
}

export async function createTask(mailId: number, priorityId: number, categoryId: number): Promise<Task> {
  return await ipcRenderer.invoke("tasks:create", mailId, priorityId, categoryId);
}
