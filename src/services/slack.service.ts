import Bolt from '@slack/bolt';
import * as ChatGPTService from './chatgpt.service.js';

/**
 * Remove Slack userIds from a message
 */
const parseSlackMessage = (message: string): string =>
  message.replace(/<@[UW][A-Z0-9]{2,}>/g, '').trim();

export const addEventHandlers = (app: Bolt.App): void => {
  app.event('app_mention', async ({ event, client }) => {
    let lastReply;

    if (event.thread_ts) {
      let replies = await client.conversations.replies({
        channel: event.channel,
        ts: event.thread_ts,
        include_all_metadata: true,
      });

      let messages = replies.messages;

      while (replies.has_more) {
        replies = await client.conversations.replies({
          channel: event.channel,
          ts: event.thread_ts,
          include_all_metadata: true,
          cursor: replies.response_metadata.next_cursor,
        });

        messages = messages.concat(replies.messages);
      }

      lastReply = messages
        .reverse()
        .find((message) => message.metadata?.event_type === 'slackgpt_reply');
    }

    const message = parseSlackMessage(event.text);

    const { response, conversationId, messageId } =
      await ChatGPTService.sendMessage(message, {
        conversationId: lastReply?.metadata.event_payload.conversationId,
        parentMessageId: lastReply?.metadata.event_payload.messageId,
      });

    await client.chat.postMessage({
      channel: event.channel,
      thread_ts: event.thread_ts || event.ts,
      text: response,
      metadata: {
        event_type: 'slackgpt_reply',
        event_payload: {
          conversationId,
          messageId,
        },
      },
    });
  });
};
