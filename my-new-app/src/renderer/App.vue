<template>
  <div class="dispatch-app">
    <h2>MailDispatcher - Tickets</h2>
    <p>Système de gestion des tickets basé sur la hiérarchie du staff.</p>
    <ul>
      <li v-for="ticket in tickets" :key="ticket.id">
        Ticket #{{ ticket.id }} - Statut: {{ ticket.statut_tache }} - Priorité: {{ ticket.priorite_calculee }}
      </li>
    </ul>
    <button @click="reload">Recharger les tickets</button>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue';
import type { Tache } from '../shared/types/DatabaseModels';

// global window.api declared in src/types/global.d.ts

export default defineComponent({
  name: 'DispatchApp',
  setup() {
    const tickets = ref<Tache[]>([]);

    async function load() {
      try {
        tickets.value = await window.api.getAllTickets();
      } catch (e) {
        console.error('Erreur chargement tickets:', e);
        tickets.value = [];
      }
    }

    function reload() {
      load();
    }

    onMounted(load);

    return { tickets, reload };
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
}
button:hover {
  background: #359268;
}
</style>
