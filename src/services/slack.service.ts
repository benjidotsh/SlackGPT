import Bolt from '@slack/bolt';
import * as ChatGPTService from './chatgpt.service.js';

/**
 * Remove Slack userIds from a message
 */
const parseSlackMessage = (message: string): string =>
  message.replace(/<@[UW][A-Z0-9]{2,}>/g, '').trim();

export const addEventHandlers = (app: Bolt.App): void => {
  app.event('app_mention', async ({ event, say }) => {
    const message = parseSlackMessage(event.text);

    const { response } = await ChatGPTService.sendMessage(message);

    await say({
      text: response,
      thread_ts: event.thread_ts || event.ts,
    });
  });

  app.command('/gpt', async ({ command, ack, respond }) => {
    await ack();

    const { response } = await ChatGPTService.sendMessage(command.text);

    await respond(response);
  });
};
