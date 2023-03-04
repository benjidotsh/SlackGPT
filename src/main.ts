import config from './config.js';
import SlackService from './services/slack.service.js';

const slackService = new SlackService({
  token: config.SLACK_BOT_TOKEN,
  signingSecret: config.SLACK_SIGNING_SECRET,
  socketMode: !!config.SLACK_APP_TOKEN,
  appToken: config.SLACK_APP_TOKEN,
  port: config.PORT,
});

slackService.start();

console.log(`🤖 SlackGPT is running on port ${config.PORT}`);
