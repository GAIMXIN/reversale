import { PrismaClient, Prisma } from '@prisma/client';

const prisma = new PrismaClient({
  omit: { user: { password: true } },
});

export { prisma, Prisma };
