import { createApp } from './app';
import { config } from './config';
import { logger } from './utils/logger';
import { redisService } from './services/redis';
import { initSentry } from './config/sentry';

// Initialize Sentry before anything else
initSentry();

const startServer = async () => {
  try {
    // Initialize Redis connection
    logger.info('Connecting to Redis...');
    await redisService.connect();
    logger.info('Redis connected successfully');

    const app = createApp();

    app.listen(config.port, () => {
      logger.info(`🎭 Theater Script Pro API running on port ${config.port}`);
      logger.info(`📍 Environment: ${config.env}`);
      logger.info(`🔗 Health check: http://localhost:${config.port}/health`);
    });

    // Graceful shutdown
    process.on('SIGTERM', async () => {
      logger.info('SIGTERM signal received: closing HTTP server');
      await redisService.disconnect();
      process.exit(0);
    });

    process.on('SIGINT', async () => {
      logger.info('SIGINT signal received: closing HTTP server');
      await redisService.disconnect();
      process.exit(0);
    });

    process.on('unhandledRejection', (reason, promise) => {
      logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
      // Let Sentry capture unhandled rejections before exiting
      setTimeout(() => {
        process.exit(1);
      }, 2000);
    });

  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();