import { defineConfig } from 'vite';

// https://vitejs.dev/config
export default defineConfig({
	build: {
		rollupOptions: {
			external: ['mysql2', 'mysql2/promise']
		}
	}
});
