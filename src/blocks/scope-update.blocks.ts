import Bolt from '@slack/bolt';

const scopeUpdateBlocks: (Bolt.Block | Bolt.KnownBlock)[] = [
  {
    type: 'section',
    text: {
      type: 'mrkdwn',
      text: '*Scopes have been updated. Please reinstall SlackGPT to update the required scopes.*',
    },
    accessory: {
      type: 'button',
      text: {
        type: 'plain_text',
        text: 'Reinstall SlackGPT',
      },
      url: 'https://slackgpt.vps.benji.sh/slack/install',
    },
  },
  {
    type: 'divider',
  },
];

export default scopeUpdateBlocks;
