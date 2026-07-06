import type { ClientWorkspace } from "@/src/features/workspace/workspaceTypes";

export const defaultWorkspaces: ClientWorkspace[] = [
  {
    clients: [
      {
        brandPresetId: "momentum",
        id: "momentum",
        name: "Momentum",
        projectLabel: "Momentum",
      },
      {
        brandPresetId: "holliday",
        id: "holliday",
        name: "Holliday",
        projectLabel: "Holliday",
      },
      {
        brandPresetId: "whalley",
        id: "whalley",
        name: "Whalley",
        projectLabel: "Whalley",
      },
      {
        brandPresetId: "pacbrake",
        id: "pacbrake",
        name: "PacBrake",
        projectLabel: "PacBrake",
      },
      {
        brandPresetId: "citypost",
        id: "citypost",
        name: "CityPost",
        projectLabel: "CityPost",
      },
      {
        brandPresetId: "custom",
        id: "custom-client",
        name: "Custom Client",
        projectLabel: "Custom Client",
      },
    ],
    id: "sidekik-workspace",
    name: "Sidekik Workspace",
  },
];

export const defaultWorkspace = defaultWorkspaces[0];
export const defaultWorkspaceClient = defaultWorkspace.clients[0];
