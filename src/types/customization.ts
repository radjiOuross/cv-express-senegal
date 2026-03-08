export interface CVCustomization {
  colors: {
    primary: string;
    secondary: string;
  };
  font: {
    display: string;
    body: string;
    label: string;
  };
  sectionOrder: SectionItem[];
  density: number; // 1-5
  photoStyle: "circle" | "rounded" | "hexagon" | "none";
  photoBorder: boolean;
  skillStyle: "bars" | "dots" | "pills" | "percent" | "text";
}

export interface SectionItem {
  id: string;
  label: string;
  visible: boolean;
}

export const COLOR_PRESETS = [
  { name: "Sénégal", primary: "#00A651", secondary: "#E8B84B" },
  { name: "Ocean", primary: "#1B3A6B", secondary: "#4FC3F7" },
  { name: "Sunset", primary: "#C62828", secondary: "#FF8F00" },
  { name: "Forest", primary: "#2D6A4F", secondary: "#95D5B2" },
  { name: "Royal", primary: "#4A0080", secondary: "#C9A84C" },
  { name: "Coral", primary: "#E94560", secondary: "#FF6B6B" },
  { name: "Slate", primary: "#37474F", secondary: "#78909C" },
  { name: "Rose", primary: "#880E4F", secondary: "#F48FB1" },
  { name: "Earth", primary: "#4E342E", secondary: "#A1887F" },
  { name: "Mono", primary: "#212121", secondary: "#757575" },
] as const;

export const FONT_PRESETS = [
  { label: "Classique", display: "Playfair Display", body: "DM Sans" },
  { label: "Moderne", display: "Outfit", body: "Inter" },
  { label: "Élégant", display: "Cormorant Garamond", body: "Lato" },
  { label: "Corporate", display: "Georgia", body: "Arial" },
  { label: "Tech", display: "Space Grotesk", body: "Roboto Mono" },
  { label: "Doux", display: "Nunito", body: "Open Sans" },
  { label: "Editorial", display: "Libre Baskerville", body: "Source Sans 3" },
  { label: "Minimal", display: "DM Sans", body: "DM Sans" },
] as const;

export const DEFAULT_SECTIONS: SectionItem[] = [
  { id: "summary", label: "Profil professionnel", visible: true },
  { id: "experiences", label: "Expériences professionnelles", visible: true },
  { id: "formation", label: "Formation", visible: true },
  { id: "skills", label: "Compétences", visible: true },
  { id: "languages", label: "Langues", visible: true },
  { id: "interests", label: "Centres d'intérêt", visible: true },
];

export const DEFAULT_CUSTOMIZATION: CVCustomization = {
  colors: { primary: "#00A651", secondary: "#E8B84B" },
  font: { display: "Playfair Display", body: "DM Sans", label: "Classique" },
  sectionOrder: [...DEFAULT_SECTIONS],
  density: 3,
  photoStyle: "circle",
  photoBorder: true,
  skillStyle: "bars",
};

const STORAGE_KEY = "cvexpress_customization";

export const saveCustomization = (c: CVCustomization) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(c));
};

export const loadCustomization = (): CVCustomization => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return { ...DEFAULT_CUSTOMIZATION, ...JSON.parse(raw) };
  } catch {}
  return { ...DEFAULT_CUSTOMIZATION };
};

export const getDensityStyles = (density: number) => {
  const map: Record<number, { lineHeight: number; padding: number; margin: number }> = {
    1: { lineHeight: 1.2, padding: 8, margin: 8 },
    2: { lineHeight: 1.35, padding: 12, margin: 11 },
    3: { lineHeight: 1.5, padding: 16, margin: 14 },
    4: { lineHeight: 1.65, padding: 20, margin: 17 },
    5: { lineHeight: 1.8, padding: 24, margin: 20 },
  };
  return map[density] || map[3];
};

export const getPhotoStyle = (style: CVCustomization["photoStyle"], size: number, primaryColor: string, hasBorder: boolean) => {
  const base: React.CSSProperties = {
    width: size,
    height: size,
    overflow: "hidden",
    border: hasBorder ? `3px solid ${primaryColor}` : "none",
    flexShrink: 0,
  };

  switch (style) {
    case "circle":
      return { ...base, borderRadius: "50%" };
    case "rounded":
      return { ...base, borderRadius: 12 };
    case "hexagon":
      return { ...base, clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)", borderRadius: 0 };
    case "none":
      return { display: "none" as const };
    default:
      return { ...base, borderRadius: "50%" };
  }
};

export const loadGoogleFont = (fontName: string) => {
  const id = `gfont-${fontName.replace(/\s+/g, "-")}`;
  if (document.getElementById(id)) return;
  
  // Skip system fonts
  if (["Georgia", "Arial"].includes(fontName)) return;

  const link = document.createElement("link");
  link.id = id;
  link.rel = "stylesheet";
  link.href = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(fontName)}:wght@300;400;500;600;700&display=swap`;
  document.head.appendChild(link);
};
