import Bolt from '@slack/bolt';
import { CryptoService, prismaService } from '../services/index.js';

export default async function openaiMiddleware({
  event,
  client,
  context,
  next,
}: Bolt.SlackEventMiddlewareArgs<'app_mention' | 'message'> &
  Bolt.AllMiddlewareArgs) {
  const messageEvent = event as Bolt.GenericMessageEvent;

  const workspace = await prismaService.workspace.findUnique({
    where: {
      id: messageEvent.team,
    },
  });

  if (!workspace?.apiKey) {
    client.chat.postEphemeral({
      text: 'SlackGPT is not configured in this workspace yet. Please contact your workspace admin.',
      channel: messageEvent.channel,
      user: messageEvent.user,
      thread_ts: messageEvent.thread_ts,
    });

    return;
  }

  workspace.apiKey = CryptoService.decrypt(workspace.apiKey);

  context.workspace = workspace;

  await next();
}
