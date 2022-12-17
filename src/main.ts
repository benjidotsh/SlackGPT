import Bolt from '@slack/bolt';
import Config from './config.js';
import { parseSlackMessage } from './util.js';
import * as ChatGPTService from './services/chatgpt.service.js';

const app = new Bolt.App({
  token: Config.SLACK_BOT_TOKEN,
  signingSecret: Config.SLACK_SIGNING_SECRET,
  socketMode: true,
  appToken: Config.SLACK_APP_TOKEN,
  port: Config.PORT,
});

app.event('app_mention', async ({ event: { text }, say }) => {
  const { response } = await ChatGPTService.send(parseSlackMessage(text));

  await say({
    blocks: [
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: response,
        },
        accessory: {
          type: 'button',
          text: {
            type: 'plain_text',
            text: 'Ask again',
          },
          action_id: 'ask_again',
        },
      },
    ],
    text: response,
  });
});

app.action('ask_again', async ({ ack, say }) => {
  await ack();
  await say('Asking again is currently not supported. Please try again later.');
});

await app.start();

console.log(`🤖 SlackGPT is running on port ${Config.PORT}`);
