import { Workspace } from '../services/dynamodb/index.js';
import ChatGPTService from '../services/chatgpt.service.js';
import SlackService from '../services/slack/index.js';
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

    const { OpenAiApiKey } = context.workspace as Workspace & {
      OpenAiApiKey: string;
    };

    const { text: response, id: messageId } = await new ChatGPTService(
      OpenAiApiKey
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
