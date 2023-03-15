import { Workspace } from '@prisma/client';
import { ChatGPTService, SlackService } from '../services/index.js';
import { Handler } from './index.js';

interface Metadata {
  event_type: 'slackgpt_reply';
  event_payload: {
    messageId: string;
  };
}

const appMentionHandler: Handler<'app_mention'> = {
  name: 'app_mention',
  type: 'event',
  handler: async ({ event, client, context }) => {
    let parentMessageId: string | undefined;

    if (event.thread_ts) {
      let replies = await client.conversations.replies({
        channel: event.channel,
        ts: event.thread_ts,
        include_all_metadata: true,
      });

      let { messages = [] } = replies;

      while (replies.has_more) {
        // eslint-disable-next-line no-await-in-loop
        replies = await client.conversations.replies({
          channel: event.channel,
          ts: event.thread_ts,
          include_all_metadata: true,
          cursor: replies.response_metadata?.next_cursor,
        });

        messages = messages.concat(replies.messages || []);
      }

      const parentMessageMetadata = messages
        .reverse()
        .find((message) => message.metadata?.event_type === 'slackgpt_reply')
        ?.metadata as Metadata | undefined;

      parentMessageId = parentMessageMetadata?.event_payload.messageId;
    }

    const message = SlackService.parseSlackMessage(event.text);

    const { apiKey } = context.workspace as Workspace & {
      apiKey: string;
    };

    const { text: response, id: messageId } = await new ChatGPTService(
      apiKey
    ).sendMessage(message, {
      parentMessageId,
    });

    await client.chat.postMessage({
      channel: event.channel,
      thread_ts: event.thread_ts || event.ts,
      text: response,
      metadata: {
        event_type: 'slackgpt_reply',
        event_payload: {
          messageId,
        },
      },
    });
  },
};

export default appMentionHandler;
