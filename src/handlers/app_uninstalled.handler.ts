import { prismaService } from 'services/index.js';
import { Handler } from './index.js';

const appUninstalledHandler: Handler = {
  name: 'app_uninstalled',
  type: 'action',
  handler: async ({ ack, context }) => {
    await ack();

    await prismaService.workspace.delete({
      where: {
        id: context.teamId,
      },
    });
  },
};

export default appUninstalledHandler;
