import Bolt from '@slack/bolt';
import { prismaService, SlackService } from '../index.js';

export const installationStore: Bolt.InstallationStore = {
  storeInstallation: async (installation) => {
    if (
      installation.isEnterpriseInstall &&
      installation.enterprise !== undefined
    ) {
      await prismaService.workspace.upsert({
        where: {
          id: installation.enterprise.id,
        },
        update: {
          installation: installation as object,
          scopeVersion: SlackService.scopeVersion,
        },
        create: {
          id: installation.enterprise.id,
          installation: installation as object,
          scopeVersion: SlackService.scopeVersion,
        },
      });

      return;
    }
    if (installation.team !== undefined) {
      await prismaService.workspace.upsert({
        where: {
          id: installation.team.id,
        },
        update: {
          installation: installation as object,
          scopeVersion: SlackService.scopeVersion,
        },
        create: {
          id: installation.team.id,
          installation: installation as object,
          scopeVersion: SlackService.scopeVersion,
        },
      });

      return;
    }
    throw new Error('Failed saving installation data to installationStore');
  },
  fetchInstallation: async (installQuery) => {
    if (
      installQuery.isEnterpriseInstall &&
      installQuery.enterpriseId !== undefined
    ) {
      const workspace = await prismaService.workspace.findUnique({
        where: {
          id: installQuery.enterpriseId,
        },
      });

      if (workspace)
        return workspace.installation as unknown as Bolt.Installation;
    }
    if (installQuery.teamId !== undefined) {
      const workspace = await prismaService.workspace.findUnique({
        where: {
          id: installQuery.teamId,
        },
      });

      if (workspace)
        return workspace.installation as unknown as Bolt.Installation;
    }
    throw new Error('Failed fetching installation');
  },
  deleteInstallation: async (installQuery) => {
    if (
      installQuery.isEnterpriseInstall &&
      installQuery.enterpriseId !== undefined
    ) {
      await prismaService.workspace.delete({
        where: { id: installQuery.enterpriseId },
      });

      return;
    }
    if (installQuery.teamId !== undefined) {
      await prismaService.workspace.delete({
        where: { id: installQuery.teamId },
      });

      return;
    }
    throw new Error('Failed to delete installation');
  },
};
