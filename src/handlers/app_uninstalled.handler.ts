import { deleteItem, Table, Workspace } from '../services/dynamodb/index.js';
import { Handler } from './index.js';

const appUninstalledHandler: Handler = {
  name: 'app_uninstalled',
  type: 'action',
  handler: async ({ ack, context }) => {
    await ack();

    await deleteItem<Workspace>(Table.Workspace, { Id: context.teamId });
  },
};

export default appUninstalledHandler;
