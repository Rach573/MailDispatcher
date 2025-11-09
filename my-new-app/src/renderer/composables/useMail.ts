// src/renderer/composables/useMail.ts

import { ref } from 'vue';
import type { Tache, Mail } from '../../shared/types/DatabaseModels';

/**
 * Composable pour gérer les tickets et mails depuis le renderer
 */
export function useMail() {
  const tickets = ref<Tache[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);

  /**
   * Charge tous les tickets depuis la base de données
   */
  async function loadTickets() {
    loading.value = true;
    error.value = null;
    try {
      tickets.value = await window.api.getAllTasks();
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : 'Erreur inconnue';
      error.value = `Erreur lors du chargement des tickets: ${errorMessage}`;
      console.error('Erreur chargement tickets:', e);
      tickets.value = [];
    } finally {
      loading.value = false;
    }
  }

  /**
   * Crée un nouveau ticket
   */
  async function createTicket(mail: Mail, agentUserId: number) {
    loading.value = true;
    error.value = null;
    try {
      const result = await window.api.createTask(mail, agentUserId);
      await loadTickets(); // Recharge la liste après création
      return result;
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : 'Erreur inconnue';
      error.value = `Erreur lors de la création du ticket: ${errorMessage}`;
      console.error('Erreur création ticket:', e);
      throw e;
    } finally {
      loading.value = false;
    }
  }

  return {
    tickets,
    loading,
    error,
    loadTickets,
    createTicket
  };
}
