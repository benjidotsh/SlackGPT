import Bolt from '@slack/bolt';
import { prismaService } from '../services/index.js';
import { configurationBlocks, welcomeBlocks } from '../blocks/index.js';
import { Handler } from './index.js';

const appHomeOpenedHandler: Handler<'app_home_opened'> = {
  name: 'app_home_opened',
  type: 'event',
  handler: async ({ event, client, context }) => {
    const blocks: (Bolt.Block | Bolt.KnownBlock)[] = [];

    // Welcome
    blocks.push(...welcomeBlocks);

    // Configuration
    const { user } = await client.users.info({ user: event.user });
    const workspace = await prismaService.workspace.findUnique({
      where: {
        id: context.teamId,
      },
    });
    if (user?.is_admin)
      blocks.push(...configurationBlocks(!!workspace?.apiKey));

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
