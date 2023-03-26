import { handleMessageEvent, Handler } from './index.js';

const messageImHandler: Handler<'message'> = {
  name: 'message',
  type: 'event',
  handler: async (args) => {
    if (args.event.channel_type !== 'im') return;

    await handleMessageEvent(args);
  },
};

export default messageImHandler;
