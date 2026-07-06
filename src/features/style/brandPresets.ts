import { captionStylePresets } from "@/src/features/style/stylePresets";
import type { BrandPreset } from "@/src/features/style/types";

const [
  momentumClean,
  boldOpus,
  creatorPop,
  minimalPro,
  highImpact,
] = captionStylePresets;

export const brandPresets: BrandPreset[] = [
  {
    brandName: "Momentum",
    captionStylePreset: {
      ...momentumClean,
      highlightColor: "#38bdf8",
      textColor: "#ffffff",
    },
    exportPreference: "TikTok / Reels",
    fontPreference: "Inter",
    highlightColor: "#38bdf8",
    id: "momentum",
    logoPlaceholder: "M",
    primaryColor: "#0ea5e9",
    safeZonePreference: "mobile-tight",
  },
  {
    brandName: "Holliday",
    captionStylePreset: {
      ...creatorPop,
      fontFamily: "Trebuchet MS, Arial, sans-serif",
      highlightColor: "#f472b6",
      textColor: "#fff7ed",
    },
    exportPreference: "Square Social",
    fontPreference: "Trebuchet MS",
    highlightColor: "#f472b6",
    id: "holliday",
    logoPlaceholder: "H",
    primaryColor: "#fb7185",
    safeZonePreference: "center-safe",
  },
  {
    brandName: "Whalley",
    captionStylePreset: {
      ...minimalPro,
      fontFamily: "SF Pro Display, Inter, Arial, sans-serif",
      highlightColor: "#a7f3d0",
      textColor: "#f8fafc",
    },
    exportPreference: "YouTube Shorts",
    fontPreference: "SF Pro Display",
    highlightColor: "#a7f3d0",
    id: "whalley",
    logoPlaceholder: "W",
    primaryColor: "#14b8a6",
    safeZonePreference: "standard",
  },
  {
    brandName: "PacBrake",
    captionStylePreset: {
      ...highImpact,
      highlightColor: "#f97316",
      textColor: "#ffffff",
    },
    exportPreference: "Landscape YouTube",
    fontPreference: "Impact",
    highlightColor: "#f97316",
    id: "pacbrake",
    logoPlaceholder: "PB",
    primaryColor: "#ea580c",
    safeZonePreference: "lower-third",
  },
  {
    brandName: "CityPost",
    captionStylePreset: {
      ...boldOpus,
      fontFamily: "Arial Black, Impact, sans-serif",
      highlightColor: "#facc15",
      textColor: "#ffffff",
    },
    exportPreference: "TikTok / Reels",
    fontPreference: "Arial Black",
    highlightColor: "#facc15",
    id: "citypost",
    logoPlaceholder: "CP",
    primaryColor: "#eab308",
    safeZonePreference: "mobile-tight",
  },
  {
    brandName: "Custom",
    captionStylePreset: {
      ...momentumClean,
      id: "custom-brand-style",
      name: "Custom Brand",
    },
    exportPreference: "TikTok / Reels",
    fontPreference: "Inter",
    highlightColor: "#38bdf8",
    id: "custom",
    logoPlaceholder: "+",
    primaryColor: "#71717a",
    safeZonePreference: "standard",
  },
];

export const defaultBrandPreset = brandPresets[0];
