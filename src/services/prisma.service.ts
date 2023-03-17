import { PrismaClient } from '@prisma/client';
import { getPrismaLogLevel } from '../utils/index.js';

const prismaService = new PrismaClient({
  log: getPrismaLogLevel(),
});

export default prismaService;
