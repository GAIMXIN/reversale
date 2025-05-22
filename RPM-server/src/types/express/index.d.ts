import { User } from '@prisma/client';

interface UserWithoutPassword extends Omit<User, 'password'> {}

declare global {
  namespace Express {
    interface Request {
      user?: UserWithoutPassword;
    }
  }
}

export {};
