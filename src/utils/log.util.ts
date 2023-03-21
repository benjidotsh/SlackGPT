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
      return ['error'];
    case 'warn':
      return ['warn', 'error'];
    case 'info':
      return ['info', 'warn', 'error'];
    case 'verbose':
    case 'debug':
      return ['query', 'info', 'warn', 'error'];
    default:
      throw new Error('Invalid log level');
  }
}
