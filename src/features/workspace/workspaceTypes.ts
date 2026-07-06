export type WorkspaceClient = {
  id: string;
  name: string;
  brandPresetId: string;
  projectLabel: string;
};

export type ClientWorkspace = {
  id: string;
  name: string;
  clients: WorkspaceClient[];
};

export type WorkspaceSelection = {
  workspaceId: string;
  clientId: string;
};
