import { RateLimiterMongo } from 'rate-limiter-flexible';
import { Connection } from 'mongoose';
export let rateLimiterMongo: null | RateLimiterMongo = null;
const DURATION = 60;
const POINTS = 10;
export const initRateLimiter = (mongooseConnection: Connection) => {
  rateLimiterMongo = new RateLimiterMongo({
    storeClient: mongooseConnection,
    points: POINTS,
    duration: DURATION,
  });
};
