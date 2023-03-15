/* eslint-disable import/prefer-default-export */

import config from './config.js';
import { SlackService } from './services/slack/index.js';

const slackService = new SlackService({
  signingSecret: config.SLACK_SIGNING_SECRET,
  clientId: config.SLACK_CLIENT_ID,
  clientSecret: config.SLACK_CLIENT_SECRET,
  stateSecret: config.SLACK_STATE_SECRET,
  scopes: [
    'app_mentions:read',
    'channels:history',
    'chat:write',
    'groups:history',
    'im:history',
    'mpim:history',
    'users:read',
  ],
  port: config.PORT,
});

slackService.start();

console.log(`🤖 SlackGPT is running on port ${config.PORT}`);
