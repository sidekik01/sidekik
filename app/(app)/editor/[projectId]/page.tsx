import { SidekikEditorApp } from "@/src/features/editor/SidekikEditorApp";

export default async function EditorProjectPage({
  params,
}: Readonly<{
  params: Promise<{ projectId: string }>;
}>) {
  const { projectId } = await params;

  return <SidekikEditorApp projectId={projectId} />;
}
