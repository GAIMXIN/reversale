import { Request, Response, NextFunction, RequestHandler } from 'express';

type AsyncRequestHandler = (req: Request, res: Response, next: NextFunction) => Promise<any>;

const asyncErrorHandler = (requestHandler: AsyncRequestHandler): RequestHandler => {
  return (req, res, next) => {
    requestHandler(req, res, next).catch(next);
  };
};

export default asyncErrorHandler;
