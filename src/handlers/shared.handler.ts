import Bolt from '@slack/bolt';
import { Workspace } from '@prisma/client';
import { ChatGPTService, SlackService } from '../services/index.js';

interface Metadata {
  event_type: 'slackgpt_reply';
  event_payload: {
    messageId: string;
  };
}

export async function handleMessageEvent({
  event,
  client,
  context,
}: Bolt.SlackEventMiddlewareArgs<'app_mention' | 'message'> &
  Bolt.AllMiddlewareArgs) {
  const messageEvent = event as Bolt.GenericMessageEvent & { text: string };

  let parentMessageId: string | undefined;

  if (messageEvent.thread_ts) {
    let replies = await client.conversations.replies({
      channel: messageEvent.channel,
      ts: messageEvent.thread_ts,
      include_all_metadata: true,
    });

    let { messages = [] } = replies;

    while (replies.has_more) {
      // eslint-disable-next-line no-await-in-loop
      replies = await client.conversations.replies({
        channel: messageEvent.channel,
        ts: messageEvent.thread_ts,
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

  const message = SlackService.parseSlackMessage(messageEvent.text);

  const { apiKey } = context.workspace as Workspace & {
    apiKey: string;
  };

  const { text: response, id: messageId } = await new ChatGPTService(
    apiKey
  ).sendMessage(message, {
    parentMessageId,
  });

  await client.chat.postMessage({
    channel: messageEvent.channel,
    thread_ts: messageEvent.thread_ts || messageEvent.ts,
    text: response,
    metadata: {
      event_type: 'slackgpt_reply',
      event_payload: {
        messageId,
      },
    },
  });
}
