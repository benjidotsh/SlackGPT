import Bolt from '@slack/bolt';

export const installationStore: Bolt.InstallationStore = {
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
    throw new Error('Failed saving installation data to installationStore');
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
};
