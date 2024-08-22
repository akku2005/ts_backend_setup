import config from './config/config';
import app from './app';

const server = app.listen(config.PORT);

(() => {
  try {
    console.info(`Application Started`, {
      meta: {
        PORT: config.PORT,
        SERVER_URL: config.SERVER_URL,
      },
    });
  } catch (error) {
    console.log(`Application ERROR`, { meta: error });
    server.close((err) => {
      if (err) {
        console.log(`Application_ERROR`, { meta: err });
      }
      process.exit(1);
    });
  }
})();
