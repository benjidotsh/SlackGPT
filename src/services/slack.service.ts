import Bolt from '@slack/bolt';
import { configurationMiddleware } from '../middleware/index.js';
import {
  appHomeOpenedHandler,
  appMentionHandler,
  appUninstalledHandler,
  setOpenaiApiKeyHandler,
} from '../handlers/index.js';

export default class SlackService {
  private app: Bolt.App;

  constructor(options: Bolt.AppOptions) {
    this.app = new Bolt.App(options);
    this.registerHandlers();
  }

  start() {
    return this.app.start();
  }

  registerHandlers(): void {
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
