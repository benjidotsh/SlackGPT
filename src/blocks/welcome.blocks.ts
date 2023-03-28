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
      text: ':busts_in_silhouette: In a DM with other people, tag me with `@SlackGPT`.',
    },
  },
  {
    type: 'section',
    text: {
      type: 'mrkdwn',
      text: ':loudspeaker: In public and private channels, tag me with `@SlackGPT`.',
    },
  },
  {
    type: 'header',
    text: {
      type: 'plain_text',
      text: 'Here are some ideas to get you started:',
    },
  },
  {
    type: 'section',
    text: {
      type: 'mrkdwn',
      text: '• Ask me for a fun fact about anything!',
    },
  },
  {
    type: 'section',
    text: {
      type: 'mrkdwn',
      text: "• Need help with brainstorming? Tell me about your project and I'll generate some ideas for you!",
    },
  },
  {
    type: 'section',
    text: {
      type: 'mrkdwn',
      text: '• Feeling bored? Ask me to tell you a joke or a riddle!',
    },
  },
  {
    type: 'section',
    text: {
      type: 'mrkdwn',
      text: "• Need a quick summary of a news article you don't have time to read? Send me the content of the article and I'll generate one for you!",
    },
  },
  {
    type: 'section',
    text: {
      type: 'mrkdwn',
      text: '• Want to learn a new language? Ask me to translate a phrase for you!',
    },
  },
  {
    type: 'section',
    text: {
      type: 'mrkdwn',
      text: "• Want to improve your writing? Send me a paragraph and I'll suggest edits to make it more readable!",
    },
  },
];

export default welcomeBlocks;
