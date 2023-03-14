import Bolt from '@slack/bolt';
import serverlessExpress from '@vendia/serverless-express';
import { configurationMiddleware } from '../middleware/index.js';
import {
  appHomeOpenedHandler,
  appMentionHandler,
  appUninstalledHandler,
  setOpenaiApiKeyHandler,
} from '../handlers/index.js';
import config from '../config.js';
import { getItem, putItem, deleteItem } from './dynamodb/dynamodb.service.js';
import { Table, Workspace } from './dynamodb/dynamodb.interface.js';

export default class SlackService {
  private receiver: Bolt.ExpressReceiver;

  private app: Bolt.App;

  private _handler: unknown;

  constructor() {
    this.receiver = new Bolt.ExpressReceiver({
      signingSecret: config.SLACK_SIGNING_SECRET,
      clientId: config.SLACK_CLIENT_ID,
      clientSecret: config.SLACK_CLIENT_SECRET,
      stateSecret: config.SLACK_STATE_SECRET,
      scopes: [
        'app_mentions:read',
        'channels:history',
        'chat:write',
        'groups:history',
        'im:history',
        'mpim:history',
        'users:read',
      ],
      installationStore: {
        storeInstallation: async (installation) => {
          if (
            installation.isEnterpriseInstall &&
            installation.enterprise !== undefined
          ) {
            return putItem(Table.Workspace, {
              Id: installation.enterprise.id,
              Installation: installation,
            });
          }
          if (installation.team !== undefined) {
            return putItem<Workspace>(Table.Workspace, {
              Id: installation.team.id,
              Installation: installation,
            });
          }
          throw new Error(
            'Failed saving installation data to installationStore'
          );
        },
        fetchInstallation: async (installQuery) => {
          if (
            installQuery.isEnterpriseInstall &&
            installQuery.enterpriseId !== undefined
          ) {
            const workspace = await getItem<Workspace>(Table.Workspace, {
              Id: installQuery.enterpriseId,
            });

            if (workspace) return workspace.Installation;
          }
          if (installQuery.teamId !== undefined) {
            const workspace = await getItem<Workspace>(Table.Workspace, {
              Id: installQuery.teamId,
            });

            if (workspace) return workspace.Installation;
          }
          throw new Error('Failed fetching installation');
        },
        deleteInstallation: async (installQuery) => {
          if (
            installQuery.isEnterpriseInstall &&
            installQuery.enterpriseId !== undefined
          ) {
            return deleteItem(Table.Workspace, {
              Id: installQuery.enterpriseId,
            });
          }
          if (installQuery.teamId !== undefined) {
            return deleteItem(Table.Workspace, { Id: installQuery.teamId });
          }
          throw new Error('Failed to delete installation');
        },
      },
      installerOptions: {
        directInstall: true,
      },
      processBeforeResponse: true,
      logLevel: Bolt.LogLevel.DEBUG,
    });

    this.app = new Bolt.App({
      receiver: this.receiver,
    });

    this.registerHandlers();

    this._handler = serverlessExpress.configure({
      app: this.receiver.app,
      logSettings: { level: 'debug' },
    });
  }

  get handler(): unknown {
    return this._handler;
  }

  private registerHandlers(): void {
    this.app.event(appHomeOpenedHandler.name, appHomeOpenedHandler.handler);
    this.app.action(
      setOpenaiApiKeyHandler.name,
      setOpenaiApiKeyHandler.handler
    );
    this.app.event(
      appMentionHandler.name,
      configurationMiddleware,
      appMentionHandler.handler
    );
    this.app.action(appUninstalledHandler.name, appUninstalledHandler.handler);
  }

  /**
   * Remove Slack userIds from a message
   */
  static parseSlackMessage(message: string): string {
    return message.replace(/\s*<@[UW][A-Z0-9]{2,}>\s*/g, ' ').trim();
  }
}
