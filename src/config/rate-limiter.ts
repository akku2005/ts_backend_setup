import { RateLimiterMongo } from 'rate-limiter-flexible';
import { Connection } from 'mongoose';

// Define the rate limiter as null initially
export let rateLimiterMongo: RateLimiterMongo | null = null;

// Constants for rate limiting
const DURATION = 60; // Duration in seconds
const POINTS = 10; // Number of points

/**
 * Initializes the rate limiter with the provided Mongoose connection.
 * @param mongooseConnection - The Mongoose connection instance.
 */
export const initRateLimiter = (mongooseConnection: Connection): void => {
  if (!mongooseConnection || !mongooseConnection.readyState) {
    throw new Error('Invalid or uninitialized Mongoose connection.');
  }

  rateLimiterMongo = new RateLimiterMongo({
    storeClient: mongooseConnection,
    points: POINTS,
    duration: DURATION,
  });

  console.log('Rate limiter initialized.');
};
