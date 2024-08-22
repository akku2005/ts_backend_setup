import { NextFunction, Request } from 'express';
import errorObject from './errorObject';
export default (
  nextfunc: NextFunction,
  err: Error,
  req: Request,
  errorStatusCode: number = 500,
): void => {
  const errorObj = errorObject(err, req, errorStatusCode);
  return nextfunc(errorObj);
};
