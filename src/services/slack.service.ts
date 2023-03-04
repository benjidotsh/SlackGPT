import Bolt from '@slack/bolt';
import ChatGPTService from './chatgpt.service.js';

interface Metadata {
  event_type: 'slackgpt_reply';
  event_payload: {
    messageId: string;
  };
}

export default class SlackService {
  private app: Bolt.App;

  private chatGPTService: ChatGPTService;

  constructor(options: Bolt.AppOptions) {
    this.app = new Bolt.App(options);
    this.addEventHandlers();

    this.chatGPTService = new ChatGPTService();
  }

  start() {
    return this.app.start();
  }

  addEventHandlers(): void {
    this.app.event('app_mention', async ({ event, client }) => {
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

      const { text: response, id: messageId } =
        await this.chatGPTService.sendMessage(message, {
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
    });
  }

  /**
   * Remove Slack userIds from a message
   */
  private static parseSlackMessage(message: string): string {
    return message.replace(/<@[UW][A-Z0-9]{2,}>/g, '').trim();
  }
}
