import Bolt from '@slack/bolt';
import { prismaService, SlackService } from '../services/index.js';
import {
  configurationBlocks,
  scopeUpdateBlocks,
  welcomeBlocks,
} from '../blocks/index.js';
import { Handler } from './index.js';

const appHomeOpenedHandler: Handler<'app_home_opened'> = {
  name: 'app_home_opened',
  type: 'event',
  handler: async ({ event, client, context }) => {
    const { user } = await client.users.info({ user: event.user });
    const workspace = await prismaService.workspace.findUniqueOrThrow({
      where: {
        id: context.teamId,
      },
    });

    const blocks: (Bolt.Block | Bolt.KnownBlock)[] = [];

    // Scope update
    if (user?.is_admin && workspace.scopeVersion < SlackService.scopeVersion)
      blocks.push(...scopeUpdateBlocks);

    // Welcome
    blocks.push(...welcomeBlocks);

    // Configuration
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
