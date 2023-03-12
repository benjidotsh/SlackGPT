import Bolt from '@slack/bolt';
import CryptoService from '../services/crypto.service.js';
import { getItem, Workspace, Table } from '../services/dynamodb/index.js';

export default async function openaiMiddleware({
  event,
  client,
  context,
  next,
}: Bolt.SlackEventMiddlewareArgs<'app_mention'> & Bolt.AllMiddlewareArgs) {
  const workspace = await getItem<Workspace>(Table.Workspace, {
    Id: event.team,
  });

  if (!workspace) {
    client.chat.postEphemeral({
      text: 'SlackGPT is not configured in this workspace yet. Please contact your workspace admin.',
      channel: event.channel,
      user: event.user as string,
      thread_ts: event.thread_ts,
    });

    return;
  }

  workspace.OpenAiApiKey = CryptoService.decrypt(workspace.OpenAiApiKey);

  context.workspace = workspace;

  await next();
}
