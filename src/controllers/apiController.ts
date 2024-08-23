import { NextFunction, Request, Response } from 'express';
import httpResponse from '../utils/httpResponse';
import responseMessage from '../constants/responseMessage';
import httpError from '../utils/httpError';
import quicker from '../utils/quicker';
import Logger from '../utils/logger'; // Assuming you have a Logger utility

export default {
  self: (req: Request, res: Response, next: NextFunction) => {
    try {
      httpResponse(req, res, 200, responseMessage.SUCCESS);
    } catch (error) {
      if (error instanceof Error) {
        httpError(next, error, req, 500);
      } else {
        const genericError = new Error(responseMessage.SOMETHING_WENT_WRONG);
        httpError(next, genericError, req, 500);
      }
    }
  },

  health: (req: Request, res: Response, next: NextFunction) => {
    try {
      const applicationHealth = quicker.getApplicationHealth();
      const systemHealth = quicker.getSystemHealth();
      const timeStamp = new Date().toISOString();

      Logger.info('Health Check Data', {
        applicationHealth,
        systemHealth,
        timeStamp,
      });

      const healthData = {
        application: applicationHealth,
        system: systemHealth,
        timeStamp: timeStamp,
      };

      httpResponse(req, res, 200, responseMessage.SUCCESS, healthData);
    } catch (error) {
      if (error instanceof Error) {
        httpError(next, error, req, 500);
      } else {
        const genericError = new Error(responseMessage.SOMETHING_WENT_WRONG);
        httpError(next, genericError, req, 500);
      }
    }
  },
};
