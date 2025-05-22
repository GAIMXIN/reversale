import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import { prisma, Prisma } from '../generated/prismaClient';
import { LoginData, SignupData } from '../types/auth.type';
import CustomError from '../utils/customError.utils';
import appConfig from '../config/app.config';
type User = Awaited<ReturnType<typeof prisma.user.findUnique>>;
type PublicUser = Omit<NonNullable<User>, 'password'>;

const signup = async (validatedData: SignupData): Promise<PublicUser> => {
  validatedData.password = await bcrypt.hash(validatedData.password, 12);
  const user = await prisma.user.create({
    data: validatedData,
  });
  return user;
};

const login = async (validatedData: LoginData): Promise<PublicUser & { token: string }> => {
  const user = await prisma.user.findUnique({
    where: {
      email: validatedData.email,
    },
    omit: {
      password: false,
    },
  });

  if (!user || !(await bcrypt.compare(validatedData.password, user.password))) {
    throw new CustomError('Invalid login credentials provided', 401);
  }
  const token = jwt.sign({ id: user.id }, appConfig.JWT_SECRET, { expiresIn: '1d' });
  const { password, ...safeUser } = user;

  return { ...safeUser, token };
};

export default {
  signup,
  login,
};
