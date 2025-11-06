import { Task } from "../../shared/type";

// global window.api declared in src/types/global.d.ts

async function loadTasks() {
  const tasks: Task[] = await window.api.getTasks();
  console.log("Tâches :", tasks);
}

async function addTask() {
  await window.api.createTask(1, 2, 3);
  console.log("Tâche ajoutée");
}

loadTasks();
