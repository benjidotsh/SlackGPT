import Bolt from '@slack/bolt';

export enum Table {
  Workspace = 'workspace',
}

export type Workspace = {
  Id: string;
  Installation: Bolt.Installation;
  OpenAiApiKey?: string;
};
