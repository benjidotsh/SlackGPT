import Bolt from '@slack/bolt';
import { errorBlocks } from '../blocks/index.js';
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
    await client.chat.postMessage({
      channel: messageEvent.channel,
      thread_ts: messageEvent.thread_ts || messageEvent.ts,
      blocks: errorBlocks(
        'SlackGPT is not configured in this workspace yet.',
        'Please contact your workspace admin.',
        'gear'
      ),
    });

    return;
  }

  workspace.apiKey = CryptoService.decrypt(workspace.apiKey);

  context.workspace = workspace;

  await next();
}
