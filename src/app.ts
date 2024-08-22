import express, { Application, Request, Response, NextFunction } from 'express';
import path from 'path';
import router from './routes/apiRouter';
import globalErrorHandler from './middleware/globalErrorHandler';
import responseMessage from './constants/responseMessage';
import httpError from './utils/httpError';

const app: Application = express();

// Middlewares
app.use(express.json());
app.use(express.static(path.join(__dirname, '../', 'public')));

// Routes
app.use('/api/v1', router);

// 404 Handler
app.use((req: Request, _: Response, next: NextFunction) => {
  try {
    // Throwing a custom 404 error
    throw new Error(responseMessage.NOT_FOUND('route'));
  } catch (err) {
    // Handling the error using the httpError utility
    httpError(next, err, req, 404);
  }
});

// Global Error Handler
app.use(globalErrorHandler);

export default app;
