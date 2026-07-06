"use client";

import { useEffect, useMemo, useState } from "react";
import { Check, Edit3, ImagePlus, Plus, Save } from "lucide-react";
import { AppShell } from "@/src/components/app/AppShell";
import { SectionTitle, SurfaceCard } from "@/src/components/app/AppCards";
import { Button, Input, Modal, Select } from "@/src/components/ui";
import { exportPresets } from "@/src/features/export/exportPresets";
import { brandPresets } from "@/src/features/style/brandPresets";
import {
  brandVoiceOptions,
  captionPresetOptions,
  createStoredBrandProfile,
  exportPlatformOptions,
  loadStoredBrands,
  saveSelectedBrandId,
  storedBrandToPreset,
  upsertStoredBrand,
  type BrandVoiceOption,
  type CaptionPresetOption,
  type StoredBrandProfile,
} from "@/src/features/style/brandBuilderStorage";
import type { ExportPlatformPreset } from "@/src/features/export/types";

type BrandFormState = {
  brandName: string;
  primaryColor: string;
  highlightColor: string;
  captionPreset: CaptionPresetOption;
  exportPreference: ExportPlatformPreset;
  brandVoice: BrandVoiceOption;
};

const initialFormState: BrandFormState = {
  brandName: "",
  brandVoice: "Professional",
  captionPreset: "Momentum Clean",
  exportPreference: "TikTok / Reels",
  highlightColor: "#38bdf8",
  primaryColor: "#0ea5e9",
};

function getExportPresetLabel(platform: ExportPlatformPreset) {
  const preset = exportPresets.find((candidate) => candidate.platform === platform);

  return preset ? `${preset.platform} · ${preset.recommendedResolution}` : platform;
}

export function BrandBuilderPage() {
  const [storedBrands, setStoredBrands] = useState<StoredBrandProfile[]>([]);
  const [formState, setFormState] = useState<BrandFormState>(initialFormState);
  const [editingBrandId, setEditingBrandId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBrandId, setSelectedBrandId] = useState<string | null>(null);
  const [storageMessage, setStorageMessage] = useState<string | null>(null);
  const allBrands = useMemo(
    () => [
      ...storedBrands.map(storedBrandToPreset),
      ...brandPresets.filter(
        (preset) =>
          !storedBrands.some((storedBrand) => storedBrand.id === preset.id),
      ),
    ],
    [storedBrands],
  );
  const editingBrand = storedBrands.find((brand) => brand.id === editingBrandId);

  useEffect(() => {
    setStoredBrands(loadStoredBrands());
  }, []);

  function openNewBrandModal() {
    setEditingBrandId(null);
    setFormState(initialFormState);
    setIsModalOpen(true);
  }

  function openEditBrandModal(brandId: string) {
    const storedBrand = storedBrands.find((brand) => brand.id === brandId);

    if (!storedBrand) {
      return;
    }

    setEditingBrandId(storedBrand.id);
    setFormState({
      brandName: storedBrand.brandName,
      brandVoice: storedBrand.brandVoice,
      captionPreset: storedBrand.captionPreset,
      exportPreference: storedBrand.exportPreference,
      highlightColor: storedBrand.highlightColor,
      primaryColor: storedBrand.primaryColor,
    });
    setIsModalOpen(true);
  }

  function handleSaveBrand() {
    if (!formState.brandName.trim()) {
      return;
    }

    const nextBrand = editingBrand
      ? {
          ...editingBrand,
          ...formState,
          logoPlaceholder: editingBrand.logoPlaceholder,
        }
      : createStoredBrandProfile(formState);
    const nextBrands = upsertStoredBrand(nextBrand, storedBrands);

    setStoredBrands(nextBrands);
    setSelectedBrandId(nextBrand.id);
    saveSelectedBrandId(nextBrand.id);
    setStorageMessage(
      nextBrands.some((brand) => brand.id === nextBrand.id)
        ? "Brand saved locally."
        : "Brand could not be saved because localStorage is unavailable.",
    );
    setIsModalOpen(false);
  }

  function handleSelectBrand(brandId: string) {
    setSelectedBrandId(brandId);
    saveSelectedBrandId(brandId);
  }

  return (
    <AppShell activePath="/brands" eyebrow="Brand Builder" title="Brands">
      <div className="mx-auto max-w-7xl space-y-5">
        <SurfaceCard className="bg-[linear-gradient(135deg,rgba(168,85,247,0.14),rgba(24,24,27,0.92)_50%,rgba(0,0,0,0.84))]">
          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-3xl font-black text-white">
                Build your brand once.
              </h2>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-400">
                Create reusable brand profiles for caption presets, highlight
                colors, export platforms, and voice. Saved brands are stored
                locally for now.
              </p>
            </div>
            <Button className="rounded-2xl" onClick={openNewBrandModal} size="lg" variant="primary">
              <Plus className="size-4" />
              New Brand
            </Button>
          </div>
        </SurfaceCard>

        <div className="grid gap-4 lg:grid-cols-3">
          {allBrands.map((brand) => {
            const isStoredBrand = storedBrands.some(
              (storedBrand) => storedBrand.id === brand.id,
            );
            const isSelected = selectedBrandId === brand.id;

            return (
              <SurfaceCard className="p-5 transition duration-200 hover:-translate-y-0.5" key={brand.id}>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex min-w-0 items-center gap-3">
                    <div
                      className="grid size-14 shrink-0 place-items-center rounded-2xl border border-white/10 text-sm font-black text-white shadow-lg shadow-black/20"
                      style={{ backgroundColor: brand.primaryColor }}
                    >
                      {brand.logoPlaceholder}
                    </div>
                    <div className="min-w-0">
                      <h2 className="truncate text-lg font-black text-white">
                        {brand.brandName}
                      </h2>
                      <p className="mt-1 text-sm text-zinc-500">
                        {brand.exportPreference}
                      </p>
                    </div>
                  </div>
                  {isSelected ? (
                    <span className="grid size-7 place-items-center rounded-full bg-emerald-300 text-zinc-950">
                      <Check className="size-4" />
                    </span>
                  ) : null}
                </div>

                <div className="mt-5 grid grid-cols-2 gap-2">
                  <div className="rounded-2xl border border-white/8 bg-white/[0.035] p-3">
                    <div className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
                      Primary
                    </div>
                    <div className="mt-2 flex items-center gap-2">
                      <span
                        className="size-5 rounded-full border border-white/20"
                        style={{ backgroundColor: brand.primaryColor }}
                      />
                      <span className="font-mono text-xs text-zinc-300">
                        {brand.primaryColor}
                      </span>
                    </div>
                  </div>
                  <div className="rounded-2xl border border-white/8 bg-white/[0.035] p-3">
                    <div className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
                      Highlight
                    </div>
                    <div className="mt-2 flex items-center gap-2">
                      <span
                        className="size-5 rounded-full border border-white/20"
                        style={{ backgroundColor: brand.highlightColor }}
                      />
                      <span className="font-mono text-xs text-zinc-300">
                        {brand.highlightColor}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-3 grid gap-2 text-sm">
                  <div className="rounded-2xl border border-white/8 bg-white/[0.035] px-4 py-3">
                    <span className="text-zinc-500">Default Caption Preset</span>
                    <div className="mt-1 font-bold text-zinc-100">
                      {brand.captionStylePreset.name}
                    </div>
                  </div>
                  <div className="rounded-2xl border border-white/8 bg-white/[0.035] px-4 py-3">
                    <span className="text-zinc-500">Default Platform</span>
                    <div className="mt-1 font-bold text-zinc-100">
                      {brand.exportPreference}
                    </div>
                  </div>
                </div>

                <div className="mt-5 grid grid-cols-2 gap-2">
                  <Button
                    className="rounded-2xl"
                    disabled={!isStoredBrand}
                    onClick={() => openEditBrandModal(brand.id)}
                    type="button"
                    variant="ghost"
                  >
                    <Edit3 className="size-4" />
                    Edit
                  </Button>
                  <Button
                    className="rounded-2xl"
                    onClick={() => handleSelectBrand(brand.id)}
                    type="button"
                    variant={isSelected ? "secondary" : "primary"}
                  >
                    Use Brand
                  </Button>
                </div>
              </SurfaceCard>
            );
          })}
        </div>

        {storageMessage ? (
          <SurfaceCard className="border-amber-300/20 bg-amber-300/10">
            <p className="text-sm font-semibold text-amber-100">
              {storageMessage}
            </p>
          </SurfaceCard>
        ) : null}

        <SurfaceCard>
          <SectionTitle>New Brand Flow</SectionTitle>
          <div className="grid gap-3 md:grid-cols-6">
            {[
              "Brand name",
              "Logo placeholder",
              "Colors",
              "Caption preset",
              "Export platform",
              "Brand voice",
            ].map((step) => (
              <div
                className="rounded-2xl border border-white/8 bg-zinc-900/80 p-3 text-xs font-bold text-zinc-300"
                key={step}
              >
                {step}
              </div>
            ))}
          </div>
        </SurfaceCard>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingBrandId ? "Edit Brand" : "New Brand"}
      >
        <div className="space-y-4">
          <label className="block">
            <span className="mb-2 block text-xs font-semibold text-zinc-400">
              Brand name
            </span>
            <Input
              onChange={(event) =>
                setFormState((state) => ({
                  ...state,
                  brandName: event.target.value,
                }))
              }
              placeholder="Acme Studio"
              value={formState.brandName}
            />
          </label>

          <div className="rounded-2xl border border-dashed border-white/12 bg-white/[0.035] p-4">
            <div className="flex items-center gap-3">
              <div className="grid size-12 place-items-center rounded-2xl border border-white/10 bg-zinc-900 text-zinc-500">
                <ImagePlus className="size-5" />
              </div>
              <div>
                <div className="text-sm font-semibold text-zinc-100">
                  Upload logo placeholder
                </div>
                <div className="mt-1 text-xs text-zinc-500">
                  Logo uploads will connect later. Initials are used for now.
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <label className="block">
              <span className="mb-2 block text-xs font-semibold text-zinc-400">
                Primary color
              </span>
              <Input
                className="h-11 p-1"
                onChange={(event) =>
                  setFormState((state) => ({
                    ...state,
                    primaryColor: event.target.value,
                  }))
                }
                type="color"
                value={formState.primaryColor}
              />
            </label>
            <label className="block">
              <span className="mb-2 block text-xs font-semibold text-zinc-400">
                Highlight color
              </span>
              <Input
                className="h-11 p-1"
                onChange={(event) =>
                  setFormState((state) => ({
                    ...state,
                    highlightColor: event.target.value,
                  }))
                }
                type="color"
                value={formState.highlightColor}
              />
            </label>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <label className="block">
              <span className="mb-2 block text-xs font-semibold text-zinc-400">
                Default caption preset
              </span>
              <Select
                onChange={(event) =>
                  setFormState((state) => ({
                    ...state,
                    captionPreset: event.target.value as CaptionPresetOption,
                  }))
                }
                value={formState.captionPreset}
              >
                {captionPresetOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </Select>
            </label>
            <label className="block">
              <span className="mb-2 block text-xs font-semibold text-zinc-400">
                Default export platform
              </span>
              <Select
                onChange={(event) =>
                  setFormState((state) => ({
                    ...state,
                    exportPreference: event.target.value as ExportPlatformPreset,
                  }))
                }
                value={formState.exportPreference}
              >
                {exportPlatformOptions.map((option) => (
                  <option key={option} value={option}>
                    {getExportPresetLabel(option)}
                  </option>
                ))}
              </Select>
            </label>
          </div>

          <label className="block">
            <span className="mb-2 block text-xs font-semibold text-zinc-400">
              Brand voice
            </span>
            <Select
              onChange={(event) =>
                setFormState((state) => ({
                  ...state,
                  brandVoice: event.target.value as BrandVoiceOption,
                }))
              }
              value={formState.brandVoice}
            >
              {brandVoiceOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </Select>
          </label>

          <div className="rounded-2xl border border-white/8 bg-white/[0.035] p-3">
            <div className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
              Preview
            </div>
            <div
              className="rounded-2xl px-4 py-4 text-center text-xl font-black text-white"
              style={{ backgroundColor: formState.primaryColor }}
            >
              {formState.brandName || "Brand Name"}{" "}
              <span style={{ color: formState.highlightColor }}>Captions</span>
            </div>
          </div>

          <Button
            className="w-full rounded-2xl"
            disabled={!formState.brandName.trim()}
            onClick={handleSaveBrand}
            size="lg"
            type="button"
            variant="primary"
          >
            <Save className="size-4" />
            Save Brand
          </Button>
        </div>
      </Modal>
    </AppShell>
  );
}
