import Bolt from '@slack/bolt';

const welcomeBlocks: (Bolt.Block | Bolt.KnownBlock)[] = [
  {
    type: 'header',
    text: {
      type: 'plain_text',
      text: 'Welcome to SlackGPT :robot_face:',
    },
  },
  {
    type: 'section',
    text: {
      type: 'mrkdwn',
      text: "I'm your friendly neighborhood chatbot powered by ChatGPT. I can help you with a variety of tasks, including answering questions, generating text and more!",
    },
  },
  {
    type: 'header',
    text: {
      type: 'plain_text',
      text: 'Here is how you can can talk to me:',
    },
  },
  {
    type: 'section',
    text: {
      type: 'mrkdwn',
      text: ":speech_balloon: Send me a DM and I'll respond right away.",
    },
  },
  {
    type: 'section',
    text: {
      type: 'mrkdwn',
      text: ":busts_in_silhouette: In DM's with other people, tag me with `@SlackGPT`.",
    },
  },
  {
    type: 'section',
    text: {
      type: 'mrkdwn',
      text: ':loudspeaker: In public and private channels, tag me with `@SlackGPT`.',
    },
  },
];

export default welcomeBlocks;
