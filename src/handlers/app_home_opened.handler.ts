import Bolt from '@slack/bolt';
import { configurationBlocks } from '../blocks/index.js';
import { Handler } from './index.js';

const appHomeOpenedHandler: Handler<'app_home_opened'> = {
  name: 'app_home_opened',
  type: 'event',
  handler: async ({ event, client }) => {
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
  },
};

export default appHomeOpenedHandler;
