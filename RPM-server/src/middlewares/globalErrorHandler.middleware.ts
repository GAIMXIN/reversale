import { ErrorRequestHandler } from 'express';
import { Prisma } from '../generated/prismaClient';
import appConfig from '../config/app.config';
import CustomError from '../utils/customError.utils';

const NODE_ENV = appConfig.NODE_ENV ?? 'prod';

interface ValidationDetail {
  message: string;
  [key: string]: unknown;
}

const PRISMA_STATUS: Record<string, number> = {
  P2002: 409,
  P2003: 409,
  P2025: 404,
  P2016: 400,
  P2021: 503,
  P2022: 503,
  P1017: 503,
};

const PRISMA_MESSAGES: Record<string, (meta?: Record<string, any>) => string> = {
  P2002: (meta) => `Conflict: ${meta?.target?.join(', ') ?? 'Field'} already exists`,
  P2025: (meta) => `${meta?.modelName ?? 'Resource'} not found`,
  P2016: () => 'Missing required field',
};

const parseValidationError = (msg: string): ValidationDetail => {
  if (/Expected (.+?), provided (\w+)/.test(msg)) {
    const [, expected, received] = msg.match(/Expected (.+?), provided (\w+)/)!;
    return { message: `Expected ${expected} but received ${received}`, expected, received };
  }
  if (/Got invalid value '(.+?)' at/.test(msg)) {
    const [, val] = msg.match(/Got invalid value '(.+?)' at/)!;
    return { message: `Invalid value format: ${val}`, invalidValue: val };
  }
  if (/Unknown argument `(\w+)`/.test(msg)) {
    const [, field] = msg.match(/Unknown argument `(\w+)`/)!;
    return { message: `Unexpected field: ${field}`, unknownField: field };
  }
  return { message: msg };
};

const handlePrismaError = (err: Error): CustomError | null => {
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    const code = err.code;
    const status = PRISMA_STATUS[code] ?? 500;
    const meta = (err.meta as Record<string, any>) ?? {};

    const msgFactory = PRISMA_MESSAGES[code];
    const message = msgFactory ? msgFactory(meta) : 'Database request error';

    return new CustomError(message, status, {
      prismaCode: code,
      ...(NODE_ENV === 'dev' && { meta }),
    });
  }

  if (err instanceof Prisma.PrismaClientValidationError) {
    const details = parseValidationError(err.message);
    return new CustomError('Invalid request structure', 400, { validation: details });
  }

  if (err instanceof Prisma.PrismaClientInitializationError) {
    return new CustomError('Database connection error', 503, { code: 'DB_CONNECTION_FAILURE' });
  }

  if (err instanceof Prisma.PrismaClientRustPanicError) {
    return new CustomError('Database system error', 500, { code: 'DB_ENGINE_FAILURE' });
  }

  return null;
};

const globalErrorHandler: ErrorRequestHandler = (err, req, res, next) => {
  const prismaHandled = handlePrismaError(err);
  const error = prismaHandled ?? (err as CustomError);

  const payload: Record<string, any> = {
    success: false,
    status: error.status ?? 'Error',
    message: error.message,
  };

  if (error.details != null) payload.details = error.details;
  if (NODE_ENV === 'dev') {
    payload.stack = error.stack;
    payload.error = error;
  }

  if (NODE_ENV === 'prod') {
    payload.message = 'An unexpected error occurred';
    delete payload.stack;
    delete payload.error;
  }

  res.status(error.statusCode ?? 500).json(payload);
};

process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception', error);
  process.exit(1);
});

process.on('unhandledRejection', (error) => {
  console.error('Unhandled Rejection', error);
  process.exit(1);
});

export default globalErrorHandler;
