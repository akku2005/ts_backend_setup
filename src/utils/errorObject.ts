import { THttpError } from '../types/types';
import { Request } from 'express';
import responseMessage from '../constants/responseMessage';
import config from '../config/config';
import { EApplicationEnvironment } from '../constants/application';

export default (
  err: unknown, // Use `unknown` directly without combining it with `Error`
  req: Request,
  errorStatusCode: number = 500,
): THttpError => {
  const errorObj: THttpError = {
    success: false,
    statusCode: errorStatusCode,
    request: {
      ip: req.ip || null,
      method: req.method,
      url: req.originalUrl,
    },
    message:
      err instanceof Error ? err.message : responseMessage.SOMETHING_WENT_WRONG,
    data: null,
    trace: err instanceof Error ? { error: err.stack } : null,
  };

  if (config.ENV === EApplicationEnvironment.PRODUCTION) {
    delete errorObj.request.ip;
    delete errorObj.trace;
  }

  return errorObj;
};
