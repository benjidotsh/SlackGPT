import Bolt from '@slack/bolt';
import configurationMiddleware from '../middleware/configuration.middleware.js';
import ChatGPTService from './chatgpt.service.js';
import prismaService from './prisma.service.js';
import { configurationBlocks } from '../blocks/index.js';

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
    this.app.event('app_home_opened', async ({ event, client }) => {
      const blocks: (Bolt.Block | Bolt.KnownBlock)[] = [];

      // Configuration
      const { user } = await client.users.info({ user: event.user });
      if (user?.is_admin) blocks.push(...configurationBlocks);

      await client.views.publish({
        user_id: event.user,
        view: {
          type: 'home',
          blocks,
        },
      });
    });

    this.app.action(
      'set_openai_api_key',
      async ({ client, body, action, context, ack }) => {
        const { value } = action as Bolt.PlainTextInputAction;

        const { user } = await client.users.info({ user: body.user.id });

        if (!value || !user?.is_admin) {
          return ack();
        }

        // TODO: Encrypt the API key

        await prismaService.workspace.upsert({
          where: {
            id: context.teamId,
          },
          update: {
            openaiApiKey: value,
          },
          create: {
            id: context.teamId as string,
            openaiApiKey: value,
          },
        });

        return ack();
      }
    );

    this.app.event(
      'app_mention',
      configurationMiddleware,
      async ({ event, client }) => {
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
            .find(
              (message) => message.metadata?.event_type === 'slackgpt_reply'
            )?.metadata as Metadata | undefined;

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
      }
    );

    this.app.event('app_uninstalled', async ({ context }) => {
      await prismaService.workspace.delete({
        where: {
          id: context.teamId,
        },
      });
    });
  }

  /**
   * Remove Slack userIds from a message
   */
  private static parseSlackMessage(message: string): string {
    return message.replace(/\s*<@[UW][A-Z0-9]{2,}>\s*/g, ' ').trim();
  }
}
