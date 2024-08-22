import config from './config/config';
import app from './app';
import logger from './utils/logger';
import databaseService from './service/databaseService';

// Start the server
const server = app.listen(config.PORT, () => {
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
    logger.error('Application ERROR', { meta: error });

    // Properly handle server close and exit
    try {
      await new Promise<void>((resolve, reject) => {
        server.close((err) => {
          if (err) {
            logger.error('Error closing server', { meta: err });
            reject(err);
          } else {
            resolve();
          }
        });
      });
    } catch (closeError) {
      logger.error('Error during server shutdown', { meta: closeError });
    }

    process.exit(1);
  }
})();
