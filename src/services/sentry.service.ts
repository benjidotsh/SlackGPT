import * as Sentry from '@sentry/node';
import { CaptureContext } from '@sentry/types';
import '@sentry/tracing';
import config from '../config.js';

if (config.SENTRY_DSN)
  Sentry.init({
    dsn: config.SENTRY_DSN,
    tracesSampleRate: 1.0,
  });

export default class SentryService {
  static captureException(
    exception: Error,
    context?: CaptureContext | undefined
  ): void {
    if (config.SENTRY_DSN) Sentry.captureException(exception, context);
  }
}
