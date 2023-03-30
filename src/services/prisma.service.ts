import Bolt from '@slack/bolt';
import { PrismaClient } from '@prisma/client';
import { getPrismaLogLevel } from '../utils/index.js';

declare global {
  namespace PrismaJson {
    type Installation = Bolt.Installation;
  }
}

const prismaService = new PrismaClient({
  log: getPrismaLogLevel(),
});

export default prismaService;
