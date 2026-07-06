import { Badge, Button, Card } from "@/src/components/ui";

export function UploadPrompt({
  onSelectVideo,
  uploadError,
}: Readonly<{
  onSelectVideo: () => void;
  uploadError: string | null;
}>) {
  return (
    <Card className="relative z-10 mx-4 flex w-full max-w-2xl flex-col items-center rounded-3xl border-dashed border-white/15 bg-black/25 px-6 py-12 text-center shadow-2xl shadow-black/30 backdrop-blur sm:px-10">
      <div className="grid size-14 place-items-center rounded-2xl border border-sky-300/20 bg-sky-300/10">
        <div className="h-5 w-7 rounded-md border border-sky-100/80" />
      </div>
      <h3 className="mt-5 text-xl font-semibold text-white">
        Upload your video
      </h3>
      <p className="mt-2 max-w-md text-sm leading-6 text-zinc-400">
        The creative sidekick behind every great video. Upload an MP4, MOV, or
        M4V file to begin.
      </p>
      <Button
        className="mt-6"
        onClick={(event) => {
          event.stopPropagation();
          onSelectVideo();
        }}
        size="lg"
        variant="primary"
      >
        Select video
      </Button>
      {uploadError && (
        <Badge className="mt-4" tone="danger">
          {uploadError}
        </Badge>
      )}
    </Card>
  );
}
