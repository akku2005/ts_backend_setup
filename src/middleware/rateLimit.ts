import config from '../config/config';
import { NextFunction, Response, Request } from 'express';
import { EApplicationEnvironment } from '../constants/application';
import { rateLimiterMongo } from '../config/rate-limiter';
import httpError from '../utils/httpError';
import responseMessage from '../constants/responseMessage';

export default (req: Request, _: Response, next: NextFunction) => {
  if (config.ENV === EApplicationEnvironment.DEVELOPMENT) {
    return next();
  }
  if (rateLimiterMongo) {
    rateLimiterMongo
      .consume(req.ip as string, 1)
      .then(() => {
        next();
      })
      .catch(() => {
        httpError(next, new Error(responseMessage.TOO_MANY_REQUEST), req, 429);
      });
  }
};
