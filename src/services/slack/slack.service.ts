import Bolt from '@slack/bolt';
import { getSlackLogLevel } from '../../utils/index.js';
import { SentryService } from '../index.js';
import { configurationMiddleware } from '../../middleware/index.js';
import {
  appHomeOpenedHandler,
  appMentionHandler,
  appUninstalledHandler,
  messageImHandler,
  setOpenaiApiKeyHandler,
} from '../../handlers/index.js';
import { installationStore } from './index.js';

export default class SlackService {
  private app: Bolt.App;

  constructor(options: Bolt.AppOptions) {
    this.app = new Bolt.App({
      scopes: [
        'app_mentions:read',
        'channels:history',
        'chat:write',
        'groups:history',
        'im:history',
        'mpim:history',
        'users:read',
      ],
      installationStore,
      installerOptions: {
        directInstall: true,
      },
      logLevel: getSlackLogLevel(),
      ...options,
    });

    this.registerHandlers();

    this.app.error(async (error) => {
      console.error(error);
      SentryService.captureException(error, {
        tags: {
          service: 'slack',
        },
      });
    });
  }

  start(): void {
    this.app.start();
  }

  private registerHandlers(): void {
    this.app.event(appHomeOpenedHandler.name, appHomeOpenedHandler.handler);
    this.app.action(
      setOpenaiApiKeyHandler.name,
      setOpenaiApiKeyHandler.handler
    );
    this.app.event(
      appMentionHandler.name,
      configurationMiddleware,
      appMentionHandler.handler
    );
    this.app.event(
      messageImHandler.name,
      configurationMiddleware,
      messageImHandler.handler
    );
    this.app.action(appUninstalledHandler.name, appUninstalledHandler.handler);
  }

  /**
   * Remove Slack userIds from a message
   */
  static parseSlackMessage(message: string): string {
    return message.replace(/\s*<@[UW][A-Z0-9]{2,}>\s*/g, ' ').trim();
  }
}
