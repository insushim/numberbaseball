import 'dotenv/config';
import { createServer } from 'http';
import app from './app';
import { SocketManager } from './socket/socketManager';
import { prisma } from './config/database';
import { redis } from './config/redis';
import { logger } from './utils/logger';

const PORT = process.env.PORT || 4000;

async function main() {
  try {
    // Database connection check
    await prisma.$connect();
    logger.info('PostgreSQL connected');

    // Redis connection check
    await redis.ping();
    logger.info('Redis connected');

    // Create HTTP server
    const httpServer = createServer(app);

    // Initialize Socket.IO
    const socketManager = new SocketManager(httpServer, prisma, redis);
    logger.info('Socket.IO initialized');

    // Start server
    httpServer.listen(PORT, () => {
      logger.info(`Server running on port ${PORT}`);
      logger.info(`Environment: ${process.env.NODE_ENV || 'development'}`);
    });

    // Graceful shutdown
    const gracefulShutdown = async (signal: string) => {
      logger.info(`${signal} received. Shutting down gracefully...`);

      httpServer.close(async () => {
        await prisma.$disconnect();
        await redis.quit();
        logger.info('Server closed');
        process.exit(0);
      });

      setTimeout(() => {
        logger.error('Forced shutdown');
        process.exit(1);
      }, 10000);
    };

    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
}

main();
