import Bolt from '@slack/bolt';
import { CryptoService, prismaService } from '../services/index.js';

export default async function openaiMiddleware({
  event,
  client,
  context,
  next,
}: Bolt.SlackEventMiddlewareArgs<'app_mention'> & Bolt.AllMiddlewareArgs) {
  const workspace = await prismaService.workspace.findUnique({
    where: {
      id: event.team,
    },
  });

  if (!workspace?.apiKey) {
    client.chat.postEphemeral({
      text: 'SlackGPT is not configured in this workspace yet. Please contact your workspace admin.',
      channel: event.channel,
      user: event.user as string,
      thread_ts: event.thread_ts,
    });

    return;
  }

  workspace.apiKey = CryptoService.decrypt(workspace.apiKey);

  context.workspace = workspace;

  await next();
}
