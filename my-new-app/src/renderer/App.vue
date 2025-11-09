<template>
  <div class="dispatch-app">
    <h2>MailDispatcher - Tickets</h2>
    <p>Système de gestion des tickets basé sur la hiérarchie du staff.</p>
    
    <section class="agents-section">
      <h3>Agents disponibles</h3>
      <div v-if="agents.length === 0" class="no-data">Aucun agent trouvé</div>
      <ul v-else class="agents-list">
        <li v-for="agent in agents" :key="agent.id" class="agent-item">
          Agent: {{ agent.username }} (ID: {{ agent.id }})
        </li>
      </ul>
      <button @click="reloadAgents">Recharger les agents</button>
    </section>

    <section class="tickets-section">
      <h3>Tickets</h3>
      <div v-if="tickets.length === 0" class="no-data">Aucun ticket trouvé</div>
      <ul v-else>
        <li v-for="ticket in tickets" :key="ticket.id">
          Ticket #{{ ticket.id }} - Statut: {{ ticket.statut_tache }} - Priorité: {{ ticket.priorite_calculee }}
        </li>
      </ul>
      <button @click="reload">Recharger les tickets</button>
    </section>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue';
import type { Tache, User } from '../shared/types/DatabaseModels';

// global window.api declared in src/types/global.d.ts

export default defineComponent({
  name: 'DispatchApp',
  setup() {
  const tickets = ref<Tache[]>([]);
  const agents = ref<User[]>([]);

    async function load() {
      try {
  tickets.value = await window.api.getAllTasks();
      } catch (e) {
        console.error('Erreur chargement tickets:', e);
        tickets.value = [];
      }
    }

    async function loadAgents() {
      try {
        agents.value = await window.api.getAllAgents();
      } catch (e) {
        console.error('Erreur chargement agents:', e);
        agents.value = [];
      }
    }

    function reload() {
      load();
    }

    function reloadAgents() {
      loadAgents();
    }

    onMounted(() => {
      load();
      loadAgents();
    });

    return { tickets, agents, reload, reloadAgents };
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
h3 {
  color: #34495e;
  margin-top: 1.5rem;
}
.agents-section,
.tickets-section {
  margin: 1.5rem 0;
  padding: 1rem;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  background: #fafafa;
}
.agents-list {
  list-style: none;
  padding: 0;
}
.agent-item {
  padding: 0.5rem;
  margin: 0.5rem 0;
  background: #e3f2fd;
  border-left: 3px solid #2196f3;
  border-radius: 4px;
}
.no-data {
  padding: 1rem;
  color: #999;
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
}
button:hover {
  background: #359268;
}
</style>
