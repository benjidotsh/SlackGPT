import { PrismaClient } from '@prisma/client';

const prismaService = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
});

export default prismaService;
