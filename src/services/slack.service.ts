import Bolt from '@slack/bolt';
import configurationMiddleware from '../middleware/configuration.middleware.js';
import ChatGPTService from './chatgpt.service.js';
import prismaService from './prisma.service.js';

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
      await client.views.publish({
        user_id: event.user,
        view: {
          type: 'home',
          blocks: [
            {
              type: 'header',
              text: {
                type: 'plain_text',
                text: 'Configuration',
              },
            },
            {
              dispatch_action: true,
              type: 'input',
              element: {
                type: 'plain_text_input',
                action_id: 'set_openai_api_key',
              },
              label: {
                type: 'plain_text',
                text: 'OpenAI API Key',
              },
            },
            {
              type: 'context',
              elements: [
                {
                  type: 'plain_text',
                  text: 'We store your API key securely and only use it to communicate with OpenAI in this workspace.',
                },
              ],
            },
          ],
        },
      });
    });

    this.app.action('set_openai_api_key', async ({ action, context, ack }) => {
      const { value } = action as Bolt.PlainTextInputAction;

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

      await ack();
    });

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
