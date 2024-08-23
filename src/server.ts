import config from './config/config';
import app from './app';
import logger from './utils/logger';
import databaseService from './service/databaseService';
import { Server } from 'http';

// Start the server
const server: Server = app.listen(config.PORT, () => {
  logger.info(`Server is listening on port ${config.PORT}`);
});

// Async function to handle startup tasks
(async () => {
  try {
    // Database connection
    const connection = await databaseService.connect();
    logger.info('DATABASE_CONNECTION', {
      meta: {
        CONNECTION_NAME: connection.name,
      },
    });

    logger.info('Application Started', {
      meta: {
        PORT: config.PORT,
        SERVER_URL: config.SERVER_URL,
      },
    });
  } catch (error) {
    logger.error('Application ERROR', {
      meta: {
        message: (error as Error).message,
        stack: (error as Error).stack,
      },
    });

    // Properly handle server close and exit
    try {
      await new Promise<void>((resolve, reject) => {
        server.close((err) => {
          if (err) {
            logger.error('Error closing server', {
              meta: {
                message: err.message,
                stack: err.stack,
              },
            });
            reject(err);
          } else {
            resolve();
          }
        });
      });
    } catch (closeError) {
      logger.error('Error during server shutdown', {
        meta: {
          message: (closeError as Error).message,
          stack: (closeError as Error).stack,
        },
      });
    }

    process.exit(1);
  }
})();
