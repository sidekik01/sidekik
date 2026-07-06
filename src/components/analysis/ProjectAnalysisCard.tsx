import { Check, Loader2 } from "lucide-react";
import { Badge, Card, Panel, ProgressBar } from "@/src/components/ui";
import { analysisSteps } from "@/src/types/project";
import type { AnalysisStep } from "@/src/types/project";

export function ProjectAnalysisCard({
  activeStep,
}: Readonly<{
  activeStep: AnalysisStep;
}>) {
  const activeStepIndex = analysisSteps.indexOf(activeStep);
  const progress = ((activeStepIndex + 1) / analysisSteps.length) * 100;

  return (
    <Panel className="relative z-10 mx-4 w-full max-w-3xl bg-zinc-950/80 p-5 shadow-black/50 sm:p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-sky-300">
            Project Analysis
          </p>
          <h3 className="mt-2 text-2xl font-semibold text-white">
            Analyzing Project
          </h3>
          <p className="mt-2 max-w-xl text-sm leading-6 text-zinc-400">
            The creative sidekick behind every great video is reading local
            metadata and preparing your workspace.
          </p>
        </div>
        <Badge>Analyzing</Badge>
      </div>

      <Card className="mt-6 bg-black/25 p-4">
        <div className="mb-4 flex items-center justify-between">
          <span className="text-sm font-semibold text-zinc-100">
            Analysis Progress
          </span>
          <span className="font-mono text-xs text-zinc-500">
            {Math.round(progress)}%
          </span>
        </div>
        <ProgressBar value={progress} />
        <div className="mt-4 grid gap-2">
          {analysisSteps.map((step, index) => {
            const isComplete = index < activeStepIndex;
            const isCurrent = step === activeStep;

            return (
              <div
                className="flex items-center gap-3 rounded-xl px-2 py-1.5 text-sm"
                key={step}
              >
                <span
                  className={`grid size-6 place-items-center rounded-full ${
                    isComplete
                      ? "bg-emerald-400 text-zinc-950"
                      : isCurrent
                        ? "bg-sky-400/15 text-sky-300"
                        : "bg-white/[0.05] text-zinc-600"
                  }`}
                >
                  {isComplete ? (
                    <Check className="size-3.5" aria-hidden="true" />
                  ) : isCurrent ? (
                    <Loader2
                      className="size-3.5 animate-spin"
                      aria-hidden="true"
                    />
                  ) : (
                    <span className="size-1.5 rounded-full bg-current" />
                  )}
                </span>
                <span
                  className={
                    isComplete || isCurrent ? "text-zinc-100" : "text-zinc-500"
                  }
                >
                  {step}
                </span>
              </div>
            );
          })}
        </div>
      </Card>
    </Panel>
  );
}
