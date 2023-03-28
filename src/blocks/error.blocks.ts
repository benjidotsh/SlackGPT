import Bolt from '@slack/bolt';

function errorBlocks(
  title: string,
  description: string,
  emoji: string = 'warning'
): (Bolt.Block | Bolt.KnownBlock)[] {
  return [
    {
      type: 'context',
      elements: [
        {
          type: 'plain_text',
          text: `:${emoji}: ${title}`,
        },
      ],
    },
    {
      type: 'context',
      elements: [
        {
          type: 'plain_text',
          text: description,
        },
      ],
    },
  ];
}

export default errorBlocks;
