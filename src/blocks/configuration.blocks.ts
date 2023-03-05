import Bolt from '@slack/bolt';

function configurationBlocks(isSet: boolean): (Bolt.Block | Bolt.KnownBlock)[] {
  return [
    {
      type: 'header',
      text: {
        type: 'plain_text',
        text: 'Configuration',
      },
    },
    {
      type: 'context',
      elements: [
        {
          type: 'plain_text',
          text: 'This is only visible to workspace admins.',
        },
      ],
    },
    {
      dispatch_action: true,
      type: 'input',
      element: {
        type: 'plain_text_input',
        action_id: 'set_openai_api_key',
        placeholder: {
          type: 'plain_text',
          text: isSet ? 'Hidden' : 'Not configured yet',
        },
      },
      label: {
        type: 'plain_text',
        text: 'OpenAI API key',
      },
    },
    {
      type: 'context',
      elements: [
        {
          type: 'plain_text',
          text: 'Your API key is stored securely and is only being used to communicate with OpenAI in this workspace.',
        },
      ],
    },
    {
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: "<https://platform.openai.com/account/api-keys|Don't have an OpenAI API key yet?>",
      },
    },
  ];
}

export default configurationBlocks;
