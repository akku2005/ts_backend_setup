import { NextFunction, Request, Response } from 'express';
import httpResponse from '../utils/httpResponse';
import responseMessage from '../constants/responseMessage';
import httpError from '../utils/httpError';

export default {
  self: (req: Request, res: Response, next: NextFunction) => {
    try {
      // Simulate fetching the user
      // throw new Error('This is an error');
      httpResponse(req, res, 200, responseMessage.SUCCESS);
    } catch (error) {
      // Ensure error is treated as an instance of Error
      if (error instanceof Error) {
        httpError(next, error, req, 500);
      } else {
        // Create a generic error if the type is unknown
        const genericError = new Error(responseMessage.SOMETHING_WENT_WRONG);
        httpError(next, genericError, req, 500);
      }
    }
  },
};
