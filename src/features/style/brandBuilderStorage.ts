import { captionStylePresets } from "@/src/features/style/stylePresets";
import type { BrandPreset } from "@/src/features/style/types";
import type { ExportPlatformPreset } from "@/src/features/export/types";

export const brandBuilderStorageKey = "sidekik.brandBuilder.brands";
export const selectedBrandStorageKey = "sidekik.brandBuilder.selectedBrandId";

export const captionPresetOptions = [
  "Momentum Clean",
  "Creator Pop",
  "Bold",
  "Minimal",
  "Podcast",
] as const;

export const exportPlatformOptions: ExportPlatformPreset[] = [
  "TikTok / Reels",
  "YouTube Shorts",
  "LinkedIn",
  "Meta Ads",
  "Landscape YouTube",
];

export const brandVoiceOptions = [
  "Professional",
  "Energetic",
  "Educational",
  "Luxury",
  "Funny",
  "Technical",
] as const;

export type CaptionPresetOption = (typeof captionPresetOptions)[number];
export type BrandVoiceOption = (typeof brandVoiceOptions)[number];

export type StoredBrandProfile = {
  id: string;
  brandName: string;
  logoPlaceholder: string;
  primaryColor: string;
  highlightColor: string;
  captionPreset: CaptionPresetOption;
  exportPreference: ExportPlatformPreset;
  brandVoice: BrandVoiceOption;
  createdAt: string;
  updatedAt: string;
};

const presetByName = {
  Bold: captionStylePresets.find((preset) => preset.id === "bold-opus"),
  "Creator Pop": captionStylePresets.find((preset) => preset.id === "creator-pop"),
  Minimal: captionStylePresets.find((preset) => preset.id === "minimal-pro"),
  "Momentum Clean": captionStylePresets.find((preset) => preset.id === "momentum-clean"),
  Podcast: captionStylePresets.find((preset) => preset.id === "minimal-pro"),
} satisfies Record<CaptionPresetOption, (typeof captionStylePresets)[number] | undefined>;

function canUseLocalStorage() {
  return typeof window !== "undefined";
}

function createBrandId(brandName: string) {
  return `${brandName
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "") || "brand"}-${Date.now()}`;
}

export function createStoredBrandProfile(
  input: Omit<StoredBrandProfile, "createdAt" | "id" | "logoPlaceholder" | "updatedAt"> & {
    logoPlaceholder?: string;
  },
): StoredBrandProfile {
  const now = new Date().toISOString();
  const initials =
    input.logoPlaceholder?.trim() ||
    input.brandName
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join("") ||
    "SK";

  return {
    ...input,
    createdAt: now,
    id: createBrandId(input.brandName),
    logoPlaceholder: initials,
    updatedAt: now,
  };
}

export function loadStoredBrands(): StoredBrandProfile[] {
  if (!canUseLocalStorage()) {
    return [];
  }

  try {
    const rawValue = window.localStorage.getItem(brandBuilderStorageKey);

    if (!rawValue) {
      return [];
    }

    const parsedValue = JSON.parse(rawValue);

    return Array.isArray(parsedValue) ? parsedValue : [];
  } catch {
    return [];
  }
}

export function saveStoredBrands(brands: StoredBrandProfile[]) {
  if (!canUseLocalStorage()) {
    return brands;
  }

  try {
    window.localStorage.setItem(brandBuilderStorageKey, JSON.stringify(brands));
  } catch {
    return loadStoredBrands();
  }

  return brands;
}

export function upsertStoredBrand(
  brand: StoredBrandProfile,
  currentBrands = loadStoredBrands(),
) {
  const nextBrand = {
    ...brand,
    updatedAt: new Date().toISOString(),
  };
  const exists = currentBrands.some((candidate) => candidate.id === brand.id);
  const nextBrands = exists
    ? currentBrands.map((candidate) =>
        candidate.id === brand.id ? nextBrand : candidate,
      )
    : [nextBrand, ...currentBrands];

  return saveStoredBrands(nextBrands);
}

export function saveSelectedBrandId(brandId: string) {
  if (!canUseLocalStorage()) {
    return;
  }

  try {
    window.localStorage.setItem(selectedBrandStorageKey, brandId);
  } catch {
    return;
  }
}

export function loadSelectedBrandId() {
  if (!canUseLocalStorage()) {
    return null;
  }

  try {
    return window.localStorage.getItem(selectedBrandStorageKey);
  } catch {
    return null;
  }
}

export function storedBrandToPreset(brand: StoredBrandProfile): BrandPreset {
  const captionStylePreset =
    presetByName[brand.captionPreset] ?? captionStylePresets[0];

  return {
    brandName: brand.brandName,
    captionStylePreset: {
      ...captionStylePreset,
      highlightColor: brand.highlightColor,
      id: `${brand.id}-style`,
      name: brand.captionPreset,
    },
    exportPreference: brand.exportPreference,
    fontPreference: captionStylePreset.fontFamily.split(",")[0] ?? "Inter",
    highlightColor: brand.highlightColor,
    id: brand.id,
    logoPlaceholder: brand.logoPlaceholder,
    primaryColor: brand.primaryColor,
    safeZonePreference: "mobile-tight",
  };
}

export function loadStoredBrandPresets() {
  return loadStoredBrands().map(storedBrandToPreset);
}
