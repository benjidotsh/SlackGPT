import Bolt from '@slack/bolt';
import { Prisma } from '@prisma/client';
import config from '../config.js';

export function getSlackLogLevel(): Bolt.LogLevel {
  switch (config.LOG_LEVEL) {
    case 'error':
      return Bolt.LogLevel.ERROR;
    case 'warn':
      return Bolt.LogLevel.WARN;
    case 'info':
      return Bolt.LogLevel.INFO;
    case 'verbose':
    case 'debug':
      return Bolt.LogLevel.DEBUG;
    default:
      throw new Error('Invalid log level');
  }
}

export function getPrismaLogLevel(): Prisma.LogLevel[] {
  switch (config.LOG_LEVEL) {
    case 'error':
      return ['query', 'info', 'warn', 'error'];
    case 'warn':
      return ['query', 'info', 'warn'];
    case 'info':
      return ['query', 'info'];
    case 'verbose':
    case 'debug':
      return ['query'];
    default:
      throw new Error('Invalid log level');
  }
}
