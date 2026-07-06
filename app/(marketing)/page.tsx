import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  Brain,
  Captions,
  Clapperboard,
  Layers3,
  Palette,
  Play,
  Sparkles,
  Upload,
} from "lucide-react";

const navItems = [
  { href: "#features", label: "Features" },
  { href: "#pricing", label: "Pricing" },
  { href: "#demo", label: "Demo" },
];

const creatorTypes = [
  "Short-form creators",
  "Video editors",
  "Agency teams",
  "Brand operators",
];

const features = [
  {
    description:
      "Upload an edit and get project metadata, format guidance, and export readiness in one calm workspace.",
    icon: Upload,
    title: "Analyze every upload",
  },
  {
    description:
      "Generate caption blocks, review transcript quality, and keep timing editable for production work.",
    icon: Captions,
    title: "Caption with control",
  },
  {
    description:
      "Apply brand presets, active word highlights, safe zones, and platform-aware styles before export.",
    icon: Palette,
    title: "Style for the platform",
  },
  {
    description:
      "Use deterministic creative checks for pacing, readability, CTA clarity, and caption performance.",
    icon: Brain,
    title: "Review like a director",
  },
];

const faqs = [
  {
    answer:
      "Sidekik is built for creators and teams who already edit videos and want captions, review, style, and publishing prep in one place.",
    question: "Who is Sidekik for?",
  },
  {
    answer:
      "The app already supports upload, analysis, captions, style presets, transcript editing, timeline work, and rendering architecture.",
    question: "Is this only a caption tool?",
  },
  {
    answer:
      "No. Sidekik is designed to help you finish stronger videos faster, with creator-focused defaults and review workflows.",
    question: "Does Sidekik replace my editor?",
  },
  {
    answer:
      "Start free will open the Sidekik studio. Team and agency plans are planned as the workspace layer grows.",
    question: "Can I try it now?",
  },
];

function SectionLabel({ children }: Readonly<{ children: string }>) {
  return (
    <div className="inline-flex items-center rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs font-semibold text-sky-100">
      {children}
    </div>
  );
}

function ProductScreenshot() {
  return (
    <section
      className="mx-auto w-full max-w-7xl px-5 py-10 sm:px-8 lg:px-10"
      id="demo"
    >
      <div className="overflow-hidden rounded-[32px] border border-white/10 bg-zinc-950/80 shadow-2xl shadow-black/40">
        <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
          <div className="flex items-center gap-2">
            <span className="size-3 rounded-full bg-red-400" />
            <span className="size-3 rounded-full bg-amber-300" />
            <span className="size-3 rounded-full bg-emerald-300" />
          </div>
          <div className="text-xs font-medium text-zinc-500">
            Sidekik Studio Preview
          </div>
        </div>

        <div className="grid gap-4 p-4 lg:grid-cols-[220px_minmax(0,1fr)_320px]">
          <div className="hidden rounded-3xl border border-white/8 bg-white/[0.035] p-4 lg:block">
            <div className="mb-4 h-8 w-24 rounded-xl bg-white/10" />
            {["Analyze", "Captions", "Style", "Review", "Export"].map(
              (item) => (
                <div
                  className="mb-2 rounded-2xl border border-white/8 bg-zinc-900/80 px-3 py-3 text-sm text-zinc-300"
                  key={item}
                >
                  {item}
                </div>
              ),
            )}
          </div>

          <div className="rounded-3xl border border-sky-300/15 bg-[linear-gradient(145deg,rgba(14,165,233,0.14),rgba(24,24,27,0.96)_45%,rgba(0,0,0,0.92))] p-4">
            <div className="aspect-video overflow-hidden rounded-[24px] border border-white/10 bg-black shadow-inner shadow-black">
              <div className="flex h-full items-center justify-center">
                <div className="w-3/5 rounded-3xl border border-white/10 bg-white/[0.04] p-6 text-center">
                  <Clapperboard className="mx-auto mb-4 size-10 text-sky-200" />
                  <div className="text-xl font-bold text-white">
                    READY TO PUBLISH
                  </div>
                  <div className="mt-3 inline-flex rounded-full bg-sky-300 px-3 py-1 text-xs font-black text-zinc-950">
                    CONFIDENCE
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              {["Caption blocks", "Safe zones", "Render queue"].map((item) => (
                <div
                  className="rounded-2xl border border-white/8 bg-black/20 px-4 py-3 text-sm font-medium text-zinc-300"
                  key={item}
                >
                  {item}
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-white/8 bg-white/[0.035] p-4">
            <div className="mb-4 text-xs font-semibold uppercase text-zinc-500">
              Director Review
            </div>
            {[
              ["Creative Score", "84"],
              ["Reading Speed", "Good"],
              ["Caption Fit", "Ready"],
            ].map(([label, value]) => (
              <div
                className="mb-3 flex items-center justify-between rounded-2xl border border-white/8 bg-zinc-900/80 px-4 py-3"
                key={label}
              >
                <span className="text-sm text-zinc-400">{label}</span>
                <span className="text-sm font-bold text-zinc-50">{value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default function MarketingHomePage() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#08090c] text-zinc-50">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_18%_10%,rgba(56,189,248,0.15),transparent_30%),radial-gradient(circle_at_82%_4%,rgba(168,85,247,0.12),transparent_28%),linear-gradient(145deg,rgba(255,255,255,0.06),transparent_36%)]" />

      <header className="relative z-10 mx-auto flex w-full max-w-7xl items-center justify-between px-5 py-5 sm:px-8 lg:px-10">
        <Link className="flex items-center" href="/">
          <Image
            alt="sidekik"
            className="h-9 w-auto"
            height={40}
            priority
            src="/images/sidekik-logo-white.png"
            width={154}
          />
        </Link>

        <nav className="hidden items-center gap-8 text-sm font-medium text-zinc-400 md:flex">
          {navItems.map((item) => (
            <a className="transition hover:text-white" href={item.href} key={item.href}>
              {item.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Link
            className="hidden rounded-full px-4 py-2 text-sm font-semibold text-zinc-300 transition hover:text-white sm:inline-flex"
            href="/dashboard"
          >
            Sign In
          </Link>
          <Link
            className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-bold text-zinc-950 shadow-lg shadow-black/25 transition hover:bg-sky-100"
            href="/dashboard"
          >
            Get Started
            <ArrowRight className="size-4" />
          </Link>
        </div>
      </header>

      <section className="relative z-10 mx-auto grid min-h-[calc(100vh-88px)] w-full max-w-7xl items-center gap-12 px-5 pb-16 pt-12 sm:px-8 lg:grid-cols-[minmax(0,1fr)_460px] lg:px-10">
        <div>
          <SectionLabel>AI post-production workspace</SectionLabel>
          <h1 className="mt-8 max-w-4xl text-5xl font-black leading-[1.02] text-white sm:text-7xl lg:text-8xl">
            Every great video deserves a Sidekik.
          </h1>
          <p className="mt-7 max-w-2xl text-xl font-semibold leading-8 text-sky-100">
            The creative sidekick behind every great video.
          </p>
          <p className="mt-5 max-w-2xl whitespace-pre-line text-lg leading-8 text-zinc-400">
            {`Upload your edit.
Sidekik reviews it, captions it, styles it, and helps you publish with confidence.`}
          </p>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Link
              className="inline-flex items-center justify-center gap-2 rounded-full bg-sky-300 px-6 py-3 text-sm font-black text-zinc-950 shadow-xl shadow-sky-950/40 transition hover:bg-sky-200"
              href="/dashboard"
            >
              Start Free
              <ArrowRight className="size-4" />
            </Link>
            <a
              className="inline-flex items-center justify-center gap-2 rounded-full border border-white/12 bg-white/[0.04] px-6 py-3 text-sm font-bold text-zinc-100 transition hover:bg-white/[0.08]"
              href="#demo"
            >
              <Play className="size-4" />
              Watch Demo
            </a>
          </div>
        </div>

        <div className="relative">
          <div className="absolute inset-8 rounded-full bg-sky-400/20 blur-3xl" />
          <div className="relative rounded-[36px] border border-white/10 bg-zinc-950/85 p-4 shadow-2xl shadow-black/50">
            <div className="rounded-[28px] border border-white/10 bg-black p-3">
              <div className="aspect-[9/16] rounded-[22px] bg-[linear-gradient(180deg,rgba(56,189,248,0.24),rgba(24,24,27,0.96)_42%,rgba(0,0,0,1))] p-5">
                <div className="flex justify-between text-xs font-semibold text-zinc-400">
                  <span>Vertical Reel</span>
                  <span>00:24</span>
                </div>
                <div className="flex h-full items-end pb-16">
                  <div className="w-full text-center">
                    <div className="text-3xl font-black leading-none text-white">
                      MAKE IT
                    </div>
                    <div className="mt-2 inline-flex rounded-xl bg-sky-300 px-3 py-1 text-3xl font-black leading-none text-zinc-950">
                      SHIP
                    </div>
                    <div className="mt-5 rounded-full border border-white/10 bg-white/[0.06] px-4 py-2 text-xs font-bold text-zinc-200">
                      Captions styled for mobile
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <ProductScreenshot />

      <section className="relative z-10 mx-auto w-full max-w-7xl px-5 py-20 sm:px-8 lg:px-10">
        <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <SectionLabel>Built For Creators</SectionLabel>
            <h2 className="mt-5 text-4xl font-black leading-tight text-white sm:text-5xl">
              Serious tools for people who publish fast.
            </h2>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {creatorTypes.map((type) => (
              <div
                className="rounded-3xl border border-white/10 bg-white/[0.035] p-5 text-lg font-bold text-zinc-100"
                key={type}
              >
                <BadgeCheck className="mb-5 size-6 text-emerald-200" />
                {type}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section
        className="relative z-10 mx-auto w-full max-w-7xl px-5 py-20 sm:px-8 lg:px-10"
        id="features"
      >
        <div className="max-w-3xl">
          <SectionLabel>Features</SectionLabel>
          <h2 className="mt-5 text-4xl font-black leading-tight text-white sm:text-5xl">
            The workflow after the edit, finally in one place.
          </h2>
        </div>
        <div className="mt-10 grid gap-4 md:grid-cols-2">
          {features.map((feature) => (
            <div
              className="rounded-[28px] border border-white/10 bg-white/[0.035] p-6"
              key={feature.title}
            >
              <feature.icon className="mb-8 size-8 text-sky-200" />
              <h3 className="text-2xl font-black text-white">{feature.title}</h3>
              <p className="mt-4 leading-7 text-zinc-400">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="relative z-10 mx-auto w-full max-w-7xl px-5 py-20 sm:px-8 lg:px-10">
        <div className="rounded-[32px] border border-white/10 bg-[linear-gradient(135deg,rgba(255,255,255,0.08),rgba(255,255,255,0.025))] p-6 sm:p-10">
          <div className="grid gap-10 lg:grid-cols-2">
            <div>
              <SectionLabel>Brand Builder</SectionLabel>
              <h2 className="mt-5 text-4xl font-black leading-tight text-white">
                Keep every client on brand without rebuilding styles.
              </h2>
              <p className="mt-5 leading-7 text-zinc-400">
                Sidekik is built around reusable brand presets, highlight colors,
                safe zones, and export preferences so teams can move quickly
                without losing consistency.
              </p>
            </div>
            <div className="grid gap-3">
              {["Momentum", "Holliday", "Whalley", "PacBrake"].map((brand) => (
                <div
                  className="flex items-center justify-between rounded-2xl border border-white/10 bg-zinc-950/70 px-4 py-4"
                  key={brand}
                >
                  <span className="font-bold text-zinc-100">{brand}</span>
                  <span className="rounded-full bg-sky-300/10 px-3 py-1 text-xs font-bold text-sky-100">
                    Preset ready
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="relative z-10 mx-auto w-full max-w-7xl px-5 py-20 sm:px-8 lg:px-10">
        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <SectionLabel>Meet Sidekik</SectionLabel>
            <h2 className="mt-5 text-4xl font-black leading-tight text-white">
              A calm creative review layer for every video.
            </h2>
          </div>
          <div className="rounded-[28px] border border-white/10 bg-zinc-950/80 p-6">
            {[
              "Reviews captions for readability.",
              "Suggests highlights from deterministic rules.",
              "Checks platform fit before export.",
              "Helps creators publish with confidence.",
            ].map((item) => (
              <div className="flex gap-3 border-b border-white/8 py-4 last:border-b-0" key={item}>
                <Sparkles className="mt-1 size-5 shrink-0 text-sky-200" />
                <p className="font-medium leading-7 text-zinc-300">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section
        className="relative z-10 mx-auto w-full max-w-7xl px-5 py-20 sm:px-8 lg:px-10"
        id="pricing"
      >
        <div className="grid gap-5 lg:grid-cols-3">
          <div className="lg:col-span-1">
            <SectionLabel>Pricing Preview</SectionLabel>
            <h2 className="mt-5 text-4xl font-black leading-tight text-white">
              Start simple. Grow into a studio.
            </h2>
          </div>
          {[
            ["Creator", "Free", "Upload, analyze, caption, and preview."],
            ["Studio", "Soon", "Brand presets, workspaces, and team flow."],
          ].map(([name, price, detail]) => (
            <div
              className="rounded-[28px] border border-white/10 bg-white/[0.035] p-6"
              key={name}
            >
              <Layers3 className="mb-8 size-7 text-sky-200" />
              <h3 className="text-2xl font-black text-white">{name}</h3>
              <div className="mt-4 text-4xl font-black text-white">{price}</div>
              <p className="mt-4 leading-7 text-zinc-400">{detail}</p>
              <Link
                className="mt-8 inline-flex w-full items-center justify-center rounded-full bg-white px-5 py-3 text-sm font-black text-zinc-950 transition hover:bg-sky-100"
                href="/dashboard"
              >
                Start Free
              </Link>
            </div>
          ))}
        </div>
      </section>

      <section className="relative z-10 mx-auto w-full max-w-5xl px-5 py-20 sm:px-8">
        <div className="text-center">
          <SectionLabel>FAQ</SectionLabel>
          <h2 className="mt-5 text-4xl font-black text-white">
            Questions before you bring Sidekik in?
          </h2>
        </div>
        <div className="mt-10 grid gap-3">
          {faqs.map((faq) => (
            <div
              className="rounded-3xl border border-white/10 bg-white/[0.035] p-5"
              key={faq.question}
            >
              <h3 className="font-black text-white">{faq.question}</h3>
              <p className="mt-3 leading-7 text-zinc-400">{faq.answer}</p>
            </div>
          ))}
        </div>
      </section>

      <footer className="relative z-10 border-t border-white/10 px-5 py-10 sm:px-8">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <Image
            alt="sidekik"
            className="h-8 w-auto"
            height={36}
            src="/images/sidekik-logo-white.png"
            width={139}
          />
          <div className="flex flex-wrap gap-4 text-sm font-medium text-zinc-500">
            <a className="hover:text-white" href="#features">
              Features
            </a>
            <a className="hover:text-white" href="#pricing">
              Pricing
            </a>
            <Link className="hover:text-white" href="/dashboard">
              Sign In
            </Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
