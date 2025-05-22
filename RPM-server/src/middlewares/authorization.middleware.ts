import { NextFunction, Request, RequestHandler, Response } from 'express';
import CustomError from '../utils/customError.utils';

const authorization = (requiredRole: 'doctor' | 'patient') => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) throw new CustomError('Please login', 401);
    if (req.user.role !== requiredRole)
      throw new CustomError(`You need to be ${requiredRole} to perform this action`, 400);
    next();
  };
};
export default authorization;
