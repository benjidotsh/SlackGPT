import Bolt from '@slack/bolt';
import { prismaService } from '../index.js';

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
          installation,
        },
        create: {
          id: installation.enterprise.id,
          installation,
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
          installation,
        },
        create: {
          id: installation.team.id,
          installation,
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
