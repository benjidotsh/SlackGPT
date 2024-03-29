import { handleMessageEvent, Handler } from './index.js';

const appMentionHandler: Handler<'app_mention'> = {
  name: 'app_mention',
  type: 'event',
  handler: async (args) => {
    await handleMessageEvent(args);
  },
};

export default appMentionHandler;
