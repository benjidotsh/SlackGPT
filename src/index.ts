/* eslint-disable import/prefer-default-export */

import SlackService from './services/slack.service.js';

export const { handler } = new SlackService();
