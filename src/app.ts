import express, { Application, Request, Response, NextFunction } from 'express';
import path from 'path';
import router from './routes/apiRouter';
import globalErrorHandler from './middleware/globalErrorHandler';
import responseMessage from './constants/responseMessage';
import httpError from './utils/httpError';
import helmet from 'helmet';
import cors from 'cors';

// Custom Error Class to include HTTP status codes
class HttpError extends Error {
  statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.name = 'HttpError';
  }
}

const app: Application = express();

// Middlewares
app.use(helmet());
app.use(
  cors({
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTION', 'HEAD'],
    origin: ['http://client.com'],
    credentials: true,
  }),
);
app.use(express.json());
app.use(express.static(path.join(__dirname, '../', 'public')));

// Routes
app.use('/api/v1', router);

// 404 Handler
app.use((req: Request, _: Response, next: NextFunction) => {
  // Create a new instance of HttpError for 404
  const notFoundError = new HttpError(responseMessage.NOT_FOUND('route'), 404);
  httpError(next, notFoundError, req, notFoundError.statusCode);
});

// Global Error Handler
app.use(globalErrorHandler);

export default app;
