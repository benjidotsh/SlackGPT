import Bolt from '@slack/bolt';
import config from './config.js';
import * as SlackService from './services/slack.service.js';

const app = new Bolt.App({
  token: config.SLACK_BOT_TOKEN,
  signingSecret: config.SLACK_SIGNING_SECRET,
  socketMode: config.SLACK_APP_TOKEN ? true : false,
  appToken: config.SLACK_APP_TOKEN,
  port: config.PORT,
});

SlackService.addEventHandlers(app);

await app.start();

console.log(`🤖 SlackGPT is running on port ${config.PORT}`);
