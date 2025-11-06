import { Tache } from "../shared/types/DatabaseModels";

// global window.api declared in src/types/global.d.ts

async function loadTickets() {
  const tickets: Tache[] = await window.api.getAllTasks();
  console.log("Tickets :", tickets);
}

// Exemple de création de ticket (à adapter selon votre UI)
// async function createTicket() {
//   const mail = { id: 1, objet: "Test", ... }; // Objet Mail complet
//   await window.api.createTask(mail, 1);
//   console.log("Ticket créé");
// }

loadTickets();
