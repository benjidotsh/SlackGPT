import prismaService from '../services/prisma.service.js';
import { Handler } from './index.js';

const appUninstalledHandler: Handler = {
  name: 'app_uninstalled',
  type: 'action',
  handler: async ({ context }) => {
    await prismaService.workspace.delete({
      where: {
        id: context.teamId,
      },
    });
  },
};

export default appUninstalledHandler;
