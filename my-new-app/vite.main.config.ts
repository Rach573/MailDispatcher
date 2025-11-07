// my-new-app/vite.main.config.ts
import { defineConfig } from 'vite';

// https://vitejs.dev/config
export default defineConfig({
	build: {
		rollupOptions: {
			// Externaliser prisma, son adaptateur, et mysql2
			external: [
        '@prisma/client', 
        '@prisma/adapter-mariadb', 
        'mysql2', 
        'mysql2/promise'
      ]
		}
	}
});
