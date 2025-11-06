<template>
  <div class="type-info">
    <h2>Types partagés</h2>
    <p>Composant de démonstration montrant l'utilisation du type Task.</p>
    <ul>
      <li v-for="task in tasks" :key="task.id">#{{ task.id }} — état: {{ task.state }}</li>
    </ul>
    <button @click="reload">Reload</button>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue';
import type { Task } from '../shared/types/MessagingModels';

// global window.api declared in src/types/global.d.ts

export default defineComponent({
  name: 'TypeApp',
  setup() {
    const tasks = ref<Task[]>([]);

    async function load() {
      try {
        tasks.value = await window.api.getTasks();
      } catch (e) {
        // fallback vide
        tasks.value = [];
      }
    }

    function reload() {
      load();
    }

    onMounted(load);

    return { tasks, reload };
  }
});
</script>

<style scoped>
.type-info { font-family: sans-serif; padding: 0.5rem; }
button { margin-top: 1rem }
</style>
