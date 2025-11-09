// src/renderer/renderer.ts

import { createApp } from 'vue';
import App from './App.vue';
import '../index.css';

// Mount Vue application
const app = createApp(App);
app.mount('#app');
