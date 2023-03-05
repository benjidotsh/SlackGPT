import Bolt from '@slack/bolt';
import CryptoService from '../services/crypto.service.js';
import prismaService from '../services/prisma.service.js';
import { Handler } from './index.js';

const setOpenaiApiKeyHandler: Handler = {
  name: 'set_openai_api_key',
  type: 'action',
  handler: async ({ ack, client, body, action, context }) => {
    await ack();

    const { value } = action as Bolt.PlainTextInputAction;

    const { user } = await client.users.info({ user: body.user.id });

    if (!value || !user?.is_admin) {
      return;
    }

    const encryptedValue = CryptoService.encrypt(value);

    await prismaService.workspace.upsert({
      where: {
        id: context.teamId,
      },
      update: {
        openaiApiKey: encryptedValue,
      },
      create: {
        id: context.teamId as string,
        openaiApiKey: encryptedValue,
      },
    });
  },
};

export default setOpenaiApiKeyHandler;
