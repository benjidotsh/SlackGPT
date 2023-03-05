import Bolt from '@slack/bolt';
import prismaService from '../services/prisma.service.js';
import { configurationBlocks } from '../blocks/index.js';
import { Handler } from './index.js';

const appHomeOpenedHandler: Handler<'app_home_opened'> = {
  name: 'app_home_opened',
  type: 'event',
  handler: async ({ event, client, context, ...rest }) => {
    console.dir({ event, context, rest });
    const blocks: (Bolt.Block | Bolt.KnownBlock)[] = [];

    // Configuration
    const { user } = await client.users.info({ user: event.user });
    const workspace = await prismaService.workspace.findFirst({
      where: { id: context.teamId },
    });
    if (user?.is_admin) blocks.push(...configurationBlocks(!!workspace));

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
