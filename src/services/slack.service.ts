import Bolt from '@slack/bolt';
import { configurationMiddleware } from '../middleware/index.js';
import {
  appHomeOpenedHandler,
  appMentionHandler,
  appUninstalledHandler,
  setOpenaiApiKeyHandler,
} from '../handlers/index.js';
import config from '../config.js';

export default class SlackService {
  private receiver: Bolt.AwsLambdaReceiver;

  private app: Bolt.App;

  constructor() {
    this.receiver = new Bolt.AwsLambdaReceiver({
      signingSecret: config.SLACK_SIGNING_SECRET,
    });

    this.app = new Bolt.App({
      receiver: this.receiver,
      token: config.SLACK_BOT_TOKEN,
    });

    this.registerHandlers();
  }

  start() {
    return this.receiver.start();
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
