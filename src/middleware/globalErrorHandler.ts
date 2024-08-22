import { Request, Response } from 'express';
import { THttpError } from '../types/types';

export default (
  err: THttpError,
  _: Request, // Unused variable
  res: Response,
) => {
  res.status(err.statusCode).json(err);
};
