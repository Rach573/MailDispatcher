// src/main/repositories/prisma/client.ts
import { PrismaClient } from './generated/client';
import { logger } from '../../utils/logger';

// Create Prisma client instance
export const prisma = new PrismaClient({
  log: [
    { level: 'warn', emit: 'event' },
    { level: 'error', emit: 'event' },
  ],
});

// Log warnings and errors
prisma.$on('warn', (e) => {
  logger.warn(`Prisma warning: ${e.message}`);
});

prisma.$on('error', (e) => {
  logger.error(`Prisma error: ${e.message}`);
});

// Handle graceful shutdown
export async function disconnectPrisma() {
  await prisma.$disconnect();
  logger.info('Prisma client disconnected');
}
