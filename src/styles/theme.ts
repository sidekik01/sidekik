export const theme = {
  animations: {
    spin: "animate-spin",
  },
  borderRadius: {
    button: "rounded-xl",
    card: "rounded-2xl",
    panel: "rounded-[28px]",
    pill: "rounded-full",
  },
  colors: {
    accent: {
      primary: "sky-400",
      secondary: "violet-400",
      success: "emerald-400",
      warning: "amber-300",
      danger: "red-300",
    },
    border: {
      default: "border-white/10",
      subtle: "border-white/8",
    },
    surface: {
      app: "bg-[#090a0d]",
      card: "bg-white/[0.035]",
      panel: "bg-zinc-950/85",
      raised: "bg-zinc-900/80",
    },
    text: {
      default: "text-zinc-100",
      muted: "text-zinc-400",
      subtle: "text-zinc-500",
    },
  },
  shadows: {
    panel: "shadow-2xl shadow-black/30",
    raised: "shadow-lg shadow-sky-950/30",
    subtle: "shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]",
  },
  spacing: {
    panel: "p-4",
    section: "p-4",
    tight: "p-3",
  },
  transitions: {
    default: "transition",
    interactive: "transition hover:bg-white/[0.07] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300/50 disabled:cursor-not-allowed disabled:opacity-50",
  },
  typography: {
    body: "text-sm leading-6",
    caption: "text-xs leading-5",
    eyebrow: "text-[10px] font-semibold uppercase tracking-wider",
    heading: "text-sm font-semibold",
  },
} as const;
