<template>
  <div class="dispatch-app">
    <h2>MailDispatcher - Tickets</h2>
    <p>Système de gestion des tickets basé sur la hiérarchie du staff.</p>
    
    <div v-if="loading" class="loading">Chargement...</div>
    <div v-if="error" class="error">{{ error }}</div>
    
    <ul v-if="!loading && tickets.length > 0">
      <li v-for="ticket in tickets" :key="ticket.id">
        Ticket #{{ ticket.id }} - Statut: {{ ticket.statut_tache }} - Priorité: {{ ticket.priorite_calculee }}
      </li>
    </ul>
    
    <p v-if="!loading && tickets.length === 0" class="no-tickets">
      Aucun ticket disponible.
    </p>
    
    <button @click="reload" :disabled="loading">
      {{ loading ? 'Chargement...' : 'Recharger les tickets' }}
    </button>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted } from 'vue';
import { useMail } from './composables/useMail';

export default defineComponent({
  name: 'DispatchApp',
  setup() {
    const { tickets, loading, error, loadTickets } = useMail();

    function reload() {
      loadTickets();
    }

    onMounted(() => {
      loadTickets();
    });

    return { 
      tickets, 
      loading, 
      error, 
      reload 
    };
  }
});
</script>

<style scoped>
.dispatch-app { 
  font-family: sans-serif; 
  padding: 1rem; 
  max-width: 1200px;
  margin: 0 auto;
}

h2 {
  color: #2c3e50;
}

.loading {
  color: #42b983;
  font-weight: bold;
  padding: 1rem;
}

.error {
  color: #e74c3c;
  background: #fadbd8;
  padding: 1rem;
  border-radius: 4px;
  margin: 1rem 0;
}

.no-tickets {
  color: #7f8c8d;
  font-style: italic;
}

ul {
  list-style: none;
  padding: 0;
}

li {
  padding: 0.5rem;
  margin: 0.5rem 0;
  background: #f5f5f5;
  border-left: 3px solid #42b983;
}

button { 
  margin-top: 1rem;
  padding: 0.5rem 1rem;
  background: #42b983;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background 0.3s;
}

button:hover:not(:disabled) {
  background: #359268;
}

button:disabled {
  background: #95a5a6;
  cursor: not-allowed;
}
</style>
