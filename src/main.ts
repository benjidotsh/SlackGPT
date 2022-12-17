import Bolt from '@slack/bolt';
import Config from './config.js';

const app = new Bolt.App({
  token: Config.SLACK_BOT_TOKEN,
  signingSecret: Config.SLACK_SIGNING_SECRET,
  socketMode: true,
  appToken: Config.SLACK_APP_TOKEN,
  port: Config.PORT,
});

app.event('app_mention', async ({ event, say }) => {
  await say({
    blocks: [
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: `Thanks for the mention <@${event.user}>! Here's a button`,
        },
        accessory: {
          type: 'button',
          text: {
            type: 'plain_text',
            text: 'Button',
            emoji: true,
          },
          value: 'click_me_123',
          action_id: 'first_button',
        },
      },
    ],
  });
});

await app.start();

console.log(`🤖 SlackGPT is running on port ${Config.PORT}`);
