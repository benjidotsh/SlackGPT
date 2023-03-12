/* eslint-disable import/prefer-default-export */

import { AwsHandler } from '@slack/bolt/dist/receivers/AwsLambdaReceiver.js';
import SlackService from './services/slack.service.js';

const slackService = new SlackService();

export const handler: AwsHandler = async (event, context, callback) => {
  const handle = await slackService.start();
  return handle(event, context, callback);
};
