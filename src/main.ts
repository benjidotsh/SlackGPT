import Bolt from '@slack/bolt';
import Config from './config.js';
import * as SlackService from './services/slack.service.js';

const app = new Bolt.App({
  token: Config.SLACK_BOT_TOKEN,
  signingSecret: Config.SLACK_SIGNING_SECRET,
  socketMode: true,
  appToken: Config.SLACK_APP_TOKEN,
  port: Config.PORT,
});

SlackService.addEventHandlers(app);

await app.start();

console.log(`🤖 SlackGPT is running on port ${Config.PORT}`);
