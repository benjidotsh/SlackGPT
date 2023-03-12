import Bolt from '@slack/bolt';
import CryptoService from '../services/crypto.service.js';
import { Table, updateItem, Workspace } from '../services/dynamodb/index.js';
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

    await updateItem<Workspace>(
      Table.Workspace,
      { Id: context.teamId },
      { OpenAiApiKey: encryptedValue }
    );
  },
};

export default setOpenaiApiKeyHandler;
