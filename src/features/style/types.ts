export type CaptionPosition = "top" | "center" | "bottom";
export type CaptionTextTransform = "none" | "uppercase";
export type ActiveWordHighlightMode =
  | "color"
  | "background-pill"
  | "scale-pop";

export type CaptionStyle = {
  id: string;
  name: string;
  fontFamily: string;
  fontSize: number;
  textColor: string;
  highlightColor: string;
  shadowIntensity: number;
  backgroundBox: boolean;
  textTransform: CaptionTextTransform;
  position: CaptionPosition;
  activeWordHighlight: boolean;
  activeWordHighlightMode: ActiveWordHighlightMode;
};

export type BrandPreset = {
  id: string;
  brandName: string;
  primaryColor: string;
  highlightColor: string;
  fontPreference: string;
  captionStylePreset: CaptionStyle;
  logoPlaceholder: string;
  safeZonePreference: "standard" | "mobile-tight" | "lower-third" | "center-safe";
  exportPreference: string;
};
