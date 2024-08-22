// src/service/databaseService.ts

import config from '../config/config';
import mongoose from 'mongoose';

export default {
  connect: async () => {
    try {
      // Mongoose v6+ uses defaults, so no need for `useNewUrlParser` or `useUnifiedTopology`
      await mongoose.connect(config.DATABASE_URL as string);
      console.log('Successfully connected to the database');
      return mongoose.connection;
    } catch (error) {
      console.error('Error connecting to the database:', error);
      throw error; // Re-throw the error to handle it in the calling function
    }
  },
};
