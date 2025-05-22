import { NextFunction, Request, Response } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import appConfig from '../config/app.config';
import CustomError from '../utils/customError.utils';
import { prisma } from '../generated/prismaClient';
import asyncErrorHandler from './asyncErrorHandler.middleware';

const authGuard = asyncErrorHandler(async (req: Request, res: Response, next: NextFunction) => {
  const recievedToken = req.headers.authorization?.split(' ')[1];
  if (!recievedToken) throw new CustomError('Authorization token not recieved', 401);

  const payloadData = jwt.verify(recievedToken, appConfig.JWT_SECRET) as JwtPayload & {
    id: number;
  };
  if (!payloadData.id) throw new CustomError('Invalid token payload', 401);

  const user = await prisma.user.findUnique({
    where: { id: payloadData.id },
  });
  if (!user) throw new CustomError('User does not exists', 401);
  req.user = user;
  next();
});

export default authGuard;
