import config from './config.js';
import { SlackService } from './services/slack/index.js';

const slackService = new SlackService({
  signingSecret: config.SLACK_SIGNING_SECRET,
  clientId: config.SLACK_CLIENT_ID,
  clientSecret: config.SLACK_CLIENT_SECRET,
  stateSecret: config.SLACK_STATE_SECRET,
  port: config.PORT,
});

slackService.start();

console.log(`🤖 SlackGPT is running on port ${config.PORT}`);
