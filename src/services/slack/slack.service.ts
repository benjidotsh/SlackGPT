import Bolt from '@slack/bolt';
import { configurationMiddleware } from '../../middleware/index.js';
import {
  appHomeOpenedHandler,
  appMentionHandler,
  appUninstalledHandler,
  setOpenaiApiKeyHandler,
} from '../../handlers/index.js';
import { installationStore } from './index.js';
import config from '../../config.js';

export default class SlackService {
  private app: Bolt.App;

  constructor(options: Bolt.AppOptions) {
    this.app = new Bolt.App({
      installationStore,
      installerOptions: {
        directInstall: true,
      },
      logLevel: config.LOG_LEVEL as Bolt.LogLevel,
      ...options,
    });

    this.registerHandlers();
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
    this.app.action(appUninstalledHandler.name, appUninstalledHandler.handler);
  }

  /**
   * Remove Slack userIds from a message
   */
  static parseSlackMessage(message: string): string {
    return message.replace(/\s*<@[UW][A-Z0-9]{2,}>\s*/g, ' ').trim();
  }
}
