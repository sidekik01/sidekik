"use client";

import { Check } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { ControlSection } from "@/src/components/controls/ControlSection";
import { exportPresets } from "@/src/features/export/exportPresets";
import { useProject } from "@/src/features/project/ProjectContext";
import { brandPresets } from "@/src/features/style/brandPresets";
import {
  loadSelectedBrandId,
  loadStoredBrandPresets,
  saveSelectedBrandId,
} from "@/src/features/style/brandBuilderStorage";
import {
  captionStylePresets,
  type ActiveWordHighlightMode,
  type CaptionPosition,
  type CaptionStyle,
} from "@/src/features/style/captionStyles";

function StyleSwatch({
  color,
  label,
}: Readonly<{
  color: string;
  label: string;
}>) {
  return (
    <div className="flex items-center gap-2 text-[11px] font-medium text-zinc-500">
      <span
        aria-hidden="true"
        className="size-4 rounded-full border border-white/20"
        style={{ backgroundColor: color }}
      />
      {label}
    </div>
  );
}

function updateCaptionStyle(
  currentStyle: CaptionStyle,
  updates: Partial<CaptionStyle>,
) {
  return {
    ...currentStyle,
    ...updates,
    id: `${currentStyle.id}-custom`,
    name: `${currentStyle.name.replace(" Custom", "")} Custom`,
  };
}

export function StyleControls() {
  const {
    selectedBrandPreset,
    selectedCaptionStyle,
    setExportSettings,
    setSelectedBrandPreset,
    setSelectedCaptionStyle,
} = useProject();
  const [storedBrandPresets, setStoredBrandPresets] = useState(brandPresets);
  const combinedBrandPresets = useMemo(
    () => [
      ...storedBrandPresets,
      ...brandPresets.filter(
        (brand) =>
          !storedBrandPresets.some(
            (storedBrand) => storedBrand.id === brand.id,
          ),
      ),
    ],
    [storedBrandPresets],
  );

  useEffect(() => {
    const savedBrands = loadStoredBrandPresets();
    const nextStoredBrandPresets = savedBrands.length ? savedBrands : [];

    setStoredBrandPresets(nextStoredBrandPresets);

    const selectedBrandId = loadSelectedBrandId();
    const selectedBrand = [...nextStoredBrandPresets, ...brandPresets].find(
      (brand) => brand.id === selectedBrandId,
    );

    if (selectedBrand) {
      const preferredExportPreset = exportPresets.find(
        (preset) => preset.platform === selectedBrand.exportPreference,
      );

      setSelectedBrandPreset(selectedBrand);
      setSelectedCaptionStyle({
        ...selectedBrand.captionStylePreset,
        fontFamily: `${selectedBrand.fontPreference}, Inter, Arial, sans-serif`,
        highlightColor: selectedBrand.highlightColor,
      });

      if (preferredExportPreset) {
        setExportSettings((settings) => ({
          ...settings,
          platform: preferredExportPreset.platform,
          presetId: preferredExportPreset.id,
        }));
      }
    }
  }, [setExportSettings, setSelectedBrandPreset, setSelectedCaptionStyle]);

  return (
    <div className="space-y-3">
      <ControlSection title="Brand Presets">
        <div className="grid gap-2">
          {combinedBrandPresets.map((brand) => {
            const isSelected = selectedBrandPreset.id === brand.id;

            return (
              <button
                className={`rounded-2xl border p-3 text-left transition ${
                  isSelected
                    ? "border-violet-300/35 bg-violet-300/10 shadow-lg shadow-violet-950/20"
                    : "border-white/8 bg-zinc-900 hover:border-white/14 hover:bg-zinc-800/80"
                }`}
                key={brand.id}
                onClick={() => {
                  const preferredExportPreset = exportPresets.find(
                    (preset) => preset.platform === brand.exportPreference,
                  );

                  setSelectedBrandPreset(brand);
                  saveSelectedBrandId(brand.id);
                  setSelectedCaptionStyle({
                    ...brand.captionStylePreset,
                    fontFamily: `${brand.fontPreference}, Inter, Arial, sans-serif`,
                    highlightColor: brand.highlightColor,
                  });

                  if (preferredExportPreset) {
                    setExportSettings((settings) => ({
                      ...settings,
                      platform: preferredExportPreset.platform,
                      presetId: preferredExportPreset.id,
                    }));
                  }
                }}
                type="button"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex min-w-0 items-center gap-3">
                    <div
                      className="grid size-9 shrink-0 place-items-center rounded-xl text-xs font-black text-white shadow-lg shadow-black/20"
                      style={{ backgroundColor: brand.primaryColor }}
                    >
                      {brand.logoPlaceholder}
                    </div>
                    <div className="min-w-0">
                      <div className="truncate text-sm font-semibold text-zinc-100">
                        {brand.brandName}
                      </div>
                      <div className="mt-1 truncate text-xs text-zinc-500">
                        {brand.fontPreference} · {brand.exportPreference}
                      </div>
                    </div>
                  </div>
                  {isSelected ? (
                    <span className="grid size-6 place-items-center rounded-full bg-violet-300 text-zinc-950">
                      <Check className="size-3.5" />
                    </span>
                  ) : null}
                </div>
                <div className="mt-3 grid grid-cols-2 gap-2">
                  <StyleSwatch color={brand.primaryColor} label="Primary" />
                  <StyleSwatch color={brand.highlightColor} label="Highlight" />
                </div>
                <div className="mt-2 rounded-xl border border-white/8 bg-black/20 px-3 py-2 text-[11px] font-medium text-zinc-500">
                  Safe zone: {brand.safeZonePreference}
                </div>
              </button>
            );
          })}
        </div>
      </ControlSection>

      <ControlSection title="Caption Presets">
        <div className="grid gap-2">
          {captionStylePresets.map((preset) => {
            const isSelected =
              selectedCaptionStyle.id === preset.id ||
              selectedCaptionStyle.id.startsWith(`${preset.id}-`);

            return (
              <button
                className={`rounded-2xl border p-3 text-left transition ${
                  isSelected
                    ? "border-sky-300/35 bg-sky-300/10 shadow-lg shadow-sky-950/20"
                    : "border-white/8 bg-zinc-900 hover:border-white/14 hover:bg-zinc-800/80"
                }`}
                key={preset.id}
                onClick={() => setSelectedCaptionStyle(preset)}
                type="button"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-sm font-semibold text-zinc-100">
                      {preset.name}
                    </div>
                    <div className="mt-1 text-xs text-zinc-500">
                      {preset.textTransform === "uppercase"
                        ? "Uppercase"
                        : "Natural case"}{" "}
                      · {preset.position}
                    </div>
                  </div>
                  {isSelected ? (
                    <span className="grid size-6 place-items-center rounded-full bg-sky-300 text-zinc-950">
                      <Check className="size-3.5" />
                    </span>
                  ) : null}
                </div>
                <div
                  className={`mt-3 rounded-xl px-3 py-2 text-center font-black leading-tight ${
                    preset.backgroundBox ? "bg-black/45" : "bg-transparent"
                  }`}
                  style={{
                    color: preset.textColor,
                    fontFamily: preset.fontFamily,
                    fontSize: Math.max(preset.fontSize * 0.42, 13),
                    textShadow: `0 2px 0 rgba(0,0,0,.9), 0 0 ${
                      preset.shadowIntensity / 6
                    }px rgba(0,0,0,.85)`,
                    textTransform: preset.textTransform,
                  }}
                >
                  <span>Caption</span>{" "}
                  <span style={{ color: preset.highlightColor }}>Style</span>
                </div>
                <div className="mt-3 grid grid-cols-2 gap-2">
                  <StyleSwatch color={preset.textColor} label="Text" />
                  <StyleSwatch color={preset.highlightColor} label="Highlight" />
                </div>
              </button>
            );
          })}
        </div>
      </ControlSection>

      <ControlSection title="Manual Controls">
        <div className="space-y-4">
          <label className="block">
            <div className="mb-2 flex items-center justify-between text-xs">
              <span className="font-medium text-zinc-400">Font size</span>
              <span className="font-mono text-zinc-500">
                {selectedCaptionStyle.fontSize}px
              </span>
            </div>
            <input
              className="w-full accent-sky-400"
              max={52}
              min={24}
              onChange={(event) =>
                setSelectedCaptionStyle((style) =>
                  updateCaptionStyle(style, {
                    fontSize: Number(event.target.value),
                  }),
                )
              }
              type="range"
              value={selectedCaptionStyle.fontSize}
            />
          </label>

          <div>
            <div className="mb-2 text-xs font-medium text-zinc-400">
              Position
            </div>
            <div className="grid grid-cols-3 gap-2">
              {(["top", "center", "bottom"] as CaptionPosition[]).map(
                (position) => (
                  <button
                    className={`rounded-xl border px-3 py-2 text-xs font-semibold capitalize transition ${
                      selectedCaptionStyle.position === position
                        ? "border-sky-300/40 bg-sky-300/10 text-sky-100"
                        : "border-white/10 bg-zinc-900 text-zinc-400 hover:bg-zinc-800"
                    }`}
                    key={position}
                    onClick={() =>
                      setSelectedCaptionStyle((style) =>
                        updateCaptionStyle(style, { position }),
                      )
                    }
                    type="button"
                  >
                    {position}
                  </button>
                ),
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <label className="rounded-2xl border border-white/8 bg-white/[0.035] p-3">
              <div className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
                Text color
              </div>
              <input
                className="h-9 w-full cursor-pointer rounded-xl border border-white/10 bg-transparent"
                onChange={(event) =>
                  setSelectedCaptionStyle((style) =>
                    updateCaptionStyle(style, {
                      textColor: event.target.value,
                    }),
                  )
                }
                type="color"
                value={selectedCaptionStyle.textColor}
              />
            </label>
            <label className="rounded-2xl border border-white/8 bg-white/[0.035] p-3">
              <div className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
                Highlight
              </div>
              <input
                className="h-9 w-full cursor-pointer rounded-xl border border-white/10 bg-transparent"
                onChange={(event) =>
                  setSelectedCaptionStyle((style) =>
                    updateCaptionStyle(style, {
                      highlightColor: event.target.value,
                    }),
                  )
                }
                type="color"
                value={selectedCaptionStyle.highlightColor}
              />
            </label>
          </div>

          <label className="block">
            <div className="mb-2 flex items-center justify-between text-xs">
              <span className="font-medium text-zinc-400">
                Shadow intensity
              </span>
              <span className="font-mono text-zinc-500">
                {selectedCaptionStyle.shadowIntensity}%
              </span>
            </div>
            <input
              className="w-full accent-sky-400"
              max={100}
              min={0}
              onChange={(event) =>
                setSelectedCaptionStyle((style) =>
                  updateCaptionStyle(style, {
                    shadowIntensity: Number(event.target.value),
                  }),
                )
              }
              type="range"
              value={selectedCaptionStyle.shadowIntensity}
            />
          </label>

          <div>
            <div className="mb-2 flex items-center justify-between text-xs">
              <span className="font-medium text-zinc-400">
                Active Word Highlight
              </span>
              <span className="font-mono text-zinc-500">
                {selectedCaptionStyle.activeWordHighlight ? "On" : "Off"}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {[true, false].map((isEnabled) => (
                <button
                  className={`rounded-xl border px-3 py-2 text-xs font-semibold transition ${
                    selectedCaptionStyle.activeWordHighlight === isEnabled
                      ? "border-sky-300/40 bg-sky-300/10 text-sky-100"
                      : "border-white/10 bg-zinc-900 text-zinc-400 hover:bg-zinc-800"
                  }`}
                  key={String(isEnabled)}
                  onClick={() =>
                    setSelectedCaptionStyle((style) =>
                      updateCaptionStyle(style, {
                        activeWordHighlight: isEnabled,
                      }),
                    )
                  }
                  type="button"
                >
                  {isEnabled ? "On" : "Off"}
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="mb-2 text-xs font-medium text-zinc-400">
              Highlight mode
            </div>
            <div className="grid gap-2">
              {(
                [
                  ["color", "Color only"],
                  ["background-pill", "Background pill"],
                  ["scale-pop", "Scale pop placeholder"],
                ] as [ActiveWordHighlightMode, string][]
              ).map(([mode, label]) => (
                <button
                  className={`rounded-xl border px-3 py-2 text-left text-xs font-semibold transition ${
                    selectedCaptionStyle.activeWordHighlightMode === mode
                      ? "border-sky-300/40 bg-sky-300/10 text-sky-100"
                      : "border-white/10 bg-zinc-900 text-zinc-400 hover:bg-zinc-800"
                  }`}
                  key={mode}
                  onClick={() =>
                    setSelectedCaptionStyle((style) =>
                      updateCaptionStyle(style, {
                        activeWordHighlightMode: mode,
                      }),
                    )
                  }
                  type="button"
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </ControlSection>
    </div>
  );
}
